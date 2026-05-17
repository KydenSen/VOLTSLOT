import React, { useMemo, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  const { chargers, bookings } = useBooking();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const alerts = useMemo(() => {
    const allAlerts: Array<{
      id: string;
      severity: "critical" | "warning" | "info";
      title: string;
      message: string;
      timestamp: Date;
      actionable?: boolean;
    }> = [];

    // Faulty chargers
    chargers
      .filter((c) => c.status === "maintenance")
      .forEach((c) => {
        allAlerts.push({
          id: `maintenance-${c.id}`,
          severity: "warning",
          title: "Charger Under Maintenance",
          message: `${c.name} at ${c.location} is under maintenance`,
          timestamp: new Date(),
          actionable: true,
        });
      });

    // Pending payments
    const pendingPayments = bookings.filter((b) => b.payment_status === "pending" && b.status === "active");
    if (pendingPayments.length > 0) {
      allAlerts.push({
        id: "pending-payments",
        severity: "info",
        title: "Pending Payments",
        message: `${pendingPayments.length} active bookings with pending payments`,
        timestamp: new Date(),
        actionable: true,
      });
    }

    // High utilization
    const activeChargers = chargers.filter((c) => c.status === "in-use").length;
    const utilizationPercent = (activeChargers / chargers.length) * 100;
    if (utilizationPercent > 80) {
      allAlerts.push({
        id: "high-utilization",
        severity: "warning",
        title: "High Utilization",
        message: `System utilization is at ${utilizationPercent.toFixed(0)}%. Recommend capacity planning.`,
        timestamp: new Date(),
      });
    }

    // Recent overload
    const totalLoad = chargers
      .filter((c) => c.status === "in-use")
      .reduce((sum, c) => sum + c.power_kw, 0);
    if (totalLoad > 500) {
      allAlerts.push({
        id: "overload-warning",
        severity: "critical",
        title: "System Overload Risk",
        message: `Current load is ${totalLoad.toFixed(1)} kW. Maximum threshold is 500 kW.`,
        timestamp: new Date(),
        actionable: true,
      });
    }

    return allAlerts;
  }, [chargers, bookings]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

  const dismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(id));
  };

  const getSeverityStyles = (severity: string) => {
    const styles: Record<string, { bg: string; border: string; icon: React.ReactNode; title: string }> = {
      critical: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        title: "text-red-400",
      },
      warning: {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
        title: "text-orange-400",
      },
      info: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        icon: <Info className="h-5 w-5 text-blue-500" />,
        title: "text-blue-400",
      },
    };
    return styles[severity] || styles.info;
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-400">{alerts.filter((a) => a.severity === "critical").length}</p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Warnings</p>
          <p className="text-3xl font-bold text-orange-400">{alerts.filter((a) => a.severity === "warning").length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Information</p>
          <p className="text-3xl font-bold text-blue-400">{alerts.filter((a) => a.severity === "info").length}</p>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-3">
        {visibleAlerts.length === 0 ? (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-green-400 font-semibold">All Systems Operational</p>
            <p className="text-green-300 text-sm mt-1">No active alerts at the moment</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`${styles.bg} border ${styles.border} rounded-lg p-4 backdrop-blur-sm flex items-start gap-4 group transition-all`}
              >
                <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`${styles.title} font-semibold text-sm`}>{alert.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">{alert.timestamp.toLocaleTimeString()}</span>
                    {alert.actionable && (
                      <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Alert History */}
      {dismissedAlerts.size > 0 && (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4">Dismissed Alerts ({dismissedAlerts.size})</h3>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-gray-300 text-sm"
            onClick={() => setDismissedAlerts(new Set())}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Alert Configuration */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">⚙️ Alert Preferences</h3>
        <div className="space-y-3">
          {[
            { label: "System Overload", enabled: true },
            { label: "Charger Maintenance", enabled: true },
            { label: "Payment Issues", enabled: true },
            { label: "High Utilization", enabled: false },
            { label: "Station Offline", enabled: true },
            { label: "Performance Degradation", enabled: false },
          ].map((pref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm">{pref.label}</span>
              <input
                type="checkbox"
                defaultChecked={pref.enabled}
                className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notification Channels */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">📬 Notification Channels</h3>
        <div className="space-y-3">
          {[
            { label: "In-App Notifications", enabled: true },
            { label: "Email Alerts", enabled: true },
            { label: "SMS Alerts", enabled: false },
            { label: "Dashboard Widget", enabled: true },
          ].map((channel, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-gray-300 text-sm">{channel.label}</span>
              <input
                type="checkbox"
                defaultChecked={channel.enabled}
                className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
