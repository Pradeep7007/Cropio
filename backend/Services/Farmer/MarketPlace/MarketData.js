require("dotenv").config();
const https = require("https");

const fallbackMandiData = [
  {
    state: "Keralam",
    district: "Kozhikode(Calicut)",
    market: "Mukkom Market",
    commodity: "Bhindi(Ladies Finger)",
    variety: "Bhindi",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 4400,
    maxPrice: 4800,
    modalPrice: 4600,
    pricePerKg: "46.00",
  },
  {
    state: "Keralam",
    district: "Kozhikode(Calicut)",
    market: "Mukkom Market",
    commodity: "Bottle gourd",
    variety: "Bottle Gourd",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 3200,
    maxPrice: 3500,
    modalPrice: 3400,
    pricePerKg: "34.00",
  },
  {
    state: "Keralam",
    district: "Kozhikode(Calicut)",
    market: "Mukkom Market",
    commodity: "Banana - Green",
    variety: "Banana - Green",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 5600,
    maxPrice: 5900,
    modalPrice: 5800,
    pricePerKg: "58.00",
  },
  {
    state: "Rajasthan",
    district: "Jalore",
    market: "Jalore APMC",
    commodity: "Bottle gourd",
    variety: "Bottle Gourd",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 800,
    maxPrice: 1000,
    modalPrice: 900,
    pricePerKg: "9.00",
  },
  {
    state: "Rajasthan",
    district: "Jalore",
    market: "Jalore APMC",
    commodity: "Brinjal",
    variety: "Brinjal",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 1500,
    maxPrice: 1800,
    modalPrice: 1600,
    pricePerKg: "16.00",
  },
  {
    state: "Keralam",
    district: "Kollam",
    market: "Sasthamkotta Market",
    commodity: "Bhindi(Ladies Finger)",
    variety: "Other",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 4000,
    maxPrice: 4000,
    modalPrice: 4000,
    pricePerKg: "40.00",
  },
  {
    state: "Keralam",
    district: "Kollam",
    market: "Sasthamkotta Market",
    commodity: "Colacasia",
    variety: "Other",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 6000,
    maxPrice: 6000,
    modalPrice: 6000,
    pricePerKg: "60.00",
  },
  {
    state: "Keralam",
    district: "Kollam",
    market: "Sasthamkotta Market",
    commodity: "Bitter gourd",
    variety: "Bitter Gourd",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 6000,
    maxPrice: 6000,
    modalPrice: 6000,
    pricePerKg: "60.00",
  },
  {
    state: "Keralam",
    district: "Ernakulam",
    market: "Perumbavoor Market",
    commodity: "Amaranthus",
    variety: "Amaranthus",
    grade: "Medium",
    arrivalDate: "12/09/2026",
    minPrice: 3000,
    maxPrice: 4000,
    modalPrice: 3500,
    pricePerKg: "35.00",
  },
  {
    state: "Keralam",
    district: "Ernakulam",
    market: "Perumbavoor Market",
    commodity: "Brinjal",
    variety: "Brinjal",
    grade: "Medium",
    arrivalDate: "12/09/2026",
    minPrice: 3000,
    maxPrice: 4400,
    modalPrice: 3800,
    pricePerKg: "38.00",
  },
  {
    state: "Tamil Nadu",
    district: "Madurai",
    market: "Usilampatti Market",
    commodity: "Tomato",
    variety: "Deshi",
    grade: "Local",
    arrivalDate: "12/09/2026",
    minPrice: 2600,
    maxPrice: 3000,
    modalPrice: 2800,
    pricePerKg: "28.00",
  },
  {
    state: "Punjab",
    district: "Ludhiana",
    market: "Ludhiana APMC",
    commodity: "Wheat",
    variety: "Kalyan Sona",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 2400,
    maxPrice: 2550,
    modalPrice: 2480,
    pricePerKg: "24.80",
  },
  {
    state: "Maharashtra",
    district: "Nashik",
    market: "Lasalgaon APMC",
    commodity: "Onion",
    variety: "Red Onion",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 2100,
    maxPrice: 2750,
    modalPrice: 2450,
    pricePerKg: "24.50",
  },
  {
    state: "Uttar Pradesh",
    district: "Agra",
    market: "Fatehabad APMC",
    commodity: "Potato",
    variety: "Kufri Jyoti",
    grade: "FAQ",
    arrivalDate: "12/09/2026",
    minPrice: 1400,
    maxPrice: 1700,
    modalPrice: 1550,
    pricePerKg: "15.50",
  },
];

