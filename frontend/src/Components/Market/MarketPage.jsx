import React from "react";

const getCommodityIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("tomato")) return "🍅";
  if (lower.includes("potato")) return "🥔";
  if (lower.includes("onion")) return "🧅";
  if (lower.includes("wheat")) return "🌾";
  if (lower.includes("rice") || lower.includes("paddy")) return "🍚";
  if (lower.includes("banana")) return "🍌";
  if (lower.includes("brinjal") || lower.includes("eggplant")) return "🍆";
  if (lower.includes("chilli")) return "🌶️";
  if (lower.includes("ginger")) return "🫚";
  if (lower.includes("corn") || lower.includes("maize")) return "🌽";
  if (lower.includes("apple")) return "🍎";
  if (lower.includes("bhindi") || lower.includes("gourd")) return "🥒";
  if (lower.includes("cotton")) return "🌱";
  if (lower.includes("mustard")) return "🌼";
  return "🌿";
};

const MarketPlace = ({
  records = [],
  loading = false,
  isLive = true,
  totalCount = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  viewMode = "cards",
  selectedCommodity,
  onSelectCommodity,
  commodityOptions = [],
}) => {
  // Quick calculations for stats bar
  const prices = records.map((r) => r.modalPrice).filter((p) => p > 0);
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const avgPrice =
    prices.length > 0
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
              <span className="text-xs uppercase tracking-widest font-bold text-green-200">
                Official data.gov.in Real-Time Mandi Prices
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Daily APMC Market Rates
            </h1>
            <p className="text-green-100 text-xs sm:text-sm mt-1 max-w-xl">
              Live wholesale agricultural arrival rates across mandis in India. Updated in real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center sm:text-right">
            <div className="text-xs text-green-200 uppercase font-semibold">
              Live Records In Feed
            </div>
            <div className="text-2xl font-black text-white">
              {totalCount.toLocaleString()}+
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-green-200 font-medium">Average Modal Rate</span>
            <div className="text-lg font-bold">
              ₹{avgPrice.toLocaleString()}{" "}
              <span className="text-xs font-normal text-green-200">/ Qtl</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <span className="text-xs text-green-200 font-medium">Highest in Batch</span>
            <div className="text-lg font-bold text-emerald-200">
              ₹{highestPrice.toLocaleString()}{" "}
              <span className="text-xs font-normal text-green-200">/ Qtl</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 col-span-2 sm:col-span-1">
            <span className="text-xs text-green-200 font-medium">Lowest in Batch</span>
            <div className="text-lg font-bold text-amber-200">
              ₹{lowestPrice.toLocaleString()}{" "}
              <span className="text-xs font-normal text-green-200">/ Qtl</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Commodity Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {commodityOptions.slice(0, 10).map((commodity) => {
          const isActive = selectedCommodity === commodity;
          return (
            <button
              key={commodity}
              onClick={() => onSelectCommodity(commodity)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-green-700 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
              }`}
            >
              <span>{getCommodityIcon(commodity)}</span>
              <span>{commodity}</span>
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton / State */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 mb-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent mb-3"></div>
          <p className="text-gray-600 font-semibold text-sm">
            Fetching latest Mandi rates from data.gov.in...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && records.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 mb-6">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Mandi Rates Found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
            No prices matched your current filter criteria. Try choosing a different commodity or state.
          </p>
          <button
            onClick={() => onSelectCommodity("All Products")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition cursor-pointer"
          >
            View All Commodities
          </button>
        </div>
      )}

      {/* Content: Cards View */}
      {!loading && viewMode === "cards" && records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {records.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 bg-green-50 rounded-xl">
                      {getCommodityIcon(item.commodity)}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {item.commodity}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.variety !== "Other" ? item.variety : "Standard"} • Grade:{" "}
                        <span className="font-semibold text-gray-700">{item.grade}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full">
                    {item.arrivalDate}
                  </span>
                </div>

                {/* Location */}
                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl mb-4 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-green-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-bold text-gray-800 truncate">
                    {item.market}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="truncate">
                    {item.district}, {item.state}
                  </span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Modal Price</span>
                  <div className="text-2xl font-black text-green-700 leading-none mt-0.5">
                    ₹{item.modalPrice.toLocaleString()}
                    <span className="text-xs font-medium text-gray-500"> / Qtl</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ≈ ₹{item.pricePerKg} / kg
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400">Min - Max Range</span>
                  <div className="text-xs font-bold text-gray-700 mt-0.5">
                    ₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}
                  </div>
                  <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold mt-1">
                    APMC Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content: Table View */}
      {!loading && viewMode === "table" && records.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider border-b">
                  <th className="p-3.5 font-bold">Commodity</th>
                  <th className="p-3.5 font-bold">Market / APMC</th>
                  <th className="p-3.5 font-bold">State & District</th>
                  <th className="p-3.5 font-bold">Variety / Grade</th>
                  <th className="p-3.5 font-bold text-right">Min Price</th>
                  <th className="p-3.5 font-bold text-right">Max Price</th>
                  <th className="p-3.5 font-bold text-right">Modal Rate</th>
                  <th className="p-3.5 font-bold text-right">Per Kg</th>
                  <th className="p-3.5 font-bold text-center">Arrival</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {records.map((item, idx) => (
                  <tr key={idx} className="hover:bg-green-50/40 transition-colors">
                    <td className="p-3.5 font-bold text-gray-900 flex items-center gap-1.5 whitespace-nowrap">
                      <span>{getCommodityIcon(item.commodity)}</span>
                      <span>{item.commodity}</span>
                    </td>
                    <td className="p-3.5 font-medium text-gray-800 whitespace-nowrap">
                      {item.market}
                    </td>
                    <td className="p-3.5 text-gray-600 text-xs whitespace-nowrap">
                      {item.district}, {item.state}
                    </td>
                    <td className="p-3.5 text-gray-600 text-xs whitespace-nowrap">
                      {item.variety} ({item.grade})
                    </td>
                    <td className="p-3.5 text-right font-medium text-gray-600 whitespace-nowrap">
                      ₹{item.minPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-medium text-gray-600 whitespace-nowrap">
                      ₹{item.maxPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-bold text-green-700 whitespace-nowrap">
                      ₹{item.modalPrice.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-medium text-gray-800 whitespace-nowrap">
                      ₹{item.pricePerKg}
                    </td>
                    <td className="p-3.5 text-center text-xs text-gray-500 whitespace-nowrap">
                      {item.arrivalDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {records.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500">
            Showing Page <span className="font-bold text-gray-800">{page}</span> of{" "}
            <span className="font-bold text-gray-800">{totalPages}</span> (10 records per page)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-xs font-bold px-3 py-1.5 bg-green-50 text-green-800 rounded-xl border border-green-200">
              {page}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPlace;
