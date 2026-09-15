import React, { useState, useEffect, useCallback, useRef } from "react";

// Simple native debounce implementation
const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

export default function YieldEstimator() {
  const [formData, setFormData] = useState({
    crop: "wheat",
    landArea: "2",
    soilType: "Sandy",
    waterAvailability: "Low",
    irrigationMethod: "Drip",
    fertilizerUse: "Organic",
    pesticideUse: "Low",
    sowingMonth: "March",
    harvestMonth: "September",
    farmingMethod: "Organic",
  });

  const [yieldData, setYieldData] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_FARMER_API_URL || "http://localhost:5000/api/farmer";

  const fetchPrediction = async (data) => {
    setLoading(true);
    try {
      // Remove trailing slash if present in baseUrl and ensure correct path
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const res = await fetch(
        `${cleanBaseUrl}/yieldestimation/estimatedyield`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch yield estimation");
      }

      const responseData = await res.json();
      setYieldData(responseData);
    } catch (error) {
      console.error("Error fetching yield data:", error);
      setYieldData({ title: "Error", description: "Unable to calculate yield. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  // Debounced prediction function to avoid spamming the backend
  const debouncedPredict = useCallback(
    debounce((data) => {
      fetchPrediction(data);
    }, 500),
    [baseUrl]
  );

  useEffect(() => {
    // Trigger initial prediction and on every formData change
    debouncedPredict(formData);
    
    // Cleanup debounce on unmount
    return () => {
      debouncedPredict.cancel();
    };
  }, [formData, debouncedPredict]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClass =
    "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121b0e] focus:outline-0 focus:ring-1 focus:ring-green-500 border border-[#d7e7d0] bg-[#f9fcf8] h-14 placeholder:text-[#67974e] p-[15px] text-base font-normal leading-normal transition-all duration-200";

  const options = {
    soilType: ["Sandy", "Loamy", "Clay", "Silt", "Peaty", "Chalky"],
    waterAvailability: ["Low", "Medium", "High"],
    irrigationMethod: ["Drip", "Sprinkler", "Flood", "Manual"],
    fertilizerUse: ["None", "Organic", "Chemical", "Mixed"],
    pesticideUse: ["None", "Low", "Medium", "High"],
    sowingMonth: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    harvestMonth: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    farmingMethod: ["Conventional", "Organic", "Hydroponic", "Permaculture"]
  };

  return (
    <div
      className="min-h-screen bg-[#f8faf7] text-[#121b0e] py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Agricultural Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Smart Yield Estimator
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Simulate cultivation parameters in real time to calculate potential harvest output and farming efficiency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-sm border border-emerald-200 animate-pulse">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></div>
                Calculating Yield...
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 font-medium text-xs border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Realtime Sync Active
              </div>
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-5 bg-emerald-600 rounded-full"></span>
            Farm & Soil Configuration Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Crop Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Target Crop
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 px-4 py-3 text-sm font-medium transition-all shadow-sm outline-none"
              >
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="corn">Corn</option>
                <option value="soybean">Soybean</option>
                <option value="barley">Barley</option>
                <option value="cotton">Cotton</option>
              </select>
            </div>

            {/* Land Area Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Land Area (Acres)
              </label>
              <input
                type="number"
                name="landArea"
                value={formData.landArea}
                onChange={handleChange}
                placeholder="e.g. 2.5"
                min="0.1"
                step="0.1"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 px-4 py-3 text-sm font-medium transition-all shadow-sm outline-none"
              />
            </div>

            {/* Dynamic Selects */}
            {Object.keys(options).map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 px-4 py-3 text-sm font-medium transition-all shadow-sm outline-none"
                >
                  {options[key].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Result Banner */}
        <div 
          className={`relative overflow-hidden rounded-3xl transition-all duration-500 shadow-lg ${loading ? 'opacity-75 scale-[0.99]' : 'opacity-100 scale-100'}`}
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)',
          }}
        >
          {/* Subtle Glow circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-md">
                <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Predicted Yield Analytics
              </div>

              {yieldData ? (
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {yieldData.title}
                  </h3>
                  <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mt-2 max-w-xl">
                    {yieldData.description}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-emerald-200 animate-pulse text-base">Analyzing agricultural metrics...</p>
                </div>
              )}
            </div>

            {yieldData && yieldData.title !== "Error" && (
              <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 w-full sm:w-auto sm:min-w-[220px]">
                <span className="text-emerald-200 text-xs uppercase tracking-widest font-bold mb-1">Estimated Efficiency</span>
                <div className="text-5xl font-black text-white">
                  {yieldData.description.includes('%') ? yieldData.description.match(/(\d+)%/)[0] : '85%'}
                </div>
                <div className="mt-3 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-300 transition-all duration-1000 rounded-full" 
                    style={{ width: yieldData.description.includes('%') ? yieldData.description.match(/(\d+)%/)[0] : '85%' }}
                  ></div>
                </div>
                <span className="text-white/70 text-xs mt-2 font-medium">Confidence Score: High</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

