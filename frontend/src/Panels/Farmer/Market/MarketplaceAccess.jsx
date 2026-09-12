import React, { useState, useEffect, useMemo, useCallback } from "react";
import MarketFilter from "../../../Components/Market/MarketFilter";
import MarketPlace from "../../../Components/Market/MarketPage";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Master State-to-District mapping for immediate client-side reactivity
const MASTER_STATE_DISTRICTS = {
  "Tamil Nadu": [
    "Madurai",
    "Coimbatore",
    "Chennai",
    "Tiruchirappalli",
    "Salem",
    "Erode",
    "Dindigul",
    "Tirupur",
    "Thanjavur",
    "Vellore",
    "Theni",
    "Virudhunagar",
    "Tirunelveli",
    "Kanyakumari",
    "Namakkal",
    "Karur",
    "Cuddalore",
    "Dharmapuri",
  ],
  "Keralam": [
    "Kozhikode(Calicut)",
    "Kollam",
    "Ernakulam",
    "Thiruvananthapuram",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kannur",
    "Kottayam",
    "Alappuzha",
    "Idukki",
    "Wayanad",
    "Kasaragod",
    "Pathanamthitta",
  ],
  "Rajasthan": [
    "Jalore",
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Alwar",
    "Sriganganagar",
    "Udaipur",
    "Bharatpur",
    "Nagaur",
    "Chittorgarh",
    "Pali",
    "Barmer",
    "Sikar",
  ],
  "Punjab": [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Sangrur",
    "Ferozepur",
    "Hoshiarpur",
    "Moga",
    "Kapurthala",
    "Faridkot",
  ],
  "Uttar Pradesh": [
    "Agra",
    "Kanpur",
    "Lucknow",
    "Varanasi",
    "Prayagraj",
    "Bareilly",
    "Meerut",
    "Aligarh",
    "Moradabad",
    "Saharanpur",
    "Gorakhpur",
    "Mathura",
    "Bulandshahar",
  ],
  "Maharashtra": [
    "Nashik",
    "Pune",
    "Nagpur",
    "Ahmednagar",
    "Solapur",
    "Kolhapur",
    "Aurangabad",
    "Jalgaon",
    "Satara",
    "Amravati",
    "Mumbai",
    "Thane",
    "Sangli",
  ],
  "Haryana": [
    "Karnal",
    "Ambala",
    "Hisar",
    "Rohtak",
    "Panipat",
    "Sonipat",
    "Kurukshetra",
    "Sirsa",
    "Fatehabad",
    "Yamunanagar",
    "Gurgaon",
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Junagadh",
    "Amreli",
    "Mehsana",
    "Banaskantha",
    "Kutch",
  ],
  "Karnataka": [
    "Bengaluru",
    "Mysuru",
    "Belagavi",
    "Hubballi-Dharwad",
    "Kalaburagi",
    "Ballari",
    "Shivamogga",
    "Tumakuru",
    "Davangere",
    "Kolar",
    "Hassan",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Dewas",
    "Satna",
    "Ratlam",
    "Rewa",
    "Mandsaur",
  ],
  "West Bengal": [
    "Kolkata",
    "Hooghly",
    "Burdwan",
    "North 24 Parganas",
    "South 24 Parganas",
    "Nadia",
    "Murshidabad",
    "Malda",
    "Bankura",
  ],
  "Andhra Pradesh": [
    "Guntur",
    "Krishna",
    "Visakhapatnam",
    "East Godavari",
    "West Godavari",
    "Kurnool",
    "Anantapur",
    "Chittoor",
    "Nellore",
  ],
  "Odisha": [
    "Bhubaneswar",
    "Cuttack",
    "Sambalpur",
    "Bargarh",
    "Ganjam",
    "Balasore",
    "Puri",
    "Mayurbhanj",
  ],
};

