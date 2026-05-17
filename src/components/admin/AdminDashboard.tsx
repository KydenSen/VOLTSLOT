import React, { useMemo } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Zap, Users, Activity, IndianRupee } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const AdminDashboard = () => {
  const { stations, chargers, bookings } = useBooking();

  const stats = useMemo(() => {
    // Get today's date in YYYY-MM-DD
    const todayStr = new Date().toISOString().split("T")[0];

    // Calculate today's revenue
    const todayRevenue = bookings
      .filter((b) => b.date === todayStr && b.payment_status === "paid")
      .reduce((sum, b) => sum + b.amount, 0);

    // Active Users (unique users currently with active bookings)
    const activeUserIds = new Set(
      bookings.filter((b) => b.status === "active").map((b) => b.user_id)
    );
    const activeUsers = activeUserIds.size;

    const activeCharging = bookings.filter((b) => b.status === "active").length;

    const bookedChargerIds = new Set(
      bookings.filter((b) => b.status === "active").map((b) => b.charger_id)
    );

    const totalPowerUsage = Array.from(bookedChargerIds).reduce((sum, chargerId) => {
      const charger = chargers.find((c) => c.id === chargerId);
      return sum + (charger ? charger.power_kw : 0);
    }, 0);

    return {
      todayRevenue,
      activeUsers,
      activeCharging,
      totalPowerUsage,
    };
  }, [chargers, bookings]);

  // Data for "Load on each station" Chart
  const loadData = useMemo(() => {
    return stations.map((station) => {
      const stationChargers = chargers.filter((c) => c.station_id === station.id);
      
      const bookedChargerIds = new Set(
        bookings
          .filter((b) => b.station_id === station.id && b.status === "active")
          .map((b) => b.charger_id)
      );

      const activeLoad = Array.from(bookedChargerIds).reduce((sum, chargerId) => {
        const charger = stationChargers.find((c) => c.id === chargerId);
        return sum + (charger ? charger.power_kw : 0);
      }, 0);

      const capacity = stationChargers.reduce((sum, c) => sum + c.power_kw, 0);
      
      // Shorten long station names for the chart
      const shortName = station.name.length > 15 ? station.name.substring(0, 15) + '...' : station.name;

      return {
        name: shortName,
        Load: activeLoad,
        Capacity: capacity,
      };
    });
  }, [stations, chargers, bookings]);

  // Data for "Monthly Revenue" Chart (Last 6 months)
  const monthlyRevenueData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataMap: Record<string, number> = {};
    
    const now = new Date();
    // Initialize last 6 months in chronological order
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dataMap[`${months[d.getMonth()]} ${d.getFullYear()}`] = 0;
    }

    bookings.forEach((b) => {
      if (b.payment_status === "paid") {
        const bDate = new Date(b.date);
        const key = `${months[bDate.getMonth()]} ${bDate.getFullYear()}`;
        if (dataMap[key] !== undefined) {
          dataMap[key] += b.amount;
        }
      }
    });

    return Object.entries(dataMap).map(([month, revenue]) => ({
      month,
      Revenue: revenue,
    }));
  }, [bookings]);

  const dashboardCards = [
    {
      title: "Today's Revenue",
      value: `₹${stats.todayRevenue.toLocaleString()}`,
      icon: <IndianRupee className="h-6 w-6" />,
      bgGradient: "from-green-500/20 to-emerald-500/20",
      textColor: "text-green-400",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <Users className="h-6 w-6" />,
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      textColor: "text-blue-400",
    },
    {
      title: "Current Total Load",
      value: `${stats.totalPowerUsage.toFixed(1)} kW`,
      icon: <Zap className="h-6 w-6" />,
      bgGradient: "from-purple-500/20 to-pink-500/20",
      textColor: "text-purple-400",
    },
    {
      title: "Active Sessions",
      value: stats.activeCharging,
      icon: <Activity className="h-6 w-6" />,
      bgGradient: "from-yellow-500/20 to-orange-500/20",
      textColor: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.bgGradient} border border-slate-700 rounded-xl p-6 backdrop-blur-sm hover:border-slate-600 transition-all duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-800/50 ${card.textColor}`}>{card.icon}</div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-2">{card.title}</p>
            <p className={`${card.textColor} text-3xl font-bold`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Monthly Revenue</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Bar dataKey="Revenue" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Load on Each Station Chart */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Station Load (kW)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Load" fill="#c084fc" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="Capacity" fill="#334155" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table (Essential for monitoring) */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Booking ID</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Station</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(-5).reverse().map((booking) => (
                <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-gray-300 font-mono text-xs">{booking.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-gray-300">{booking.stations?.name || "N/A"}</td>
                  <td className="py-3 px-4 text-gray-300">{booking.date} | {booking.start_time}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        booking.status === "active" ? "bg-green-500/20 text-green-400" : 
                        booking.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                        "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 font-semibold">₹{booking.amount}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
