import React, { useState, useMemo } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Check, X, Clock } from "lucide-react";

const BookingManagement = () => {
  const { bookings } = useBooking();
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [filterPayment, setFilterPayment] = useState<"all" | "paid">("all");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const statusMatch = filterStatus === "all" || b.status === filterStatus;
      const paymentMatch = filterPayment === "all" || b.payment_status === filterPayment;
      return statusMatch && paymentMatch;
    });
  }, [bookings, filterStatus, filterPayment]);

  const stats = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: "bg-green-500/20", text: "text-green-400", icon: <Clock className="h-3 w-3" /> },
      completed: { bg: "bg-blue-500/20", text: "text-blue-400", icon: <Check className="h-3 w-3" /> },
      cancelled: { bg: "bg-red-500/20", text: "text-red-400", icon: <X className="h-3 w-3" /> },
    };
    return badges[status] || badges.completed;
  };

  const getPaymentBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      paid: { bg: "bg-green-500/20", text: "text-green-400" },
    };
    return badges[status] || badges.paid;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
          <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">{stats.active}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Completed</p>
          <p className="text-3xl font-bold text-blue-400">{stats.completed}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Cancelled</p>
          <p className="text-3xl font-bold text-red-400">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Payment</label>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Booking ID</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Station</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Charger Type</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Date & Time</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Duration</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusBadge = getStatusBadge(booking.status);
                const paymentBadge = getPaymentBadge(booking.payment_status);
                return (
                  <tr key={booking.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-gray-300 text-xs font-mono">{booking.id.slice(0, 8)}</td>
                    <td className="py-4 px-6 text-gray-300 text-sm">{booking.stations?.name || "N/A"}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                        {booking.charger_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm">
                      {new Date(booking.date).toLocaleDateString()} {booking.start_time}
                    </td>
                    <td className="py-4 px-6 text-gray-300 text-sm">{booking.duration_min} min</td>
                    <td className="py-4 px-6 text-gray-300 font-semibold">₹{booking.amount}</td>
                    <td className="py-4 px-6">
                      <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        {booking.status}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${paymentBadge.bg} ${paymentBadge.text}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