const MASTER_STATE_MARKETS = {
  "Tamil Nadu": [
    "Usilampatti Market",
    "Madurai APMC",
    "Coimbatore APMC",
    "Koyambedu Market",
    "Ottanchathiram Market",
    "Erode Market",
    "Salem Market",
    "Tirupur Mandi",
  ],
  "Keralam": [
    "Mukkom Market",
    "Sasthamkotta Market",
    "Perumbavoor Market",
    "Kollam Market",
    "Kozhikode Market",
    "Thrissur APMC",
    "Alappuzha Market",
  ],
  "Rajasthan": [
    "Jalore APMC",
    "Jaipur Mandi",
    "Muhana Mandi",
    "Kota APMC",
    "Jodhpur Mandi",
    "Bikaner APMC",
    "Sriganganagar Mandi",
  ],
  "Punjab": [
    "Ludhiana APMC",
    "Amritsar Mandi",
    "Jalandhar Mandi",
    "Khanna Mandi",
    "Patiala Mandi",
    "Bathinda Mandi",
  ],
  "Uttar Pradesh": [
    "Fatehabad APMC",
    "Agra Mandi",
    "Lucknow Mandi",
    "Kanpur APMC",
    "Varanasi APMC",
    "Meerut APMC",
  ],
  "Maharashtra": [
    "Lasalgaon APMC",
    "Vashi APMC",
    "Pune APMC",
    "Kalyan Mandi",
    "Nashik APMC",
    "Baramati APMC",
    "Nagpur Mandi",
  ],
  "Gujarat": [
    "Ahmedabad APMC",
    "Surat APMC",
    "Rajkot Mandi",
    "Gondal APMC",
    "Unjha APMC",
  ],
  "Karnataka": [
    "Yeshwanthpur APMC",
    "Kolar Mandi",
    "Mysuru APMC",
    "Hubli APMC",
    "Belgaum APMC",
  ],
  "Haryana": [
    "Karnal APMC",
    "Panipat Mandi",
    "Sirsa APMC",
    "Hisar Mandi",
    "Ambala Mandi",
  ],
  "Madhya Pradesh": [
    "Indore APMC",
    "Bhopal Mandi",
    "Ujjain APMC",
    "Neemuch Mandi",
    "Mandsaur APMC",
  ],
  "West Bengal": ["Kolkata Mandi", "Siliguri APMC", "Burdwan APMC"],
  "Andhra Pradesh": ["Guntur Market Yard", "Vijayawada APMC", "Tirupati Market"],
  "Odisha": ["Cuttack APMC", "Bhubaneswar Market", "Bargarh Regulated Market"],
};

export default function MarketplaceAccess() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedMarket, setSelectedMarket] = useState("All Markets");
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

  const stateOptions = useMemo(() => {
    return ["All States", ...Object.keys(MASTER_STATE_DISTRICTS)];
  }, []);

  // Compute district options dynamically based on selectedState
  const districtOptions = useMemo(() => {
    if (selectedState && selectedState !== "All States" && MASTER_STATE_DISTRICTS[selectedState]) {
      return ["All Districts", ...MASTER_STATE_DISTRICTS[selectedState]];
    }
    // If All States, show unique list of all districts
    const allDistricts = Object.values(MASTER_STATE_DISTRICTS).flat();
    return ["All Districts", ...new Set(allDistricts)];
  }, [selectedState]);

  // Compute market options dynamically based on selectedState
  const marketOptions = useMemo(() => {
    if (selectedState && selectedState !== "All States" && MASTER_STATE_MARKETS[selectedState]) {
      return ["All Markets", ...MASTER_STATE_MARKETS[selectedState]];
    }
    const allMarkets = Object.values(MASTER_STATE_MARKETS).flat();
    return ["All Markets", ...new Set(allMarkets)];
  }, [selectedState]);

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
      if (selectedDistrict && selectedDistrict !== "All Districts") {
        params.append("district", selectedDistrict);
      }
      if (selectedMarket && selectedMarket !== "All Markets") {
        params.append("market", selectedMarket);
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

        if (result.filterOptions?.commodities?.length > 0) {
          setCommodityOptions(result.filterOptions.commodities);
        }
      }
    } catch (error) {
      console.error("Error fetching Mandi marketplace data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedState, selectedDistrict, selectedMarket, selectedCommodity, sortBy, searchTerm]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // When State changes: reset district & market to "All", reset page to 1
  const handleSelectState = (state) => {
    setSelectedState(state);
    setSelectedDistrict("All Districts");
    setSelectedMarket("All Markets");
    setPage(1);
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setPage(1);
  };

  const handleSelectMarket = (market) => {
    setSelectedMarket(market);
    setPage(1);
  };

  const handleSelectCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setPage(1);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setSelectedState("All States");
    setSelectedDistrict("All Districts");
    setSelectedMarket("All Markets");
    setSelectedCommodity("All Products");
    setSortBy("price_desc");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  // Apply client-side price range filter
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
        {/* Left Filter Sidebar with Cascading State-District Filtering */}
        <MarketFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedState={selectedState}
          setSelectedState={handleSelectState}
          stateOptions={stateOptions}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={handleSelectDistrict}
          districtOptions={districtOptions}
          selectedMarket={selectedMarket}
          setSelectedMarket={handleSelectMarket}
          marketOptions={marketOptions}
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
