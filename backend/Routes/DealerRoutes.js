const express = require("express");
const router = express.Router();

// Dynamic in-memory stores for Dealer
let inventoryItems = [
  { id: "INV-001", crop: "Wheat", stock: 120, acquisition: "2026-08-10", expiry: "2027-03-01", price: 25.5, category: "Cereals", warehouse: "North Bay A" },
  { id: "INV-002", crop: "Rice (Basmati)", stock: 85, acquisition: "2026-08-12", expiry: "2027-02-15", price: 38.0, category: "Cereals", warehouse: "Central Mandi" },
  { id: "INV-003", crop: "Yellow Corn", stock: 95, acquisition: "2026-08-15", expiry: "2027-01-20", price: 22.0, category: "Grains", warehouse: "North Bay B" },
  { id: "INV-004", crop: "Soybean", stock: 24, acquisition: "2026-08-20", expiry: "2027-02-10", price: 36.5, category: "Oilseeds", warehouse: "South Hub" },
  { id: "INV-005", crop: "Mustard Seeds", stock: 110, acquisition: "2026-09-01", expiry: "2027-04-01", price: 44.0, category: "Oilseeds", warehouse: "West Storage" },
  { id: "INV-006", crop: "Chickpeas (Chana)", stock: 18, acquisition: "2026-08-25", expiry: "2027-01-30", price: 54.0, category: "Pulses", warehouse: "Central Mandi" },
  { id: "INV-007", crop: "Potato (Jyoti)", stock: 140, acquisition: "2026-09-05", expiry: "2026-11-25", price: 19.0, category: "Vegetables", warehouse: "Cold Storage 1" },
  { id: "INV-008", crop: "Tomato (Hybrid)", stock: 65, acquisition: "2026-09-08", expiry: "2026-10-15", price: 28.0, category: "Vegetables", warehouse: "Cold Storage 2" },
];

let dealerCustomers = [
  { id: "CUST-1", name: "Aarav Sharma", phone: "+91 98765 43210", crop: "Wheat", pricePerKg: 25.5, purchasedKg: 250, date: "2026-09-10", location: "Ludhiana" },
  { id: "CUST-2", name: "Deepak Verma", phone: "+91 98123 45678", crop: "Rice (Basmati)", pricePerKg: 38.0, purchasedKg: 180, date: "2026-09-09", location: "Amritsar" },
  { id: "CUST-3", name: "Sunil Patil", phone: "+91 99234 56789", crop: "Yellow Corn", pricePerKg: 22.0, purchasedKg: 320, date: "2026-09-08", location: "Pune" },
  { id: "CUST-4", name: "Rajesh Kulkarni", phone: "+91 97345 67890", crop: "Soybean", pricePerKg: 36.5, purchasedKg: 140, date: "2026-09-07", location: "Indore" },
  { id: "CUST-5", name: "Gurmeet Kaur", phone: "+91 98456 78901", crop: "Mustard Seeds", pricePerKg: 44.0, purchasedKg: 200, date: "2026-09-06", location: "Jaipur" },
  { id: "CUST-6", name: "Manoj Chawla", phone: "+91 97567 89012", crop: "Tomato (Hybrid)", pricePerKg: 28.0, purchasedKg: 450, date: "2026-09-05", location: "Delhi APMC" },
];

let logisticsShipments = [
  {
    id: "SHP-2026-01",
    crop: "Wheat (Sharbati)",
    origin: "Khanna APMC, Punjab",
    destination: "Azadpur Mandi, Delhi",
    quantity: "450 Quintals",
    date: "2026-09-11",
    transporter: "Grewal Agri Logistics",
    status: "In Transit",
    vehicleNumber: "PB-10-CZ-4521",
    eta: "Tomorrow, 8:00 AM",
  },
  {
    id: "SHP-2026-02",
    crop: "Basmati Rice Pusa",
    origin: "Karnal Mandi, Haryana",
    destination: "Nhava Sheva Port, Mumbai",
    quantity: "600 Quintals",
    date: "2026-09-10",
    transporter: "SpeedFreight InterState",
    status: "Delivered",
    vehicleNumber: "HR-05-AT-8902",
    eta: "Delivered on Sep 11",
  },
  {
    id: "SHP-2026-03",
    crop: "Tomato (Fresh)",
    origin: "Kolar APMC, Karnataka",
    destination: "Koyambedu, Chennai",
    quantity: "280 Quintals",
    date: "2026-09-12",
    transporter: "South Reefer Express",
    status: "In Transit",
    vehicleNumber: "KA-04-E-3119",
    eta: "Today, 11:30 PM",
  },
  {
    id: "SHP-2026-04",
    crop: "Yellow Corn",
    origin: "Gulbarga, Karnataka",
    destination: "Hyderabad Feed Mills",
    quantity: "350 Quintals",
    date: "2026-09-08",
    transporter: "Deccan Express Cargo",
    status: "Delayed",
    vehicleNumber: "TS-08-UB-6712",
    eta: "Pending Engine Repair",
  }
];

