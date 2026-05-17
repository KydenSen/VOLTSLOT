import React, { useState, useMemo } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Shield, Ban, CheckCircle, Mail } from "lucide-react";

const UserManagement = () => {
  const { bookings } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended" | "verified">("all");

  // Mock users from bookings
  const users = useMemo(() => {
    const uniqueUsers: Record<string, any> = {};
    bookings.forEach((booking) => {
      if (!uniqueUsers[booking.user_id]) {
        uniqueUsers[booking.user_id] = {
          id: booking.user_id,
          name: `User ${booking.user_id.slice(0, 4).toUpperCase()}`,
          email: `user${booking.user_id.slice(0, 4)}@example.com`,
          status: Math.random() > 0.2 ? "active" : "suspended",
          verified: Math.random() > 0.3,
          joinDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          totalBookings: 0,
          totalSpent: 0,
        };
      }
      uniqueUsers[booking.user_id].totalBookings += 1;
      uniqueUsers[booking.user_id].totalSpent += booking.amount;
    });
    return Object.values(uniqueUsers);
  }, [bookings]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchMatch =
        user.id.includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = filterStatus === "all" || (filterStatus === "verified" ? user.verified : user.status === filterStatus);
      return searchMatch && statusMatch;
    });
  }, [users, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    verified: users.filter((u) => u.verified).length,
  }), [users]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Users</p>
          <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Active</p>
          <p className="text-3xl font-bold text-green-400">{stats.active}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Verified</p>
          <p className="text-3xl font-bold text-blue-400">{stats.verified}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Suspended</p>
          <p className="text-3xl font-bold text-red-400">{stats.suspended}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-xs">
          <input
            type="text"
            placeholder="Search by user ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="verified">Verified</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">User ID</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Email</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Verified</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Join Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Bookings</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 text-gray-300 text-xs font-mono">{user.id.slice(0, 8)}</td>
                  <td className="py-4 px-6 text-white font-medium">{user.name}</td>
                  <td className="py-4 px-6 text-gray-300 text-sm">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-gray-600"></div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">{user.joinDate.toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-gray-300 font-semibold">{user.totalBookings}</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">₹{user.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
