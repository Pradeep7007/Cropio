import React from "react";

const MarketFilter = ({
  searchTerm,
  setSearchTerm,
  selectedState,
  setSelectedState,
  stateOptions = [],
  selectedDistrict,
  setSelectedDistrict,
  districtOptions = [],
  selectedMarket,
  setSelectedMarket,
  marketOptions = [],
  selectedCommodity,
  setSelectedCommodity,
  commodityOptions = [],
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  viewMode,
  setViewMode,
  onReset,
  onRefresh,
  loading,
}) => {
  return (
    <div className="w-full lg:w-80 flex flex-col gap-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Mandi Filters
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-green-700 hover:text-green-900 font-semibold cursor-pointer underline"
        >
          Reset All
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Search Commodity / Mandi
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search crop, mandi, district..."
            className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="w-4 h-4 text-[#6d8560] absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Sort By (Price, District, Market, Commodity, Date) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Sort Prices By
        </label>
        <select
          className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="price_desc">Modal Price: High to Low (₹↓)</option>
          <option value="price_asc">Modal Price: Low to High (₹↑)</option>
          <option value="district_asc">District Wise: A → Z</option>
          <option value="market_asc">Market / Mandi Wise: A → Z</option>
          <option value="commodity_asc">Commodity Name: A → Z</option>
          <option value="date_desc">Arrival Date: Latest First</option>
        </select>
      </div>

      {/* State Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          State Filter
        </label>
        <select
          className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition cursor-pointer"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {stateOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* District Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          District Filter
        </label>
        <select
          className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition cursor-pointer"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          {districtOptions.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* Market Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Market / APMC Filter
        </label>
        <select
          className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition cursor-pointer"
          value={selectedMarket}
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          {marketOptions.map((mkt) => (
            <option key={mkt} value={mkt}>
              {mkt}
            </option>
          ))}
        </select>
      </div>

      {/* Commodity / Product Filter */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Commodity Type
        </label>
        <select
          className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition cursor-pointer"
          value={selectedCommodity}
          onChange={(e) => setSelectedCommodity(e.target.value)}
        >
          {commodityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Modal Price Range (₹/Qtl)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-green-600 transition"
          />
        </div>
      </div>

      {/* View Toggle (Cards vs Table) */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
          Layout View
        </label>
        <div className="grid grid-cols-2 gap-2 bg-[#f0f4ef] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === "cards"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Price Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            APMC Table
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Updating Rates..." : "Refresh Mandi Rates"}
        </button>
      </div>
    </div>
  );
};

export default MarketFilter;