let connectedFarmers = [
  {
    id: "FMR-01",
    name: "Baldev Singh",
    location: "Bathinda, Punjab",
    phone: "+91 98140 11223",
    crop: "Wheat",
    quantity: "500 Quintals",
    askingPrice: 2450,
    harvestDate: "Ready for Pickup",
    rating: 4.8,
  },
  {
    id: "FMR-02",
    name: "Suresh Gowda",
    location: "Mandya, Karnataka",
    phone: "+91 94480 33445",
    crop: "Rice (Sona Masoori)",
    quantity: "350 Quintals",
    askingPrice: 3100,
    harvestDate: "Within 10 Days",
    rating: 4.9,
  },
  {
    id: "FMR-03",
    name: "Jagdish Meena",
    location: "Kota, Rajasthan",
    phone: "+91 97840 55667",
    crop: "Soybean",
    quantity: "220 Quintals",
    askingPrice: 4200,
    harvestDate: "Ready for Pickup",
    rating: 4.7,
  },
  {
    id: "FMR-04",
    name: "Venkatesh Rao",
    location: "Guntur, Andhra Pradesh",
    phone: "+91 98490 77889",
    crop: "Chilli (Teja)",
    quantity: "150 Quintals",
    askingPrice: 18500,
    harvestDate: "Ready for Pickup",
    rating: 5.0,
  }
];

// --- Inventory Endpoints ---
router.get("/inventory", (req, res) => {
  const { search, status } = req.query;
  let items = [...inventoryItems];

  if (status === "In Stock") items = items.filter((i) => i.stock >= 30);
  if (status === "Low Stock") items = items.filter((i) => i.stock > 0 && i.stock < 30);
  if (status === "Out of Stock") items = items.filter((i) => i.stock === 0);

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter((i) => i.crop.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }

  res.json({ success: true, items, totalCount: items.length });
});

router.post("/inventory", (req, res) => {
  const { crop, stock, price, category, warehouse, expiry } = req.body;
  if (!crop || stock === undefined || !price) {
    return res.status(400).json({ success: false, message: "Crop name, stock, and price are required." });
  }

  const newItem = {
    id: `INV-00${inventoryItems.length + 1}`,
    crop: crop.trim(),
    stock: parseFloat(stock) || 0,
    price: parseFloat(price) || 0,
    category: category || "General",
    warehouse: warehouse || "Central Hub",
    acquisition: new Date().toISOString().split("T")[0],
    expiry: expiry || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };

  inventoryItems.unshift(newItem);
  res.status(201).json({ success: true, item: newItem, message: "Inventory item added successfully!" });
});

router.patch("/inventory/:id", (req, res) => {
  const { id } = req.params;
  const { stock, price } = req.body;
  const item = inventoryItems.find((i) => i.id === id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });

  if (stock !== undefined) item.stock = Math.max(0, parseFloat(stock));
  if (price !== undefined) item.price = parseFloat(price);

  res.json({ success: true, item, message: "Item updated" });
});

router.delete("/inventory/:id", (req, res) => {
  const { id } = req.params;
  inventoryItems = inventoryItems.filter((i) => i.id !== id);
  res.json({ success: true, message: "Item removed from inventory" });
});

// --- Customer Endpoints ---
router.get("/customers", (req, res) => {
  const { search, crop } = req.query;
  let list = [...dealerCustomers];

  if (crop && crop !== "All Crops") {
    list = list.filter((c) => c.crop.toLowerCase().includes(crop.toLowerCase()));
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }

  const totalRevenue = list.reduce((acc, c) => acc + c.pricePerKg * c.purchasedKg, 0);
  const totalVolume = list.reduce((acc, c) => acc + c.purchasedKg, 0);

  res.json({ success: true, customers: list, totalRevenue, totalVolume, count: list.length });
});

