import React, { useMemo, useState } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, TrendingUp, TrendingDown } from "lucide-react";

const LoadManagement = () => {
  const { stations, chargers, bookings, settings, updateSettings } = useBooking();
  const [maxLoadThreshold, setMaxLoadThreshold] = useState(settings.maxLoadThreshold || 500);

  React.useEffect(() => {
    setMaxLoadThreshold(settings.maxLoadThreshold || 500);
  }, [settings.maxLoadThreshold]);

  const handleThresholdBlur = () => {
    if (maxLoadThreshold !== settings.maxLoadThreshold) {
      updateSettings({ maxLoadThreshold });
    }
  };
  const [priorityMode, setPriorityMode] = useState<"balanced" | "fast" | "normal">("balanced");

  const loadStats = useMemo(() => {
    const bookedChargerIds = new Set(
      bookings.filter((b) => b.status === "active").map((b) => b.charger_id)
    );
    const activeChargers = chargers.filter((c) => c.status === "in-use" || bookedChargerIds.has(c.id));
    const currentLoad = activeChargers.reduce((sum, c) => sum + c.power_kw, 0);
    const totalCapacity = chargers.reduce((sum, c) => sum + c.power_kw, 0);
    
    // Calculate per-station load
    const stationLoad: Record<string, number> = {};
    activeChargers.forEach((charger) => {
      if (charger.station_id) {
        stationLoad[charger.station_id] = (stationLoad[charger.station_id] || 0) + charger.power_kw;
      }
    });

    const overloadStations = Object.entries(stationLoad)
      .filter(([_, load]) => load > maxLoadThreshold / stations.length)
      .map(([stationId, load]) => ({
        stationId,
        load,
        station: stations.find((s) => s.id === stationId)?.name || "Unknown",
      }));

    const loadPercentage = (currentLoad / totalCapacity) * 100;
    const isOverloaded = currentLoad > maxLoadThreshold;

    return {
      currentLoad,
      maxLoadThreshold,
      totalCapacity,
      loadPercentage,
      isOverloaded,
      activeChargers: activeChargers.length,
      overloadStations,
      stationLoad,
    };
  }, [chargers, stations, bookings, maxLoadThreshold]);

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return "from-red-500 to-red-600";
    if (percentage >= 70) return "from-orange-500 to-orange-600";
    if (percentage >= 50) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-emerald-600";
  };

  const getLoadTextColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 70) return "text-orange-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Load Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Load Gauge */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Real-Time Load Monitoring ⚡</h3>
          
          <div className="space-y-4">
            {/* Gauge */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border-8 border-slate-700"></div>
                <div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${getLoadColor(loadStats.loadPercentage)} opacity-70 transition-all duration-500`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((loadStats.loadPercentage / 100) * Math.PI - Math.PI / 2)}% ${
                      50 + 50 * Math.sin((loadStats.loadPercentage / 100) * Math.PI - Math.PI / 2)
                    }%)`,
                  }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-4xl font-bold ${getLoadTextColor(loadStats.loadPercentage)}`}>{loadStats.loadPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Load Usage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Details */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Current Load</p>
                <p className="text-xl font-bold text-cyan-400">{loadStats.currentLoad.toFixed(1)} kW</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Threshold</p>
                <p className="text-xl font-bold text-blue-400">{loadStats.maxLoadThreshold} kW</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Capacity</p>
                <p className="text-xl font-bold text-purple-400">{loadStats.totalCapacity.toFixed(1)} kW</p>
              </div>
            </div>

            {/* Load Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Network Load</span>
                <span className={`text-sm font-semibold ${getLoadTextColor(loadStats.loadPercentage)}`}>
                  {loadStats.isOverloaded && "⚠️ "} {loadStats.currentLoad.toFixed(1)}/{loadStats.maxLoadThreshold} kW
                </span>
              </div>
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full bg-gradient-to-r ${getLoadColor(loadStats.loadPercentage)} transition-all duration-500`}
                  style={{ width: `${Math.min(loadStats.loadPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Overload Alert */}
          {loadStats.isOverloaded && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold text-sm">System Overload Detected</p>
                <p className="text-red-300 text-xs mt-1">Current load exceeds threshold. Recommend reducing charging or enabling energy-saving mode.</p>
              </div>
            </div>
          )}
        </div>

        {/* Load Control Panel */}
        <div className="space-y-4">
          {/* Settings */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h4 className="text-white font-semibold mb-4">⚙️ Load Control</h4>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Max Load Threshold (kW)</label>
                <input
                  type="number"
                  value={maxLoadThreshold}
                  onChange={(e) => setMaxLoadThreshold(Number(e.target.value))}
                  onBlur={handleThresholdBlur}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
                <p className="text-xs text-gray-500 mt-1">System will trigger alerts if exceeded</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Priority Mode</label>
                <select
                  value={priorityMode}
                  onChange={(e) => setPriorityMode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="balanced">Balanced (Default)</option>
                  <option value="fast">Fast Charging Priority</option>
                  <option value="normal">Normal Charging Priority</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Prioritize charger types during peak load</p>
              </div>

              <div className="pt-2 space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Reduce Load
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Increase Capacity
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h4 className="text-white font-semibold mb-4">📊 Stats</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Chargers</span>
                <span className="text-cyan-400 font-semibold">{loadStats.activeChargers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Safety Margin</span>
                <span className={`font-semibold ${(loadStats.maxLoadThreshold - loadStats.currentLoad > 0) ? "text-green-400" : "text-red-400"}`}>
                  {(loadStats.maxLoadThreshold - loadStats.currentLoad).toFixed(1)} kW
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg per Station</span>
                <span className="text-blue-400 font-semibold">
                  {(loadStats.currentLoad / stations.length).toFixed(1)} kW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Station Load Breakdown */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">Station-Wise Load Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => {
            const load = loadStats.stationLoad[station.id] || 0;
            const stationCapacity = chargers
              .filter((c) => c.station_id === station.id)
              .reduce((sum, c) => sum + c.power_kw, 0);
            const loadPercent = stationCapacity > 0 ? (load / stationCapacity) * 100 : 0;

            return (
              <div
                key={station.id}
                className={`bg-slate-800/50 border ${
                  load > maxLoadThreshold / stations.length ? "border-red-500/50 bg-red-500/10" : "border-slate-700"
                } rounded-lg p-4 transition-colors`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-white text-sm">{station.name}</p>
                    <p className="text-xs text-gray-500">{station.address}</p>
                  </div>
                  {load > maxLoadThreshold / stations.length && <AlertTriangle className="h-4 w-4 text-red-400" />}
                </div>
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        loadPercent > 80 ? "from-red-500 to-red-600" : "from-cyan-500 to-blue-500"
                      } transition-all`}
                      style={{ width: `${Math.min(loadPercent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{load.toFixed(1)}/{stationCapacity.toFixed(1)} kW</span>
                    <span className={`font-semibold ${loadPercent > 80 ? "text-red-400" : "text-cyan-400"}`}>{loadPercent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overload Prevention */}
      {loadStats.overloadStations.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-red-400 mb-4">🚨 Overload Alerts</h3>
          <div className="space-y-3">
            {loadStats.overloadStations.map((alert) => (
              <div key={alert.stationId} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{alert.station}</p>
                  <p className="text-red-400 text-xs">Current Load: {alert.load.toFixed(1)} kW</p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-sm">Reduce Load</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadManagement;
