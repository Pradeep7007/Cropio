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
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div>
                <h1 className="text-[#121b0e] tracking-tight text-[32px] font-bold leading-tight">
                  Smart Yield Estimator
                </h1>
                <p className="text-[#67974e] text-sm">
                  Adjust the parameters below to see real-time yield predictions.
                </p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-green-600 font-medium animate-pulse">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  Calculating...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Crop Select */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#121b0e] px-1">Select Crop</span>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="soybean">Soybean</option>
                  <option value="barley">Barley</option>
                  <option value="cotton">Cotton</option>
                </select>
              </label>

              {/* Land Area Input */}
              <label className="flex flex-col gap-2">
                <span className="text-sm font-bold text-[#121b0e] px-1">Land Area (Acres)</span>
                <input
                  type="number"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  placeholder="e.g. 2.5"
                  className={inputClass}
                />
              </label>

              {/* Dynamic Selects */}
              {Object.keys(options).map((key) => (
                <label key={key} className="flex flex-col gap-2">
                  <span className="text-sm font-bold text-[#121b0e] px-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {options[key].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            {/* Yield Result Section */}
            <div className="p-4 mt-6">
              <div 
                className={`relative overflow-hidden rounded-3xl transition-all duration-500 shadow-xl ${loading ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'}`}
                style={{
                  background: 'linear-gradient(135deg, #1d4d0f 0%, #3a7a24 100%)',
                  minHeight: '240px'
                }}
              >
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                <div className="relative p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-white text-2xl font-bold tracking-tight">Predicted Yield Analysis</h2>
                    </div>

                    {yieldData ? (
                      <div className="space-y-2">
                        <h3 className="text-white text-xl font-semibold">{yieldData.title}</h3>
                        <p className="text-white/80 text-base leading-relaxed max-w-lg">
                          {yieldData.description}
                        </p>
                      </div>
                    ) : (
                      <p className="text-white/60 animate-pulse">Initialising estimator...</p>
                    )}
                  </div>

                  {yieldData && yieldData.title !== "Error" && (
                    <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 min-w-[200px]">
                      <span className="text-white/70 text-sm uppercase tracking-widest font-bold mb-1">Estimated Efficiency</span>
                      <div className="text-5xl font-black text-white">
                        {yieldData.description.includes('%') ? yieldData.description.match(/(\d+)%/)[0] : '85%'}
                      </div>
                      <div className="mt-2 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white transition-all duration-1000" 
                          style={{ width: yieldData.description.includes('%') ? yieldData.description.match(/(\d+)%/)[0] : '85%' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