router.post("/customers", (req, res) => {
  const { name, phone, crop, pricePerKg, purchasedKg, location } = req.body;
  if (!name || !crop || !pricePerKg || !purchasedKg) {
    return res.status(400).json({ success: false, message: "All customer transaction fields are required." });
  }

  const newCust = {
    id: `CUST-${dealerCustomers.length + 1}`,
    name: name.trim(),
    phone: phone?.trim() || "+91 90000 00000",
    crop: crop.trim(),
    pricePerKg: parseFloat(pricePerKg),
    purchasedKg: parseFloat(purchasedKg),
    location: location?.trim() || "Local Mandi",
    date: new Date().toISOString().split("T")[0],
  };

  dealerCustomers.unshift(newCust);
  res.status(201).json({ success: true, customer: newCust, message: "Customer order recorded successfully!" });
});

router.delete("/customers/:id", (req, res) => {
  const { id } = req.params;
  dealerCustomers = dealerCustomers.filter((c) => c.id !== id);
  res.json({ success: true, message: "Customer order removed" });
});

// --- Logistics Endpoints ---
router.get("/logistics", (req, res) => {
  res.json({ success: true, shipments: logisticsShipments, count: logisticsShipments.length });
});

router.post("/logistics", (req, res) => {
  const { crop, origin, destination, quantity, transporter, vehicleNumber, eta } = req.body;
  if (!crop || !origin || !destination) {
    return res.status(400).json({ success: false, message: "Crop, origin, and destination are required." });
  }

  const newShipment = {
    id: `SHP-2026-${(logisticsShipments.length + 1).toString().padStart(2, "0")}`,
    crop: crop.trim(),
    origin: origin.trim(),
    destination: destination.trim(),
    quantity: quantity?.trim() || "100 Quintals",
    date: new Date().toISOString().split("T")[0],
    transporter: transporter?.trim() || "Direct Farm Logistics",
    status: "In Transit",
    vehicleNumber: vehicleNumber?.trim() || "DL-01-AG-9999",
    eta: eta?.trim() || "Within 48 Hours",
  };

  logisticsShipments.unshift(newShipment);
  res.status(201).json({ success: true, shipment: newShipment, message: "New delivery dispatch registered!" });
});

router.patch("/logistics/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const shipment = logisticsShipments.find((s) => s.id === id);
  if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });

  if (status) shipment.status = status;
  res.json({ success: true, shipment, message: `Shipment status updated to ${status}` });
});

// --- Price Forecast Endpoint ---
router.post("/price-forecast", (req, res) => {
  const { crop = "Wheat", region = "North Zone", period = "30 Days" } = req.body;

  const basePrices = {
    Wheat: 2450,
    Rice: 3600,
    Corn: 2150,
    Tomato: 2800,
    Onion: 3200,
    Soybean: 4400,
    Mustard: 5100,
    Cotton: 7200,
  };

  const base = basePrices[crop] || 2500;
  // Dynamic calculation based on season, demand and period
  const multiplier = period === "7 Days" ? 1.03 : period === "15 Days" ? 1.07 : 1.12;
  const predictedPrice = Math.round(base * multiplier);
  const changePct = ((predictedPrice - base) / base * 100).toFixed(1);
  const confidence = Math.floor(Math.random() * 8) + 88; // 88% - 95%

  const action = changePct > 8 ? "Strong Buy" : changePct > 3 ? "Accumulate" : "Hold";

  const history = [
    { day: "T - 15", price: Math.round(base * 0.96) },
    { day: "T - 10", price: Math.round(base * 0.98) },
    { day: "T - 5", price: Math.round(base * 0.99) },
    { day: "Current", price: base },
    { day: "+ 10d", price: Math.round(base * (1 + (multiplier - 1) * 0.4)) },
    { day: "+ 20d", price: Math.round(base * (1 + (multiplier - 1) * 0.75)) },
    { day: `Target (${period})`, price: predictedPrice },
  ];

  res.json({
    success: true,
    data: {
      crop,
      region,
      period,
      currentPrice: `₹${base.toLocaleString()}/Quintal`,
      predictedPrice: `₹${predictedPrice.toLocaleString()}/Quintal`,
      priceChange: `+${changePct}%`,
      confidence: `${confidence}%`,
      action,
      rationale: `Seasonal mandi arrival constraints in ${region} combined with robust processing mill demand project a ${changePct}% price appreciation over the next ${period}.`,
      history,
    },
  });
});

