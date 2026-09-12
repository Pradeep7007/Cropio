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
    district,
    market,
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
  if (district && district !== "All" && district !== "All Districts") {
    apiUrl += `&filters[district]=${encodeURIComponent(district)}`;
  }
  if (market && market !== "All" && market !== "All Markets") {
    apiUrl += `&filters[market]=${encodeURIComponent(market)}`;
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
    if (district && district !== "All" && district !== "All Districts") {
      filteredFallback = filteredFallback.filter((item) =>
        item.district.toLowerCase().includes(district.toLowerCase())
      );
    }
    if (market && market !== "All" && market !== "All Markets") {
      filteredFallback = filteredFallback.filter((item) =>
        item.market.toLowerCase().includes(market.toLowerCase())
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

  // Apply Sorting (price, commodity, district, market, date)
  if (sortBy === "price_desc") {
    results.sort((a, b) => b.modalPrice - a.modalPrice);
  } else if (sortBy === "price_asc") {
    results.sort((a, b) => a.modalPrice - b.modalPrice);
  } else if (sortBy === "commodity_asc") {
    results.sort((a, b) => a.commodity.localeCompare(b.commodity));
  } else if (sortBy === "district_asc") {
    results.sort((a, b) => a.district.localeCompare(b.district));
  } else if (sortBy === "market_asc") {
    results.sort((a, b) => a.market.localeCompare(b.market));
  } else if (sortBy === "date_desc") {
    results.sort((a, b) => (b.arrivalDate || "").localeCompare(a.arrivalDate || ""));
  }

  // State to District mapping
  const stateDistrictsMap = {
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

  const stateMarketsMap = {
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
    "West Bengal": [
      "Kolkata Mandi",
      "Siliguri APMC",
      "Burdwan APMC",
    ],
    "Andhra Pradesh": [
      "Guntur Market Yard",
      "Vijayawada APMC",
      "Tirupati Market",
    ],
    "Odisha": [
      "Cuttack APMC",
      "Bhubaneswar Market",
      "Bargarh Regulated Market",
    ],
  };

  const availableStates = [
    "All States",
    ...Object.keys(stateDistrictsMap),
  ];

  // If a specific state is chosen, only provide that state's districts and markets
  let districtList = [];
  let marketList = [];

  const matchedStateKey = Object.keys(stateDistrictsMap).find(
    (k) => state && state.toLowerCase() === k.toLowerCase()
  );

  // Include dynamic records seen in this batch
  const dynamicDistricts = [...new Set(results.map((r) => r.district))].filter(
    (d) => d && d !== "N/A"
  );
  const dynamicMarkets = [...new Set(results.map((r) => r.market))].filter(
    (m) => m && m !== "N/A" && m !== "APMC Mandi"
  );

  let combinedDistricts = [];
  let combinedMarkets = [];

  if (matchedStateKey && stateDistrictsMap[matchedStateKey]) {
    districtList = stateDistrictsMap[matchedStateKey];
    marketList = stateMarketsMap[matchedStateKey] || [];
    combinedDistricts = [
      "All Districts",
      ...new Set([...dynamicDistricts.filter((d) => districtList.includes(d)), ...districtList]),
    ];
    combinedMarkets = [
      "All Markets",
      ...new Set([...dynamicMarkets.filter((m) => marketList.includes(m)), ...marketList]),
    ];
  } else {
    // Collect all districts and markets across all states
    districtList = Object.values(stateDistrictsMap).flat();
    marketList = Object.values(stateMarketsMap).flat();
    combinedDistricts = [
      "All Districts",
      ...new Set([...dynamicDistricts, ...districtList]),
    ];
    combinedMarkets = [
      "All Markets",
      ...new Set([...dynamicMarkets, ...marketList]),
    ];
  }

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
      districts: combinedDistricts,
      markets: combinedMarkets,
      commodities: availableCommodities,
      stateDistrictsMap,
      stateMarketsMap,
    },
  });
};