import React, { useState, useMemo } from "react";

const SOIL_PRESETS = {
  "alluvial": {
    name: "Alluvial Soil (Optimal Loam)",
    ph: 7.2,
    organicMatter: 2.4,
    nitrogen: 320,
    phosphorus: 38,
    potassium: 240,
    moisture: 35,
  },
  "black": {
    name: "Black Soil (Clayey)",
    ph: 7.8,
    organicMatter: 1.8,
    nitrogen: 210,
    phosphorus: 22,
    potassium: 310,
    moisture: 42,
  },
  "red": {
    name: "Red Laterite Soil (Acidic / Low P)",
    ph: 5.6,
    organicMatter: 1.1,
    nitrogen: 160,
    phosphorus: 12,
    potassium: 140,
    moisture: 22,
  },
  "sandy": {
    name: "Sandy Coastal Soil (Leached)",
    ph: 6.8,
    organicMatter: 0.8,
    nitrogen: 120,
    phosphorus: 15,
    potassium: 95,
    moisture: 18,
  },
};

export default function SoilHealthMonitor() {
  const [dataSource, setDataSource] = useState("Soil Health Card (Govt Lab)");
  const [soilData, setSoilData] = useState(SOIL_PRESETS.alluvial);
  const [submittedData, setSubmittedData] = useState(SOIL_PRESETS.alluvial);
  const [successToast, setSuccessToast] = useState("");

  const handleInputChange = (field, val) => {
    const num = parseFloat(val);
    setSoilData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? "" : num,
    }));
  };

  const handleApplyPreset = (key) => {
    if (SOIL_PRESETS[key]) {
      setSoilData(SOIL_PRESETS[key]);
      setSubmittedData(SOIL_PRESETS[key]);
      setSuccessToast(`Applied preset: ${SOIL_PRESETS[key].name}`);
      setTimeout(() => setSuccessToast(""), 3000);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setSubmittedData({ ...soilData });
    setSuccessToast("Soil health data updated and recalculated successfully!");
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Dynamic Soil Health Score Algorithm (0-100)
  const analysis = useMemo(() => {
    const { ph = 7, organicMatter = 2, nitrogen = 280, phosphorus = 30, potassium = 200 } =
      submittedData;

    let score = 50;

    // pH scoring (optimal: 6.2 - 7.5)
    let phStatus = "Optimal";
    if (ph < 6.0) {
      score -= 15;
      phStatus = "Acidic";
    } else if (ph > 7.8) {
      score -= 12;
      phStatus = "Alkaline";
    } else {
      score += 15;
    }

    // Nitrogen scoring (optimal: 280 - 450 kg/ha)
    let nPct = Math.min(100, Math.round((nitrogen / 400) * 100));
    let nStatus = "Optimal";
    if (nitrogen < 200) {
      score -= 10;
      nStatus = "Low";
    } else if (nitrogen > 500) {
      score -= 5;
      nStatus = "Excess";
    } else {
      score += 12;
    }

    // Phosphorus scoring (optimal: 25 - 50 kg/ha)
    let pPct = Math.min(100, Math.round((phosphorus / 45) * 100));
    let pStatus = "Optimal";
    if (phosphorus < 20) {
      score -= 10;
      pStatus = "Low";
    } else {
      score += 12;
    }

    // Potassium scoring (optimal: 180 - 320 kg/ha)
    let kPct = Math.min(100, Math.round((potassium / 280) * 100));
    let kStatus = "Optimal";
    if (potassium < 150) {
      score -= 10;
      kStatus = "Low";
    } else {
      score += 11;
    }

    // Organic matter scoring (optimal: 1.8% - 3.5%)
    if (organicMatter < 1.0) score -= 8;
    else if (organicMatter >= 2.0) score += 10;

    const finalScore = Math.min(100, Math.max(25, Math.round(score)));

    // Dynamic tailored recommendations
    const suggestions = [];
    if (phStatus === "Acidic") {
      suggestions.push({
        title: "Apply Agricultural Lime (CaCO3)",
        desc: `Soil pH of ${ph} is acidic. Broadcast 2-3 quintals of lime per hectare 3 weeks prior to sowing to restore neutral availability.`,
        tag: "pH Correction",
      });
    } else if (phStatus === "Alkaline") {
      suggestions.push({
        title: "Apply Agricultural Gypsum & Sulfur",
        desc: `Soil pH of ${ph} is alkaline. Incorporate gypsum (2 tons/ha) alongside organic compost to lower sodium saturation.`,
        tag: "pH Correction",
      });
    }

    if (nStatus === "Low") {
      suggestions.push({
        title: "Boost Bio-Nitrogen with Green Manuring",
        desc: `Available nitrogen (${nitrogen} kg/ha) is deficient. Intercrop with legumes (Dhaincha/Sunhemp) or apply vermicompost with Azotobacter.`,
        tag: "Nitrogen Boost",
      });
    }

    if (pStatus === "Low") {
      suggestions.push({
        title: "Incorporate Phosphate Rich Organic Manure (PROM)",
        desc: `Phosphorus is at ${phosphorus} kg/ha. Apply rock phosphate blended with compost to enhance root development and tillering.`,
        tag: "Root Growth",
      });
    }

    if (kStatus === "Low") {
      suggestions.push({
        title: "Apply Bio-Potash or Wood Ash",
        desc: `Potassium level (${potassium} kg/ha) is low. Apply Muriate of Potash (MOP) or bio-potash to enhance pest resistance and grain weight.`,
        tag: "Vigor & Quality",
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        title: "Maintain Balanced Micro-Nutrient Fertigation",
        desc: "Current N-P-K and pH levels are well-balanced. Continue regular organic matter recycling and periodic soil testing.",
        tag: "Maintenance",
      });
    }

    return {
      finalScore,
      phStatus,
      nPct,
      nStatus,
      pPct,
      pStatus,
      kPct,
      kStatus,
      suggestions,
    };
  }, [submittedData]);

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#fafbf9] overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e1e] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-green-500 animate-in fade-in slide-in-from-bottom-5">
          <span className="text-green-400 font-bold">✓</span>
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
              Soil Health Monitoring & Analysis
            </h1>
            <p className="text-sm text-[#6d8560] mt-1">
              Dynamic nutrient tracking, automated fertility scoring, and tailored agronomic amendments.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Quick Presets:</span>
            {Object.entries(SOIL_PRESETS).map(([k, p]) => (
              <button
                key={k}
                type="button"
                onClick={() => handleApplyPreset(k)}
                className="text-xs px-2.5 py-1 bg-white hover:bg-green-50 text-green-800 border border-green-200 rounded-lg transition font-medium cursor-pointer shadow-xs"
              >
                {p.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          
          {/* Left Column: Data Input Form */}
          <div className="lg:col-span-5 bg-white border border-[#e2e8e0] rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-[#131811] pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Input Soil Parameters</span>
              <span className="text-xs font-normal text-gray-400">Live Simulator</span>
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Data Source
                </label>
                <select
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] focus:outline-none focus:border-green-600"
                >
                  <option value="Soil Health Card (Govt Lab)">Soil Health Card (Govt Lab)</option>
                  <option value="IoT Digital Probe Sensor">IoT Digital Probe Sensor</option>
                  <option value="Mobile Agricultural Kit">Mobile Agricultural Kit</option>
                  <option value="Farmer Manual Observation">Farmer Manual Observation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    pH Value (0-14)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="11"
                    value={soilData.ph}
                    onChange={(e) => handleInputChange("ph", e.target.value)}
                    className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm font-semibold text-[#131811] focus:outline-none focus:border-green-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Organic Matter (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={soilData.organicMatter}
                    onChange={(e) => handleInputChange("organicMatter", e.target.value)}
                    className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm font-semibold text-[#131811] focus:outline-none focus:border-green-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={soilData.nitrogen}
                  onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm font-semibold text-[#131811] focus:outline-none focus:border-green-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phosphorus (P) - kg/ha
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={soilData.phosphorus}
                    onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                    className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm font-semibold text-[#131811] focus:outline-none focus:border-green-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Potassium (K) - kg/ha
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="800"
                    value={soilData.potassium}
                    onChange={(e) => handleInputChange("potassium", e.target.value)}
                    className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm font-semibold text-[#131811] focus:outline-none focus:border-green-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-sm transition shadow-sm cursor-pointer mt-2"
              >
                ⚡ Recalculate & Update Soil Data
              </button>
            </form>
          </div>

          {/* Right Column: Dynamic Visualizer & Suggestions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Score Banner */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Overall Soil Health Index
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl font-extrabold text-[#131811]">
                    {analysis.finalScore}
                  </span>
                  <span className="text-sm font-semibold text-gray-400">/ 100</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      analysis.finalScore >= 80
                        ? "bg-green-100 text-green-800"
                        : analysis.finalScore >= 60
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {analysis.finalScore >= 80
                      ? "Healthy & Fertile"
                      : analysis.finalScore >= 60
                      ? "Moderately Balanced"
                      : "Deficient - Action Required"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  pH reading: <b>{submittedData.ph}</b> ({analysis.phStatus}) • Organic Carbon: <b>{submittedData.organicMatter}%</b>
                </p>
              </div>

              {/* Circular Gauge Graphic */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      analysis.finalScore >= 80
                        ? "text-green-600"
                        : analysis.finalScore >= 60
                        ? "text-amber-500"
                        : "text-red-500"
                    }
                    strokeDasharray={`${analysis.finalScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-lg font-bold text-gray-800">
                  {analysis.finalScore}%
                </span>
              </div>
            </div>

            {/* Dynamic Nutrient Level Bars */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#131811] mb-4">
                Primary Nutrient Levels (NPK)
              </h3>

              <div className="space-y-4">
                {/* Nitrogen */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700">Nitrogen (N) - {submittedData.nitrogen} kg/ha</span>
                    <span className={analysis.nStatus === "Optimal" ? "text-green-700" : "text-amber-600"}>
                      {analysis.nStatus} (Target: 280-450)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        analysis.nStatus === "Optimal" ? "bg-green-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${analysis.nPct}%` }}
                    />
                  </div>
                </div>

                {/* Phosphorus */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700">Phosphorus (P) - {submittedData.phosphorus} kg/ha</span>
                    <span className={analysis.pStatus === "Optimal" ? "text-green-700" : "text-amber-600"}>
                      {analysis.pStatus} (Target: 25-50)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        analysis.pStatus === "Optimal" ? "bg-green-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${analysis.pPct}%` }}
                    />
                  </div>
                </div>

                {/* Potassium */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700">Potassium (K) - {submittedData.potassium} kg/ha</span>
                    <span className={analysis.kStatus === "Optimal" ? "text-green-700" : "text-amber-600"}>
                      {analysis.kStatus} (Target: 180-320)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        analysis.kStatus === "Optimal" ? "bg-green-600" : "bg-amber-500"
                      }`}
                      style={{ width: `${analysis.kPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Agronomic Action Recommendations */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-[#131811] mb-1">
                Custom Agronomic Action Plan
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Generated automatically based on your specific pH and NPK measurements:
              </p>

              <div className="space-y-3">
                {analysis.suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-100 bg-[#fafbf9] flex items-start gap-3"
                  >
                    <span className="text-xl">🌱</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                        <span className="text-[10px] uppercase font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