// --- Farmer Connect & Procurement Endpoints ---
const cropStore = require("../Services/Shared/cropListingsStore");

router.get("/farmers", (req, res) => {
  const { search, crop, state, status } = req.query;
  const listings = cropStore.getAllListings({ crop, state, search, status });

  // Map to format expected by Dealer FarmerConnect component while retaining full lot data
  const formattedFarmers = listings.map((item) => ({
    id: item.id,
    name: item.farmerName,
    location: item.location || `${item.district}, ${item.state}`,
    state: item.state,
    district: item.district,
    farmAddress: item.farmAddress,
    phone: item.farmerPhone,
    crop: item.crop,
    variety: item.variety,
    grade: item.grade,
    quantity: item.quantity,
    unit: item.unit || "Quintals",
    askingPrice: item.askingPrice,
    totalValuation: item.totalValuation,
    harvestStatus: item.harvestStatus,
    rating: item.rating || 4.8,
    status: item.status,
    notes: item.notes,
    image: item.image,
    postedDate: item.postedDate,
    offersCount: item.offers ? item.offers.length : 0,
    offers: item.offers || []
  }));

  res.json({ success: true, farmers: formattedFarmers, count: formattedFarmers.length });
});

router.post("/farmers/inquiry", (req, res) => {
  const { farmerId, dealerName, dealerPhone, offerPrice, quantity, note, pickupDate, logistics } = req.body;

  const result = cropStore.addDealerOffer(farmerId, {
    dealerName,
    dealerPhone,
    offerPrice,
    quantity,
    note,
    pickupDate,
    logistics,
  });

  if (!result) {
    return res.status(404).json({ success: false, message: "Crop lot or farmer not found." });
  }

  res.json({
    success: true,
    message: `Purchase offer of ₹${offerPrice}/Q for ${quantity} Q dispatched to ${result.listing.farmerName}!`,
    offer: result.offer,
    listing: result.listing,
    timestamp: new Date().toISOString(),
  });
});

// Direct Instant Purchase Endpoint
router.post("/crops/buy", (req, res) => {
  const { cropId, quantity, price, dealerName, dealerPhone, logistics, pickupDate } = req.body;
  if (!cropId || !quantity) {
    return res.status(400).json({ success: false, message: "Crop lot ID and quantity are required." });
  }

  const result = cropStore.buyListing(cropId, {
    quantity: Number(quantity),
    price: Number(price),
    dealerName,
    dealerPhone,
    logistics,
    pickupDate
  });

  if (!result) {
    return res.status(404).json({ success: false, message: "Crop lot not found or already sold out." });
  }

  // Automatically record into Dealer Inventory
  const newBatch = {
    id: `INV-${Date.now().toString().slice(-4)}`,
    crop: `${result.listing.crop} (${result.listing.variety || "Lot"})`,
    stock: Number(quantity),
    acquisition: new Date().toISOString().split("T")[0],
    expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    price: Number(price) ? (Number(price) / 100).toFixed(1) : 25.0,
    category: "Procured Produce",
    warehouse: "Central Procurement Bay"
  };
  inventoryItems.unshift(newBatch);

  // Automatically register transport dispatch
  const newShipment = {
    id: `SHP-2026-${(logisticsShipments.length + 1).toString().padStart(2, "0")}`,
    crop: `${result.listing.crop} (${result.listing.variety || "Lot"})`,
    origin: `${result.listing.farmAddress || result.listing.district}, ${result.listing.state}`,
    destination: "Dealer Central Hub",
    quantity: `${quantity} Quintals`,
    date: new Date().toISOString().split("T")[0],
    transporter: logistics || "Farm Gate Transit Co.",
    status: "In Transit",
    vehicleNumber: "DL-01-AG-" + Math.floor(1000 + Math.random() * 9000),
    eta: "Within 48 Hours"
  };
  logisticsShipments.unshift(newShipment);

  res.status(201).json({
    success: true,
    message: `Successfully purchased ${quantity} Quintals of ${result.listing.crop} from ${result.listing.farmerName}!`,
    transaction: result.transaction,
    inventoryBatch: newBatch,
    shipment: newShipment,
    updatedListing: result.listing
  });
});

