import React, { useState, useEffect, useMemo } from "react";

export default function DemandSupplyDashboard() {
  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30 Days");
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchDemandSupply = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${dealerApi}/demand-supply`);
        if (res.ok) {
          const data = await res.json();
          if (data.commodities && Array.isArray(data.commodities)) {
            setCommodities(data.commodities);
          }
        }
      } catch (err) {
        console.warn("Error fetching dynamic demand/supply:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDemandSupply();
  }, [dealerApi]);

  const filteredCommodities = useMemo(() => {
    if (selectedFilter === "All") return commodities;
    if (selectedFilter === "Deficit") {
      return commodities.filter((c) => c.deficit?.startsWith("-"));
    }
    if (selectedFilter === "Surplus") {
      return commodities.filter((c) => c.deficit?.startsWith("+"));
    }
    return commodities;
  }, [commodities, selectedFilter]);

  const summary = useMemo(() => {
    const totalDeficitCount = commodities.filter((c) => c.deficit?.startsWith("-")).length;
    const totalSurplusCount = commodities.filter((c) => c.deficit?.startsWith("+")).length;
    return { totalDeficitCount, totalSurplusCount, totalTracked: commodities.length };
  }, [commodities]);

  return (
    <div
      className="min-h-screen bg-[#fafbf9] py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
              Agricultural Demand & Supply Intelligence
            </h1>
            <p className="text-sm text-[#6d8560] mt-1">
              Real-time regional mandi arrival deficits, wholesale mill procurement volumes, and supply fulfillment.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#d9e1d6] p-1.5 rounded-xl">
            {["7 Days", "30 Days", "90 Days"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  timeRange === range
                    ? "bg-green-700 text-white shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Live Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Tracked Commodities
            </span>
            <p className="text-3xl font-extrabold text-[#131811] mt-1">
              {summary.totalTracked} Staples
            </p>
            <span className="text-xs text-gray-500 font-medium">Grains, pulses & vegetables</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
              Under-Supplied Crops (Deficit)
            </span>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">
              {summary.totalDeficitCount} Commodities
            </p>
            <span className="text-xs text-amber-700 font-medium">High procurement opportunity</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-green-700 tracking-wider">
              Adequate Supply (Surplus)
            </span>
            <p className="text-3xl font-extrabold text-green-700 mt-1">
              {summary.totalSurplusCount} Commodities
            </p>
            <span className="text-xs text-green-700 font-medium">Stable pricing & storage safe</span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mt-6">
          <span className="text-xs font-bold text-gray-500">Filter by Market State:</span>
          {["All", "Deficit", "Surplus"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                selectedFilter === f
                  ? "bg-green-700 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Commodity Demand Supply Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredCommodities.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg text-[#131811]">{item.name}</h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-gray-500 block">Buyer Demand:</span>
                    <span className="font-bold text-sm text-gray-900">{item.currentDemand}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50">
                    <span className="text-gray-500 block">Mandi Inflow:</span>
                    <span className="font-bold text-sm text-gray-900">{item.currentSupply}</span>
                  </div>
                </div>

                {/* Fulfillment Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Supply Fulfillment Ratio</span>
                    <span className={item.supplyFulfillment < 90 ? "text-amber-600" : "text-green-700"}>
                      {item.supplyFulfillment}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.supplyFulfillment < 85
                          ? "bg-red-500"
                          : item.supplyFulfillment < 100
                          ? "bg-amber-500"
                          : "bg-green-600"
                      }`}
                      style={{ width: `${Math.min(100, item.supplyFulfillment)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Avg Wholesale Rate:</span>
                    <span className="font-bold text-gray-900">{item.avgMandiPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spot Price Trend:</span>
                    <span
                      className={`font-bold ${
                        item.priceTrend.startsWith("+") ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      {item.priceTrend} ({timeRange})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Major Mandis:</span>
                    <span className="font-medium text-gray-700 text-right">{item.majorMandis}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">Net Balance:</span>
                <span
                  className={`font-extrabold ${
                    item.deficit.startsWith("-") ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {item.deficit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
