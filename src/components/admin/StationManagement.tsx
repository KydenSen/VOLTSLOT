import React, { useState, useMemo } from "react";
import { useBooking } from "@/contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, AlertCircle, Power } from "lucide-react";

const StationManagement = () => {
  const { stations, chargers, addStation, updateStation, deleteStation } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", address: "", latitude: 0, longitude: 0, total_chargers: 0 });

  const handleOpenModal = (station?: any) => {
    if (station) {
      setEditingStation(station);
      setFormData({
        name: station.name,
        address: station.address,
        latitude: station.latitude,
        longitude: station.longitude,
        total_chargers: station.total_chargers
      });
    } else {
      setEditingStation(null);
      setFormData({ name: "", address: "", latitude: 0, longitude: 0, total_chargers: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editingStation) {
      await updateStation(editingStation.id, formData);
    } else {
      await addStation(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this station?")) {
      await deleteStation(id);
    }
  };

  const handleToggleStatus = async (station: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = station.status === "maintenance" ? "active" : "maintenance";
    await updateStation(station.id, { status: newStatus });
  };

  const filteredStations = useMemo(() => {
    return stations.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stations, searchTerm]);

  const getStationStats = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    const isStationMaintenance = station?.status === "maintenance";
    const stationChargers = chargers.filter((c) => c.station_id === stationId);
    return {
      total: stationChargers.length,
      available: isStationMaintenance ? 0 : stationChargers.filter((c) => c.status === "available").length,
      inUse: isStationMaintenance ? 0 : stationChargers.filter((c) => c.status === "in-use").length,
      maintenance: isStationMaintenance ? stationChargers.length : stationChargers.filter((c) => c.status === "maintenance").length,
      totalPower: stationChargers.reduce((sum, c) => sum + c.power_kw, 0),
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex-1 mr-4">
          <input
            type="text"
            placeholder="Search stations by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        <Button 
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          onClick={() => handleOpenModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Station
        </Button>
      </div>

      {/* Stations Table */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Station Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Address</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Chargers</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Power (kW)</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station, idx) => {
                const stats = getStationStats(station.id);
                const healthPercent = stats.total > 0 ? ((stats.available + stats.inUse) / stats.total) * 100 : 0;
                const statusColor =
                  station.status === "maintenance"
                    ? "text-red-400 bg-red-500/20"
                    : stats.maintenance > 0
                      ? "text-orange-400 bg-orange-500/20"
                      : stats.inUse > 0
                        ? "text-green-400 bg-green-500/20"
                        : "text-blue-400 bg-blue-500/20";

                return (
                  <tr
                    key={station.id}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-white font-medium">{station.name}</td>
                    <td className="py-4 px-6 text-gray-400 text-xs max-w-xs truncate">{station.address}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{stats.total}</span>
                        <span className="text-gray-500 text-xs">
                          ({stats.available} available, {stats.inUse} in use)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: healthPercent > 50 ? "#22c55e" : "#ef4444" }}></div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                          {station.status === "maintenance" ? "⚠️ Maintenance" : stats.maintenance > 0 ? "⚠️ Partial Maint." : stats.inUse > 0 ? "🟢 Active" : "🔵 Idle"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{stats.totalPower.toFixed(1)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:text-blue-300"
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(station); }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`${station.status === 'maintenance' ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}`}
                          title={station.status === 'maintenance' ? "Set to Active" : "Set to Maintenance"}
                          onClick={(e) => handleToggleStatus(station, e)}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300"
                          onClick={(e) => handleDelete(station.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>



      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Stations</p>
          <p className="text-3xl font-bold text-cyan-400">{stations.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Total Chargers</p>
          <p className="text-3xl font-bold text-green-400">{chargers.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Available</p>
          <p className="text-3xl font-bold text-blue-400">
            {chargers.filter((c) => {
              const s = stations.find(st => st.id === c.station_id);
              return c.status === "available" && s?.status !== "maintenance";
            }).length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2">Maintenance</p>
          <p className="text-3xl font-bold text-red-400">
            {chargers.filter((c) => {
              const s = stations.find(st => st.id === c.station_id);
              return c.status === "maintenance" || s?.status === "maintenance";
            }).length}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingStation ? "Edit Station" : "Add Station"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Total Chargers</label>
                <input
                  type="number"
                  value={formData.total_chargers}
                  onChange={(e) => setFormData({ ...formData, total_chargers: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;