// --- Get Dealer Bids & Inquiries Tracking Endpoint ---
router.get("/crops/bids", (req, res) => {
  const { dealerName, dealerPhone } = req.query;
  const bids = cropStore.getAllBids({ dealerName, dealerPhone });
  res.json({ success: true, bids, count: bids.length });
});

// --- Get Completed Procurement Purchases directly from MongoDB ---
router.get("/crops/purchases-history", async (req, res) => {
  try {
    const { dealerName } = req.query;
    const history = await cropStore.getSalesHistory({ dealerName });
    res.json({ success: true, history, count: history.length });
  } catch (err) {
    console.error("Error fetching purchase history from MongoDB:", err);
    res.status(500).json({ success: false, message: "Failed to fetch purchases from database." });
  }
});

// --- Purchase at Approved Bid Rate (STRICT CHECK: Only after farmer approval) ---
router.post("/crops/bids/:bidId/buy", (req, res) => {
  const { bidId } = req.params;
  const { dealerName, dealerPhone, pickupDate, logistics, paymentMode } = req.body;

  // Strict check enforced by cropStore.buyApprovedBid
  const result = cropStore.buyApprovedBid(bidId, {
    dealerName,
    dealerPhone,
    pickupDate,
    logistics,
    paymentMode
  });

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: result.error
    });
  }

  // Automatically record into Dealer Inventory
  const newBatch = {
    id: `INV-${Date.now().toString().slice(-4)}`,
    crop: `${result.listing.crop} (${result.listing.variety || "Approved Bid Batch"})`,
    stock: Number(result.offer.quantity),
    acquisition: new Date().toISOString().split("T")[0],
    expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    price: (Number(result.offer.offerPrice) / 100).toFixed(1),
    category: "Procured Produce",
    warehouse: "Central Procurement Bay"
  };
  inventoryItems.unshift(newBatch);

  // Automatically register transport dispatch
  const newShipment = {
    id: `SHP-2026-${(logisticsShipments.length + 1).toString().padStart(2, "0")}`,
    crop: `${result.listing.crop} (${result.listing.variety || "Approved Lot"})`,
    origin: `${result.listing.farmAddress || result.listing.district}, ${result.listing.state}`,
    destination: "Dealer Central Hub",
    quantity: `${result.offer.quantity} Quintals`,
    date: new Date().toISOString().split("T")[0],
    transporter: logistics || result.offer.logistics || "Direct Farm Logistics",
    status: "In Transit",
    vehicleNumber: "DL-01-AG-" + Math.floor(1000 + Math.random() * 9000),
    eta: "Within 48 Hours"
  };
  logisticsShipments.unshift(newShipment);

  res.status(201).json({
    success: true,
    message: `Procurement Contract Confirmed! Acquired ${result.offer.quantity} Quintals of ${result.listing.crop} at cultivator-approved rate of ₹${result.offer.offerPrice}/Q from ${result.listing.farmerName}.`,
    transaction: result.transaction,
    offer: result.offer,
    listing: result.listing,
    inventoryBatch: newBatch,
    shipment: newShipment
  });
});

