import React, { useState, useEffect, useMemo, useCallback } from "react";
import MarketFilter from "../../../Components/Market/MarketFilter";
import MarketPlace from "../../../Components/Market/MarketPage";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MarketplaceAccess() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCommodity, setSelectedCommodity] = useState("All Products");
  const [sortBy, setSortBy] = useState("price_desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [page, setPage] = useState(1);

  const [records, setRecords] = useState([]);
  const [totalCount, setTotalCount] = useState(6030);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stateOptions, setStateOptions] = useState([
    "All States",
    "Keralam",
    "Rajasthan",
    "Tamil Nadu",
    "Punjab",
    "Uttar Pradesh",
    "Maharashtra",
    "Haryana",
    "Gujarat",
    "Karnataka",
    "Madhya Pradesh",
    "West Bengal",
    "Andhra Pradesh",
    "Odisha",
  ]);

  const [commodityOptions, setCommodityOptions] = useState([
    "All Products",
    "Tomato",
    "Potato",
    "Onion",
    "Wheat",
    "Rice",
    "Bhindi(Ladies Finger)",
    "Bottle gourd",
    "Bitter gourd",
    "Brinjal",
    "Banana - Green",
    "Colacasia",
    "Amaranthus",
    "Ginger(Green)",
    "Chilli Green",
    "Cotton",
    "Mustard",
  ]);

  // Fetch Mandi records from backend service
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * 10;
      const params = new URLSearchParams();
      params.append("limit", "10");
      params.append("offset", offset.toString());

      if (selectedState && selectedState !== "All States") {
        params.append("state", selectedState);
      }
      if (selectedCommodity && selectedCommodity !== "All Products") {
        params.append("commodity", selectedCommodity);
      }
      if (sortBy) {
        params.append("sortBy", sortBy);
      }
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      const response = await fetch(
        `${baseUrl}/api/farmer/marketplace/marketdata?${params.toString()}`
      );
      const result = await response.json();

      if (result && Array.isArray(result.records)) {
        setRecords(result.records);
        setTotalCount(result.total || 6030);
        setIsLive(result.isLive ?? true);

        if (result.filterOptions) {
          if (result.filterOptions.states?.length > 0) {
            setStateOptions(result.filterOptions.states);
          }
          if (result.filterOptions.commodities?.length > 0) {
            setCommodityOptions(result.filterOptions.commodities);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Mandi marketplace data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedState, selectedCommodity, sortBy, searchTerm]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Handle Commodity Change (also resets to page 1)
  const handleSelectCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setPage(1);
  };

  // Handle State Change (resets to page 1)
  const handleSelectState = (state) => {
    setSelectedState(state);
    setPage(1);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setSelectedState("All States");
    setSelectedCommodity("All Products");
    setSortBy("price_desc");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  // Apply client-side price range filter and search if needed
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const price = r.modalPrice || 0;
      const matchesMin = minPrice === "" || price >= parseFloat(minPrice);
      const matchesMax = maxPrice === "" || price <= parseFloat(maxPrice);
      return matchesMin && matchesMax;
    });
  }, [records, minPrice, maxPrice]);

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden"
      style={{
        fontFamily: "Lexend, 'Noto Sans', sans-serif",
      }}
    >
      <div className="layout-container flex h-full grow flex-col lg:flex-row gap-6 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Left Filter Sidebar */}
        <MarketFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedState={selectedState}
          setSelectedState={handleSelectState}
          stateOptions={stateOptions}
          selectedCommodity={selectedCommodity}
          setSelectedCommodity={handleSelectCommodity}
          commodityOptions={commodityOptions}
          sortBy={sortBy}
          setSortBy={setSortBy}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={handleReset}
          onRefresh={fetchMarketData}
          loading={loading}
        />

        {/* Right Main Marketplace Area */}
        <MarketPlace
          records={filteredRecords}
          loading={loading}
          isLive={isLive}
          totalCount={totalCount}
          page={page}
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage)}
          viewMode={viewMode}
          selectedCommodity={selectedCommodity}
          onSelectCommodity={handleSelectCommodity}
          commodityOptions={commodityOptions}
        />
      </div>
    </div>
  );
}
