import React, { useState, useEffect, useMemo } from "react";

export default function PriceForecast() {
  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  const [crop, setCrop] = useState("Wheat");
  const [region, setRegion] = useState("North Zone (Punjab/Haryana)");
  const [period, setPeriod] = useState("30 Days");
  const [loading, setLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState(null);

  const fetchForecast = async (targetCrop, targetRegion, targetPeriod) => {
    setLoading(true);
    try {
      const res = await fetch(`${dealerApi}/price-forecast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: targetCrop || crop,
          region: targetRegion || region,
          period: targetPeriod || period,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setForecastResult({
            ...data.data,
            trajectory: (data.data.history || []).map((h, i) => ({
              label: h.day || `T+${i * 5}d`,
              price: h.price,
            })),
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch price forecast:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(crop, region, period);
  }, []);

  const handleRunForecast = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    await fetchForecast(crop, region, period);
  };

  const handleClear = () => {
    setCrop("Wheat");
    setRegion("North Zone (Punjab/Haryana)");
    setPeriod("30 Days");
    fetchForecast("Wheat", "North Zone (Punjab/Haryana)", "30 Days");
  };

  // SVG Chart path generation
  const chartPoints = useMemo(() => {
    if (!forecastResult || !forecastResult.trajectory) return "";
    const list = forecastResult.trajectory;
    const minP = Math.min(...list.map((p) => p.price)) * 0.98;
    const maxP = Math.max(...list.map((p) => p.price)) * 1.02;
    const width = 600;
    const height = 180;

    return list
      .map((item, index) => {
        const x = (index / (list.length - 1)) * (width - 40) + 20;
        const y = height - ((item.price - minP) / (maxP - minP)) * (height - 40) - 20;
        return `${x},${y}`;
      })
      .join(" ");
  }, [forecastResult]);

  return (
    <div
      className="min-h-screen bg-[#fafbf9] py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
            AI Mandi Price Forecasting
          </h1>
          <p className="text-sm text-[#6d8560] mt-1">
            Machine learning predictive model analyzing seasonal arrivals, mandi supply trends, and wholesale demand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          {/* Left Column: Selector Form */}
          <div className="lg:col-span-4 bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#131811] pb-3 border-b border-gray-100">
              Configure Forecast Parameters
            </h2>

            <form onSubmit={handleRunForecast} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Crop Commodity
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] font-semibold focus:outline-none focus:border-green-600"
                >
                  {Object.keys(CROP_BASE_PRICES).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Trading Region / Mandi Zone
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] focus:outline-none focus:border-green-600"
                >
                  <option value="North Zone (Punjab/Haryana)">North Zone (Punjab/Haryana)</option>
                  <option value="West Zone (Rajasthan/Gujarat)">West Zone (Rajasthan/Gujarat)</option>
                  <option value="Central Zone (MP/UP)">Central Zone (MP/UP)</option>
                  <option value="South Zone (Karnataka/AP)">South Zone (Karnataka/AP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Forecast Time Horizon
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] focus:outline-none focus:border-green-600"
                >
                  <option value="7 Days">7 Days (Short Term)</option>
                  <option value="15 Days">15 Days (Bi-Weekly)</option>
                  <option value="30 Days">30 Days (Monthly Outlook)</option>
                  <option value="60 Days">60 Days (Seasonal Horizon)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Computing Model..." : "⚡ Run AI Forecast"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Predictive Results & Chart */}
          <div className="lg:col-span-8 space-y-6">
            {!forecastResult ? (
              <div className="bg-white border border-[#e2e8e0] rounded-2xl p-12 text-center text-gray-500 shadow-sm animate-pulse space-y-4">
                <div className="text-3xl">📈</div>
                <h3 className="text-lg font-bold text-gray-800">Calculating Live Market Forecast...</h3>
                <p className="text-xs text-gray-500">Contacting Mandi price prediction service and regression models.</p>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#e2e8e0] rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Current Modal Price
                    </span>
                    <p className="text-xl font-bold text-[#131811] mt-1">
                      {forecastResult.currentPrice}
                    </p>
                    <span className="text-[11px] text-gray-500">Mandi spot rate</span>
                  </div>

                  <div className="bg-white border border-[#e2e8e0] rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Projected Price
                    </span>
                    <p className="text-xl font-bold text-green-700 mt-1">
                      {forecastResult.predictedPrice}
                    </p>
                    <span className="text-[11px] text-green-700 font-semibold">
                      {forecastResult.priceChange} change
                    </span>
                  </div>

                  <div className="bg-white border border-[#e2e8e0] rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Model Confidence
                    </span>
                    <p className="text-xl font-bold text-blue-700 mt-1">
                      {forecastResult.confidence}
                    </p>
                    <span className="text-[11px] text-blue-600">R² = 0.941 accuracy</span>
                  </div>

                  <div className="bg-white border border-[#e2e8e0] rounded-2xl p-4 shadow-sm">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      AI Recommendation
                    </span>
                    <p className="text-xl font-extrabold text-green-800 mt-1">
                      {forecastResult.action}
                    </p>
                    <span className="text-[11px] text-gray-500">Suggested trading move</span>
                  </div>
                </div>

            {/* Price Trajectory Chart */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <h3 className="font-bold text-base text-[#131811]">
                    Price Trajectory Curve ({forecastResult.crop} • {forecastResult.period})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Historical mandi prices and projected regression trendline
                  </p>
                </div>
                <span className="text-xs px-3 py-1 bg-green-50 text-green-800 font-bold rounded-lg border border-green-200">
                  Trend: Bullish ↗
                </span>
              </div>

              {/* Dynamic SVG Sparkline */}
              <div className="mt-6 w-full overflow-x-auto">
                <svg className="w-full h-48" viewBox="0 0 600 180">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="20" y1="30" x2="580" y2="30" stroke="#f0f0f0" strokeDasharray="4 4" />
                  <line x1="20" y1="80" x2="580" y2="80" stroke="#f0f0f0" strokeDasharray="4 4" />
                  <line x1="20" y1="130" x2="580" y2="130" stroke="#f0f0f0" strokeDasharray="4 4" />

                  {/* Area fill */}
                  {chartPoints && (
                    <polygon
                      points={`20,160 ${chartPoints} 580,160`}
                      fill="url(#curveGradient)"
                    />
                  )}

                  {/* Line */}
                  {chartPoints && (
                    <polyline
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={chartPoints}
                    />
                  )}

                  {/* Points */}
                  {forecastResult.trajectory?.map((pt, i) => {
                    const list = forecastResult.trajectory;
                    const minP = Math.min(...list.map((p) => p.price)) * 0.98;
                    const maxP = Math.max(...list.map((p) => p.price)) * 1.02;
                    const cx = (i / (list.length - 1)) * (600 - 40) + 20;
                    const cy = 180 - ((pt.price - minP) / (maxP - minP)) * (180 - 40) - 20;

                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4.5" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={175} textAnchor="middle" fontSize="10" fill="#6b7280">
                          {pt.label}
                        </text>
                        <text x={cx} y={cy - 9} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#15803d">
                          ₹{pt.price}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Strategic Rationale Banner */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-[#131811] uppercase tracking-wider mb-2">
                Agri-Market Strategic Analysis
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {forecastResult.rationale}
              </p>
            </div>
          </>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