// --- Dynamic Demand & Supply Analytics Endpoint ---
router.get("/demand-supply", (req, res) => {
  const commodities = [
    {
      name: "Wheat (Sharbati)",
      currentDemand: "4,200 MT",
      currentSupply: "3,850 MT",
      deficit: "-350 MT",
      status: "High Demand",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      avgMandiPrice: "₹2,450/Q",
      priceTrend: "+4.2%",
      majorMandis: "Ludhiana, Karnal, Kota",
      supplyFulfillment: 91,
    },
    {
      name: "Rice (Basmati 1121)",
      currentDemand: "6,500 MT",
      currentSupply: "6,900 MT",
      deficit: "+400 MT",
      status: "Surplus",
      statusColor: "text-green-700 bg-green-50 border-green-200",
      avgMandiPrice: "₹3,750/Q",
      priceTrend: "-1.5%",
      majorMandis: "Amritsar, Taraori, Kaithal",
      supplyFulfillment: 106,
    },
    {
      name: "Yellow Corn (Maize)",
      currentDemand: "3,100 MT",
      currentSupply: "2,400 MT",
      deficit: "-700 MT",
      status: "Severe Deficit",
      statusColor: "text-red-700 bg-red-50 border-red-200",
      avgMandiPrice: "₹2,180/Q",
      priceTrend: "+8.5%",
      majorMandis: "Gulbarga, Davangere, Chhindwara",
      supplyFulfillment: 77,
    },
    {
      name: "Soybean (Yellow)",
      currentDemand: "2,800 MT",
      currentSupply: "2,750 MT",
      deficit: "-50 MT",
      status: "Balanced",
      statusColor: "text-blue-700 bg-blue-50 border-blue-200",
      avgMandiPrice: "₹4,350/Q",
      priceTrend: "+1.2%",
      majorMandis: "Indore, Ujjain, Latur",
      supplyFulfillment: 98,
    },
    {
      name: "Tomato (Hybrid)",
      currentDemand: "1,900 MT",
      currentSupply: "1,550 MT",
      deficit: "-350 MT",
      status: "High Demand",
      statusColor: "text-amber-600 bg-amber-50 border-amber-200",
      avgMandiPrice: "₹2,600/Q",
      priceTrend: "+12.0%",
      majorMandis: "Kolar, Madanapalle, Nashik",
      supplyFulfillment: 81,
    },
    {
      name: "Mustard Seeds",
      currentDemand: "1,400 MT",
      currentSupply: "1,600 MT",
      deficit: "+200 MT",
      status: "Surplus",
      statusColor: "text-green-700 bg-green-50 border-green-200",
      avgMandiPrice: "₹5,200/Q",
      priceTrend: "-0.8%",
      majorMandis: "Bharatpur, Alwar, Jaipur",
      supplyFulfillment: 114,
    },
  ];

  const highDemand = commodities
    .filter((c) => c.deficit.startsWith("-"))
    .map((c) => ({
      name: c.name,
      value: c.supplyFulfillment,
      tons: c.currentDemand,
      trend: c.priceTrend,
      status: c.status,
    }));

  const oversupply = commodities
    .filter((c) => c.deficit.startsWith("+"))
    .map((c) => ({
      name: c.name,
      value: Math.min(100, Math.round((c.supplyFulfillment - 100) * 5 + 60)),
      tons: c.currentSupply,
      trend: c.priceTrend,
      status: c.status === "Surplus" ? "Oversupply Risk" : c.status,
    }));

  res.json({
    success: true,
    commodities,
    highDemand,
    oversupply,
    timestamp: new Date().toISOString(),
  });
});

// --- Dynamic Smart Purchase Procurement Strategy Endpoint ---
router.get("/smart-purchase-rates", (req, res) => {
  const rates = {
    Wheat: {
      buyPrice: 2420,
      projectedSell: 2750,
      storagePerMonth: 25,
      risk: "Low",
      seasonalInsight: "Wheat enters steady appreciation as rabi sowing begins. Millers consistently bid higher.",
    },
    Rice: {
      buyPrice: 3550,
      projectedSell: 3980,
      storagePerMonth: 35,
      risk: "Low",
      seasonalInsight: "Basmati export volumes rising. High quality aromatic lots fetch strong global trade premiums.",
    },
    Corn: {
      buyPrice: 2120,
      projectedSell: 2450,
      storagePerMonth: 20,
      risk: "Moderate",
      seasonalInsight: "Poultry feed mills facing supply deficits. Strong 30-day upward price volatility expected.",
    },
    Tomato: {
      buyPrice: 2400,
      projectedSell: 3100,
      storagePerMonth: 120,
      risk: "High",
      seasonalInsight: "High price swings. Recommended for cold-chain dealers with rapid turnaround within 10 days.",
    },
    Soybean: {
      buyPrice: 4200,
      projectedSell: 4750,
      storagePerMonth: 40,
      risk: "Low",
      seasonalInsight: "Solvent extractors maintaining firm bids. Domestic oil meal demand remains strong.",
    },
    Mustard: {
      buyPrice: 5050,
      projectedSell: 5600,
      storagePerMonth: 45,
      risk: "Low",
      seasonalInsight: "Crushing margins favorable ahead of festival season oil demand.",
    },
  };

  res.json({ success: true, rates, timestamp: new Date().toISOString() });
});

module.exports = router;
