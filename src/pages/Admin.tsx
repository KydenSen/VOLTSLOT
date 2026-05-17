import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LayoutDashboard, Zap, Users, BarChart3, Settings, LogOut, Menu, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/AdminDashboard";
import StationManagement from "@/components/admin/StationManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import LoadManagement from "@/components/admin/LoadManagement";
import UserManagement from "@/components/admin/UserManagement";
import Analytics from "@/components/admin/Analytics";
import AdminSettings from "@/components/admin/AdminSettings";

type AdminTab = "dashboard" | "stations" | "bookings" | "load" | "users" | "analytics" | "settings";

const Admin = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">You do not have admin privileges</p>
        </div>
      </div>
    );
  }

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "stations", label: "Stations", icon: <Zap className="h-5 w-5" /> },
    { id: "bookings", label: "Bookings", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "load", label: "Load Management", icon: <AlertCircle className="h-5 w-5" /> },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "stations":
        return <StationManagement />;
      case "bookings":
        return <BookingManagement />;
      case "load":
        return <LoadManagement />;
      case "users":
        return <UserManagement />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900/95 border-r border-slate-700 transition-all duration-300 fixed h-screen z-40 flex flex-col`}
      >
        {/* Logo/Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">VoltSlot⚡</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-400 border border-cyan-500/50"
                  : "text-gray-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {sidebarOpen && (
            <div className="text-xs space-y-1 pb-3">
              <p className="text-gray-500">Admin</p>
              <p className="text-gray-300 font-medium truncate">{user.fullName}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            onClick={logout}
            className="w-full justify-start text-gray-400 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-slate-900/50 border-b border-slate-700 px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white capitalize">{activeTab.replace(/([A-Z])/g, " $1").trim()}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <p className="text-gray-500">Admin Panel</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
