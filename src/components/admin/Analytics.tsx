import React, { useMemo } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";

const Analytics = () => {
  const { bookings, chargers, stations } = useBooking();

  const analytics = useMemo(() => {
    // Daily bookings
    const dailyBookings: Record<string, number> = {};
    bookings.forEach((b) => {
      const day = new Date(b.date).toLocaleDateString();
      dailyBookings[day] = (dailyBookings[day] || 0) + 1;
    });

    // Revenue by charger type
    const revenueByType: Record<string, number> = {};
    bookings.forEach((b) => {
      revenueByType[b.charger_type] = (revenueByType[b.charger_type] || 0) + b.amount;
    });

    // Station utilization
    const stationBookings: Record<string, number> = {};
    bookings.forEach((b) => {
      if (b.station_id) {
        stationBookings[b.station_id] = (stationBookings[b.station_id] || 0) + 1;
      }
    });

    // Peak hours
    const peakHours: Record<string, number> = {};
    bookings.forEach((b) => {
      const hour = parseInt(b.start_time.split(":")[0]);
      peakHours[hour] = (peakHours[hour] || 0) + 1;
    });

    const totalRevenue = bookings.filter((b) => b.payment_status === "paid").reduce((sum, b) => sum + b.amount, 0);
    const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0;
    const totalDuration = bookings.reduce((sum, b) => sum + b.duration_min, 0);
    const avgDuration = bookings.length > 0 ? totalDuration / bookings.length : 0;

    return {
      dailyBookings,
      revenueByType,
      stationBookings,
      peakHours,
      totalRevenue,
      avgBookingValue,
      avgDuration,
    };
  }, [bookings]);

  // Chart data visualization
  const chartData = (data: Record<string, number>) => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([key, value]) => ({ label: key, value }));
  };

  const peakData = chartData(analytics.peakHours);
  const stationData = chartData(analytics.stationBookings).map(({ label, value }) => ({
    label: stations.find((s) => s.id === label)?.name.slice(0, 10) || label.slice(0, 10),
    value,
  }));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-green-400">₹{analytics.totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Paid bookings only</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Avg Booking Value</p>
          <p className="text-3xl font-bold text-cyan-400">₹{analytics.avgBookingValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Per booking</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-blue-400">{bookings.length}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Avg Duration</p>
          <p className="text-3xl font-bold text-purple-400">{analytics.avgDuration.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-1">Minutes per booking</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Peak Hours Demand</h3>
          </div>
          <div className="space-y-3">
            {peakData.map(({ label, value }, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">{label}:00</span>
                  <span className="text-cyan-400 font-semibold text-sm">{value}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${(value / Math.max(...peakData.map((d) => d.value))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Type */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Revenue by Charger Type</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.revenueByType).map(([type, revenue], idx) => {
              const total = Object.values(analytics.revenueByType).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (revenue / total) * 100 : 0;
              const colors = ["from-green-500 to-emerald-600", "from-orange-500 to-amber-600"];
              return (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm capitalize">{type} Charging</span>
                    <span className="text-white font-semibold">₹{revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[idx] || colors[0]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Stations */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-bold text-white">Top Performing Stations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Station</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Bookings</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stationData.map(({ label, value }, idx) => {
                const station = stations.find((s) => s.name.slice(0, 10) === label);
                const stationRevenue = bookings
                  .filter((b) => b.station_id === station?.id && b.payment_status === "paid")
                  .reduce((sum, b) => sum + b.amount, 0);
                return (
                  <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-gray-300 font-medium">{label}</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">{value}</td>
                    <td className="py-3 px-4 text-green-400 font-semibold">₹{stationRevenue.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Trends */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <LineChart className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Recent Daily Bookings</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(analytics.dailyBookings)
            .slice(-7)
            .reverse()
            .map(([day, count], idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">{day}</span>
                  <span className="text-blue-400 font-semibold">{count}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{
                      width: `${(count / Math.max(...Object.values(analytics.dailyBookings))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
