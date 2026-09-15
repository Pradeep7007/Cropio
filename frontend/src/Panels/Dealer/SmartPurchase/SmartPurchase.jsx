import React, { useState, useEffect, useMemo } from "react";

export default function SmartPurchase() {
  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(250000);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [holdingDays, setHoldingDays] = useState(30);
  const [mandiZone, setMandiZone] = useState("North Hub (Punjab / Haryana)");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${dealerApi}/smart-purchase-rates`);
        if (res.ok) {
          const data = await res.json();
          if (data.rates) {
            setRates(data.rates);
          }
        }
      } catch (err) {
        console.warn("Error fetching smart purchase rates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [dealerApi]);

  const calculation = useMemo(() => {
    const info = rates[selectedCrop] || {
      buyPrice: 2420,
      projectedSell: 2750,
      storagePerMonth: 25,
      risk: "Low",
      seasonalInsight: "Market procurement rates actively updating from Mandi APMC feed.",
    };
    const buyRate = info.buyPrice || 2400;
    const sellRate = info.projectedSell || 2700;

    const maxQuintals = Math.floor(budget / buyRate);
    const totalProcurementCost = maxQuintals * buyRate;

    // Logistics & handling estimate (~₹50/Q)
    const logisticsCost = maxQuintals * 50;

    // Storage cost for holding period
    const months = holdingDays / 30;
    const storageCost = Math.round(maxQuintals * (info.storagePerMonth || 25) * months);

    const totalInvestment = totalProcurementCost + logisticsCost + storageCost;
    const projectedRevenue = maxQuintals * sellRate;
    const netProfit = projectedRevenue - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(1) : "0.0";

    return {
      maxQuintals,
      totalProcurementCost,
      logisticsCost,
      storageCost,
      totalInvestment,
      projectedRevenue,
      netProfit,
      roiPercentage,
      risk: info.risk,
      insight: info.seasonalInsight,
      buyRate,
      sellRate,
    };
  }, [rates, budget, selectedCrop, holdingDays]);

  return (
    <div
      className="min-h-screen bg-[#fafbf9] py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
            Smart Procurement & Purchase Strategy
          </h1>
          <p className="text-sm text-[#6d8560] mt-1">
            Algorithmic procurement calculator balancing buying rates, warehouse holding costs, and seasonal wholesale returns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          
          {/* Left: Interactive Procurement Parameters */}
          <div className="lg:col-span-5 bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#131811] pb-3 border-b border-gray-100">
              Procurement Configuration
            </h2>

            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Allocated Procurement Budget (₹)
                  </label>
                  <span className="text-xs font-bold text-green-700">
                    ₹{budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg accent-green-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                  <span>₹50,000</span>
                  <span>₹10,00,000</span>
                  <span>₹20,00,000</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Commodity
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] font-semibold focus:outline-none focus:border-green-600"
                >
                  {Object.keys(COMMODITY_BASE).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sourcing Mandi Zone
                </label>
                <select
                  value={mandiZone}
                  onChange={(e) => setMandiZone(e.target.value)}
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3.5 py-2.5 text-sm text-[#131811] focus:outline-none focus:border-green-600"
                >
                  <option value="North Hub (Punjab / Haryana)">North Hub (Punjab / Haryana)</option>
                  <option value="Central Hub (Madhya Pradesh / UP)">Central Hub (Madhya Pradesh / UP)</option>
                  <option value="Western Hub (Rajasthan / Gujarat)">Western Hub (Rajasthan / Gujarat)</option>
                  <option value="Southern Hub (Karnataka / AP)">Southern Hub (Karnataka / AP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Planned Holding / Storage Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setHoldingDays(d)}
                      className={`text-xs font-bold py-2 rounded-xl transition cursor-pointer ${
                        holdingDays === d
                          ? "bg-green-700 text-white shadow-xs"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Procurement Financial Feasibility & Margin */}
          <div className="lg:col-span-7 space-y-6">
            {/* ROI Overview Card */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                    Projected Financial Return
                  </span>
                  <h3 className="text-xl font-extrabold text-[#131811] mt-0.5">
                    {selectedCrop} Batch Strategy ({calculation.maxQuintals} Quintals)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      calculation.risk === "Low"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : calculation.risk === "Moderate"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}
                  >
                    Risk: {calculation.risk}
                  </span>
                </div>
              </div>

              {/* Major Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-gray-50">
                  <span className="text-xs text-gray-500 block">Total Investment</span>
                  <span className="text-xl font-bold text-gray-900 mt-1 block">
                    ₹{calculation.totalInvestment.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400">Crop + Transit + Warehousing</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <span className="text-xs text-gray-500 block">Gross Revenue</span>
                  <span className="text-xl font-bold text-gray-900 mt-1 block">
                    ₹{calculation.projectedRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400">@ ₹{calculation.sellRate}/Q wholesale</span>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <span className="text-xs text-green-800 block font-semibold">Net Expected Margin</span>
                  <span className="text-xl font-extrabold text-green-800 mt-1 block">
                    +₹{calculation.netProfit.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-green-700">
                    {calculation.roiPercentage}% ROI
                  </span>
                </div>
              </div>

              {/* Cost Breakdown Details */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Direct Farm Gate / Mandi Purchase Cost ({calculation.maxQuintals} Q @ ₹{calculation.buyRate}/Q):</span>
                  <span className="font-semibold text-gray-900">₹{calculation.totalProcurementCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics & Freight Handling (Estimated ₹50/Q):</span>
                  <span className="font-semibold text-gray-900">₹{calculation.logisticsCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Warehouse Storage & Fumigation ({holdingDays} days):</span>
                  <span className="font-semibold text-gray-900">₹{calculation.storageCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tactical AI Recommendation Banner */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900">
                  Market Timing & Procurement Advice
                </h4>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {calculation.insight} Recommended action:{" "}
                <b className="text-green-800">
                  Acquire {calculation.maxQuintals} Quintals from {mandiZone} within the next 5-7 days
                </b>{" "}
                to lock in current mandi floor pricing ahead of expected trade rallies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
