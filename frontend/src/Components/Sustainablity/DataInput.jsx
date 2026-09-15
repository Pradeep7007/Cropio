import React, { useState } from "react";

const DataInput = () => {
  const [activeMode, setActiveMode] = useState("Manual Input");
  const [formData, setFormData] = useState({
    waterUsage: 1100,
    chemicalReduction: 40,
    cropRotation: true,
    solarEnergyPct: 50,
    compostApplied: 4,
  });
  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setToast("Sustainability farm metrics saved & recalculated successfully!");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="p-4">
      {toast && (
        <div className="mb-4 p-3.5 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold rounded-xl flex items-center gap-2">
          <span>✓</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between pb-3">
        <h2 className="text-[22px] font-bold tracking-tight text-[#121b0e]">
          Sustainability Farm Data Entry
        </h2>
        <div className="flex gap-2">
          {["Manual Input", "Automated IoT Feed"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveMode(label)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeMode === label
                  ? "bg-green-700 text-white shadow-xs"
                  : "bg-[#ebf3e7] text-[#121b0e] hover:bg-green-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
        {activeMode === "Manual Input" ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Water Usage (Liters/Hectare)
                </label>
                <input
                  type="number"
                  name="waterUsage"
                  value={formData.waterUsage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chemical Fertilizer Reduction (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="chemicalReduction"
                  value={formData.chemicalReduction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Renewable Solar Energy Usage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="solarEnergyPct"
                  value={formData.solarEnergyPct}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Organic Compost Applied (Tons/Acre)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  name="compostApplied"
                  value={formData.compostApplied}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="cropRotation"
                  name="cropRotation"
                  checked={formData.cropRotation}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="cropRotation" className="text-sm font-medium text-gray-800 cursor-pointer">
                  Practicing Systematic Crop Rotation (Legume alternation)
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl transition shadow-sm cursor-pointer"
              >
                ⚡ Recalculate & Save Farm Sustainability
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center text-sm text-gray-600">
            <p className="font-semibold text-green-900 mb-1">
              📡 Smart In-Field Telemetry Connected
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Real-time wireless soil sensors and smart water meters streaming data directly from Field Block A & Block B. Synchronized every 15 minutes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInput;
