import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Eye, EyeOff } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";

const AdminSettings = () => {
  const { settings: globalSettings, updateSettings } = useBooking();

  const [settings, setSettings] = useState({
    maxLoadThreshold: globalSettings.maxLoadThreshold ?? 500,
    pricePerKwh: globalSettings.pricePerKwh ?? 12,
    normalChargerPricePerMin: globalSettings.normalChargerPricePerMin ?? 2,
    fastChargerPricePerMin: globalSettings.fastChargerPricePerMin ?? 5,
    autoReduceLoadAt: globalSettings.autoReduceLoadAt ?? 450,
    enableEnergyHarvesting: globalSettings.enableEnergyHarvesting ?? true,
    enablePredictiveAnalytics: globalSettings.enablePredictiveAnalytics ?? true,
    enableDynamicPricing: globalSettings.enableDynamicPricing ?? false,
  });

  React.useEffect(() => {
    setSettings(prev => ({
      ...prev,
      ...globalSettings
    }));
  }, [globalSettings]);


  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Save Notification */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Settings saved successfully!
        </div>
      )}

      {/* Load Configuration */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">⚡ Load Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Max Load Threshold (kW)</label>
            <input
              type="number"
              value={settings.maxLoadThreshold}
              onChange={(e) => handleChange("maxLoadThreshold", Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <p className="text-xs text-gray-500 mt-2">System will trigger alerts when exceeded</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Auto Reduce Load At (kW)</label>
            <input
              type="number"
              value={settings.autoReduceLoadAt}
              onChange={(e) => handleChange("autoReduceLoadAt", Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <p className="text-xs text-gray-500 mt-2">Automatically reduce charging when reached</p>
          </div>
        </div>
      </div>

      {/* Pricing Configuration */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">💰 Pricing Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Normal Charger (₹/min)</label>
            <input
              type="number"
              step="0.5"
              value={settings.normalChargerPricePerMin}
              onChange={(e) => handleChange("normalChargerPricePerMin", Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <p className="text-xs text-gray-500 mt-2">7.4 kW AC charger (₹{settings.normalChargerPricePerMin * 60}/hr)</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Fast Charger (₹/min)</label>
            <input
              type="number"
              step="0.5"
              value={settings.fastChargerPricePerMin}
              onChange={(e) => handleChange("fastChargerPricePerMin", Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <p className="text-xs text-gray-500 mt-2">50 kW DC charger (₹{settings.fastChargerPricePerMin * 60}/hr)</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Price Per kWh (₹)</label>
            <input
              type="number"
              value={settings.pricePerKwh}
              onChange={(e) => handleChange("pricePerKwh", Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            />
            <p className="text-xs text-gray-500 mt-2">Cost per kilowatt-hour</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Enable Dynamic Pricing</label>
            <button
              onClick={() => handleChange("enableDynamicPricing", !settings.enableDynamicPricing)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                settings.enableDynamicPricing
                  ? "bg-green-600/30 text-green-400 border border-green-500/50"
                  : "bg-gray-600/30 text-gray-400 border border-gray-500/50"
              }`}
            >
              {settings.enableDynamicPricing ? "Enabled" : "Disabled"}
            </button>
            <p className="text-xs text-gray-500 mt-2">Adjust prices based on demand</p>
          </div>
        </div>
      </div>





      {/* Features Configuration */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-white mb-4">🚀 Advanced Features</h3>
        <div className="space-y-3">
          {[
            {
              key: "enableEnergyHarvesting",
              label: "Energy Harvesting (Solar/Wind Integration)",
              desc: "Allow system to utilize renewable energy sources",
            },
            {
              key: "enablePredictiveAnalytics",
              label: "Predictive Analytics",
              desc: "Use AI to predict demand and optimize operations",
            },
          ].map((feature) => (
            <div key={feature.key} className="flex items-start justify-between p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">{feature.label}</p>
                <p className="text-xs text-gray-400 mt-1">{feature.desc}</p>
              </div>
              <button
                onClick={() => handleChange(feature.key, !settings[feature.key as keyof typeof settings])}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ml-4 ${
                  settings[feature.key as keyof typeof settings]
                    ? "bg-green-600/30 text-green-400 border border-green-500/50"
                    : "bg-gray-600/30 text-gray-400 border border-gray-500/50"
                }`}
              >
                {settings[feature.key as keyof typeof settings] ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </div>



      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-700 text-gray-300 hover:text-white">
          Reset to Default
        </Button>
        <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