// Simple in-memory response cache to preserve API rate limits
const cache = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

const fetchFromDataGov = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { accept: "application/json" } }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`API responded with status code ${res.statusCode}: ${data}`));
          }
        });
      })
      .on("error", (err) => reject(err));
  });
};

module.exports = async function MarketData(req, res) {
  const {
    state,
    commodity,
    search,
    sortBy,
    offset = 0,
    limit = 10,
  } = req.query;

  const apiKey =
    process.env.DATA_GOV_API_KEY ||
    "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
  const resourceId =
    process.env.DATA_GOV_RESOURCE_ID || "9ef84268-d588-465a-a308-a864a43d0070";

  let apiUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=${limit}&offset=${offset}`;

  if (state && state !== "All" && state !== "All States") {
    apiUrl += `&filters[state.keyword]=${encodeURIComponent(state)}`;
  }
  if (commodity && commodity !== "All" && commodity !== "All Products") {
    apiUrl += `&filters[commodity]=${encodeURIComponent(commodity)}`;
  }

  const cacheKey = apiUrl;
  const cached = cache.get(cacheKey);

  let rawRecords = [];
  let totalCount = 0;
  let isLiveData = false;

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    rawRecords = cached.data.records || [];
    totalCount = cached.data.total || rawRecords.length;
    isLiveData = true;
  } else {
    try {
      const response = await fetchFromDataGov(apiUrl);
      if (response && response.records && Array.isArray(response.records)) {
        rawRecords = response.records;
        totalCount = response.total || rawRecords.length;
        isLiveData = true;
        cache.set(cacheKey, { timestamp: Date.now(), data: response });
      }
    } catch (err) {
      console.warn("data.gov.in Mandi API error:", err.message);
    }
  }

  // If live data empty or error, use filtered fallback records
  let results = [];
  if (rawRecords.length > 0) {
    results = rawRecords.map((r) => ({
      state: r.state || "N/A",
      district: r.district || "N/A",
      market: r.market || "APMC Mandi",
      commodity: r.commodity || "Agricultural Produce",
      variety: r.variety || "Standard",
      grade: r.grade || "FAQ",
      arrivalDate: r.arrival_date || "Today",
      minPrice: Number(r.min_price) || 0,
      maxPrice: Number(r.max_price) || 0,
      modalPrice: Number(r.modal_price) || 0,
      pricePerKg: ((Number(r.modal_price) || 0) / 100).toFixed(2),
    }));
  } else {
    // Filter fallback data by query
    let filteredFallback = [...fallbackMandiData];
    if (state && state !== "All" && state !== "All States") {
      filteredFallback = filteredFallback.filter((item) =>
        item.state.toLowerCase().includes(state.toLowerCase())
      );
    }
    if (commodity && commodity !== "All" && commodity !== "All Products") {
      filteredFallback = filteredFallback.filter((item) =>
        item.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }
    results = filteredFallback;
    totalCount = filteredFallback.length;
  }

  // Apply search filtering if provided
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter(
      (item) =>
        item.commodity.toLowerCase().includes(term) ||
        item.market.toLowerCase().includes(term) ||
        item.district.toLowerCase().includes(term) ||
        item.state.toLowerCase().includes(term)
    );
  }

  // Apply Sorting
  if (sortBy === "price_desc") {
    results.sort((a, b) => b.modalPrice - a.modalPrice);
  } else if (sortBy === "price_asc") {
    results.sort((a, b) => a.modalPrice - b.modalPrice);
  } else if (sortBy === "commodity_asc") {
    results.sort((a, b) => a.commodity.localeCompare(b.commodity));
  } else if (sortBy === "date_desc") {
    results.sort((a, b) => (b.arrivalDate || "").localeCompare(a.arrivalDate || ""));
  }

  // Also extract available unique filters for the frontend dropdowns
  const availableStates = [
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
  ];

  const availableCommodities = [
    "All Products",
    "Tomato",
    "Potato",
    "Onion",
    "Wheat",
    "Bhindi(Ladies Finger)",
    "Bottle gourd",
    "Bitter gourd",
    "Brinjal",
    "Banana - Green",
    "Colacasia",
    "Amaranthus",
    "Ginger(Green)",
    "Chilli Green",
    "Rice",
    "Cotton",
    "Soyabean",
    "Mustard",
  ];

  res.json({
    success: true,
    isLive: isLiveData,
    total: totalCount || 6030,
    offset: Number(offset),
    limit: Number(limit),
    records: results,
    filterOptions: {
      states: availableStates,
      commodities: availableCommodities,
    },
  });
};