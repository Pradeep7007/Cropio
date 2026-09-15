// Shared Crop Listings Store for Farmer Selling & Dealer Procurement
let cropListings = [
  {
    id: "CROP-101",
    farmerId: "FMR-01",
    farmerName: "Baldev Singh",
    farmerPhone: "+91 98140 11223",
    crop: "Wheat",
    variety: "Sharbati (PBW 343)",
    grade: "Grade A",
    quantity: 500,
    unit: "Quintals",
    askingPrice: 2450,
    totalValuation: 1225000,
    harvestStatus: "Harvested • Ready for Pickup",
    location: "Bathinda, Punjab",
    state: "Punjab",
    district: "Bathinda",
    farmAddress: "Village Bhucho Mandi, Near Canal Road",
    notes: "Sun-dried organic wheat with moisture below 12%. Kept in clean covered silo.",
    rating: 4.9,
    status: "Available", // Available | Sold | Reserved
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-11",
    offers: [
      {
        id: "OFFER-1",
        dealerName: "Aggarwal Grain Traders",
        dealerPhone: "+91 98760 44332",
        offerPrice: 2420,
        quantity: 300,
        totalAmount: 726000,
        pickupDate: "2026-09-15",
        logistics: "Dealer Self-Pickup",
        note: "Ready for spot digital payment upon weighbridge clearance.",
        status: "Pending",
        date: "2026-09-12"
      }
    ]
  },
  {
    id: "CROP-102",
    farmerId: "FMR-02",
    farmerName: "Suresh Gowda",
    farmerPhone: "+91 94480 33445",
    crop: "Rice",
    variety: "Sona Masoori",
    grade: "Premium FAQ",
    quantity: 350,
    unit: "Quintals",
    askingPrice: 3200,
    totalValuation: 1120000,
    harvestStatus: "Ready within 5 Days",
    location: "Mandya, Karnataka",
    state: "Karnataka",
    district: "Mandya",
    farmAddress: "Maddur Taluk, Near Sugar Factory",
    notes: "Single origin paddy harvested using automated combine. High milling recovery.",
    rating: 4.8,
    status: "Available",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-10",
    offers: []
  },
  {
    id: "CROP-103",
    farmerId: "FMR-03",
    farmerName: "Jagdish Meena",
    farmerPhone: "+91 97840 55667",
    crop: "Soybean",
    variety: "JS 335",
    grade: "Grade A",
    quantity: 220,
    unit: "Quintals",
    askingPrice: 4250,
    totalValuation: 935000,
    harvestStatus: "Harvested • Stored in Dry Silo",
    location: "Kota, Rajasthan",
    state: "Rajasthan",
    district: "Kota",
    farmAddress: "Baran Road, Village Digod",
    notes: "High oil content seed variety. Fully cleaned and bagged in 50kg HDPE bags.",
    rating: 4.7,
    status: "Available",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-09",
    offers: []
  },
  {
    id: "CROP-104",
    farmerId: "FMR-04",
    farmerName: "Venkatesh Rao",
    farmerPhone: "+91 98490 77889",
    crop: "Chilli",
    variety: "Teja Super Hot",
    grade: "Export Quality",
    quantity: 140,
    unit: "Quintals",
    askingPrice: 18500,
    totalValuation: 2590000,
    harvestStatus: "Sun-Dried • Grade A Quality",
    location: "Guntur, Andhra Pradesh",
    state: "Andhra Pradesh",
    district: "Guntur",
    farmAddress: "Medikonduru, Guntur Rural",
    notes: "Deep red gloss, uniform length 7-9 cm, zero mould, moisture 9%.",
    rating: 5.0,
    status: "Available",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-08",
    offers: [
      {
        id: "OFFER-2",
        dealerName: "SpiceEx Spices Corporation",
        dealerPhone: "+91 98480 12345",
        offerPrice: 18200,
        quantity: 140,
        totalAmount: 2548000,
        pickupDate: "2026-09-14",
        logistics: "Dealer Self-Pickup",
        note: "Full lot purchase with 50% advance bank transfer.",
        status: "Pending",
        date: "2026-09-11"
      }
    ]
  },
  {
    id: "CROP-105",
    farmerId: "FMR-05",
    farmerName: "Gurpreet Brar",
    farmerPhone: "+91 98720 99881",
    crop: "Corn",
    variety: "Yellow Feed Maize",
    grade: "FAQ",
    quantity: 400,
    unit: "Quintals",
    askingPrice: 2150,
    totalValuation: 860000,
    harvestStatus: "Harvested • Moisture 14%",
    location: "Faridkot, Punjab",
    state: "Punjab",
    district: "Faridkot",
    farmAddress: "Kotkapura Road, Farikdot",
    notes: "Clean yellow maize kernels ideal for starch manufacturing or feed mill supply.",
    rating: 4.8,
    status: "Available",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-07",
    offers: []
  },
  {
    id: "CROP-106",
    farmerId: "FMR-06",
    farmerName: "Ramesh Patel",
    farmerPhone: "+91 98250 88990",
    crop: "Cotton",
    variety: "Shankar 6 Medium Staple",
    grade: "Grade A",
    quantity: 180,
    unit: "Quintals",
    askingPrice: 7200,
    totalValuation: 1296000,
    harvestStatus: "Harvesting in 7 Days",
    location: "Rajkot, Gujarat",
    state: "Gujarat",
    district: "Rajkot",
    farmAddress: "Gondal Highway, Village Kotda",
    notes: "First picking quality, clean boll opening with high ginning turnout.",
    rating: 4.9,
    status: "Available",
    image: "https://images.unsplash.com/photo-1594488518002-23428d095cb6?auto=format&fit=crop&w=800&q=70",
    postedDate: "2026-09-06",
    offers: []
  }
];

const cropImages = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70",
  corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=70",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=70",
  soybean: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=70",
  chilli: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=70",
  cotton: "https://images.unsplash.com/photo-1594488518002-23428d095cb6?auto=format&fit=crop&w=800&q=70",
  tomato: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=70",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=70",
  onion: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=70",
  mustard: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=70",
};

const store = {
  // Get all listings with optional filter
  getAllListings: ({ crop, state, search, status } = {}) => {
    let list = [...cropListings];

    if (status && status !== "All") {
      list = list.filter((item) => item.status.toLowerCase() === status.toLowerCase());
    }

    if (crop && crop !== "All") {
      list = list.filter((item) => item.crop.toLowerCase().includes(crop.toLowerCase()));
    }

    if (state && state !== "All" && state !== "All States") {
      list = list.filter((item) => item.state.toLowerCase().includes(state.toLowerCase()));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.crop.toLowerCase().includes(q) ||
          item.farmerName.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.variety.toLowerCase().includes(q)
      );
    }

    return list;
  },

  // Get listings posted by a specific farmer
  getFarmerListings: (farmerIdOrPhone, farmerName) => {
    return cropListings.filter((item) => {
      if (farmerIdOrPhone && (item.farmerId === farmerIdOrPhone || item.farmerPhone === farmerIdOrPhone)) {
        return true;
      }
      if (farmerName && item.farmerName.toLowerCase() === farmerName.toLowerCase()) {
        return true;
      }
      return false;
    });
  },

  // Create new crop listing
  createListing: (data) => {
    const qty = Number(data.quantity) || 1;
    const price = Number(data.askingPrice) || 0;
    const cropKey = (data.crop || "").toLowerCase().trim();

    const newListing = {
      id: `CROP-${Date.now().toString().slice(-4)}`,
      farmerId: data.farmerId || `FMR-${Math.floor(Math.random() * 900 + 100)}`,
      farmerName: data.farmerName || "Farmer User",
      farmerPhone: data.farmerPhone || "+91 98000 00000",
      crop: data.crop || "Agricultural Crop",
      variety: data.variety || "Standard Variety",
      grade: data.grade || "Grade A",
      quantity: qty,
      unit: data.unit || "Quintals",
      askingPrice: price,
      totalValuation: qty * price,
      harvestStatus: data.harvestStatus || "Harvested • Ready for Pickup",
      location: data.location || `${data.district || "Local"}, ${data.state || "State"}`,
      state: data.state || "Punjab",
      district: data.district || "Ludhiana",
      farmAddress: data.farmAddress || "Farm Gate",
      notes: data.notes || "Freshly cultivated batch.",
      rating: 4.8,
      status: "Available",
      image: data.image || cropImages[cropKey] || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70",
      postedDate: new Date().toISOString().split("T")[0],
      offers: []
    };

    cropListings.unshift(newListing);

    // Sync to SellCrop MongoDB Schema in background
    try {
      const SellCrop = require("../../Models/SellCrop");
      SellCrop.create({
        lotId: newListing.id,
        farmerId: newListing.farmerId,
        farmerName: newListing.farmerName,
        farmerPhone: newListing.farmerPhone,
        crop: newListing.crop,
        variety: newListing.variety,
        grade: newListing.grade,
        quantity: newListing.quantity,
        unit: newListing.unit,
        askingPrice: newListing.askingPrice,
        totalValuation: newListing.totalValuation,
        harvestStatus: newListing.harvestStatus,
        state: newListing.state,
        district: newListing.district,
        farmAddress: newListing.farmAddress,
        notes: newListing.notes,
        status: "Available"
      }).catch(() => {});
    } catch {}

    return newListing;
  },

  // Update status (e.g. "Sold", "Available", "Reserved")
  updateListingStatus: (id, status) => {
    const listing = cropListings.find((item) => item.id === id);
    if (!listing) return null;
    listing.status = status;

    try {
      const SellCrop = require("../../Models/SellCrop");
      SellCrop.findOneAndUpdate({ lotId: id }, { status }).catch(() => {});
    } catch {}

    return listing;
  },

  // Add dealer purchase offer / bid
  addDealerOffer: (cropId, offerData) => {
    const listing = cropListings.find((item) => item.id === cropId);
    if (!listing) return null;

    const offer = {
      id: `BID-${Date.now().toString().slice(-4)}`,
      dealerName: offerData.dealerName || "Verified Mandi Vendor",
      dealerPhone: offerData.dealerPhone || "+91 99000 11223",
      offerPrice: Number(offerData.offerPrice) || listing.askingPrice,
      quantity: Number(offerData.quantity) || listing.quantity,
      totalAmount: (Number(offerData.offerPrice) || listing.askingPrice) * (Number(offerData.quantity) || listing.quantity),
      pickupDate: offerData.pickupDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      logistics: offerData.logistics || "Dealer Self-Pickup",
      note: offerData.note || "Ready for digital farm gate settlement.",
      status: "Pending", // Must be approved by farmer before dealer can buy!
      date: new Date().toISOString().split("T")[0]
    };

    listing.offers.unshift(offer);

    // Sync to Bid MongoDB Schema in background
    try {
      const Bid = require("../../Models/Bid");
      Bid.create({
        bidId: offer.id,
        cropId: listing.id,
        cropName: listing.crop,
        variety: listing.variety,
        farmerId: listing.farmerId,
        farmerName: listing.farmerName,
        farmerPhone: listing.farmerPhone,
        dealerName: offer.dealerName,
        dealerPhone: offer.dealerPhone,
        originalAskingPrice: listing.askingPrice,
        bidPrice: offer.offerPrice,
        quantity: offer.quantity,
        totalAmount: offer.totalAmount,
        pickupDate: offer.pickupDate,
        logistics: offer.logistics,
        note: offer.note,
        status: "Pending"
      }).catch(() => {});
    } catch {}

    return { listing, offer };
  },

  // Get all bids with crop and farmer context (for Dealer Bid Tracking)
  getAllBids: (filter = {}) => {
    const list = [];
    cropListings.forEach((crop) => {
      (crop.offers || []).forEach((offer) => {
        let match = true;
        if (filter.dealerName || filter.dealerPhone) {
          const nameMatch = filter.dealerName && offer.dealerName?.toLowerCase() === filter.dealerName.toLowerCase();
          const phoneMatch = filter.dealerPhone && offer.dealerPhone === filter.dealerPhone;
          match = Boolean(nameMatch || phoneMatch);
        }
        if (match) {
          list.push({
            ...offer,
            cropId: crop.id,
            cropName: crop.crop,
            cropVariety: crop.variety,
            cropGrade: crop.grade,
            cropLocation: crop.location || `${crop.district}, ${crop.state}`,
            cropAskingPrice: crop.askingPrice,
            farmerId: crop.farmerId,
            farmerName: crop.farmerName,
            farmerPhone: crop.farmerPhone,
            cropStatus: crop.status,
            cropAvailableQty: crop.quantity,
          });
        }
      });
    });
    return list;
  },

  // Direct buy / contract purchase
  buyListing: (cropId, purchaseData) => {
    const listing = cropListings.find((item) => item.id === cropId);
    if (!listing) return null;

    const buyQty = Math.min(Number(purchaseData.quantity) || listing.quantity, listing.quantity);
    const buyPrice = Number(purchaseData.price) || listing.askingPrice;
    const totalPaid = buyQty * buyPrice;

    // Record purchase transaction
    const transaction = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      dealerName: purchaseData.dealerName || "Verified Mandi Vendor",
      dealerPhone: purchaseData.dealerPhone || "+91 99000 11223",
      quantity: buyQty,
      pricePerQuintal: buyPrice,
      totalAmount: totalPaid,
      pickupDate: purchaseData.pickupDate || new Date().toISOString().split("T")[0],
      logistics: purchaseData.logistics || "Dealer Farm Gate Pickup",
      date: new Date().toISOString().split("T")[0],
      status: "Confirmed"
    };

    if (!listing.transactions) {
      listing.transactions = [];
    }
    listing.transactions.unshift(transaction);

    // Update lot quantity or status
    listing.quantity -= buyQty;
    listing.totalValuation = listing.quantity * listing.askingPrice;
    if (listing.quantity <= 0) {
      listing.quantity = 0;
      listing.status = "Sold";
      listing.harvestStatus = "Procured & Sold";
    }

    // Persist Direct Buy Contract into MongoDB
    try {
      const Purchase = require("../../Models/Purchase");
      const SellCrop = require("../../Models/SellCrop");
      Purchase.create({
        orderId: `PO-DIR-${Date.now().toString().slice(-6)}`,
        cropId: listing.id,
        bidId: null,
        cropName: listing.crop,
        variety: listing.variety,
        farmerId: listing.farmerId,
        farmerName: listing.farmerName,
        farmerPhone: listing.farmerPhone,
        dealerId: "DLR-01",
        dealerName: transaction.dealerName,
        dealerPhone: transaction.dealerPhone,
        finalRatePerQuintal: buyPrice,
        quantity: buyQty,
        grossAmount: totalPaid,
        netPayable: totalPaid,
        pickupDate: transaction.pickupDate,
        logisticsProvider: transaction.logistics,
        paymentMode: "Direct Farm Gate Contract",
        paymentStatus: "Completed",
        deliveryStatus: "In Transit"
      }).catch(() => {});

      SellCrop.findOneAndUpdate(
        { lotId: listing.id },
        { quantity: listing.quantity, status: listing.status, harvestStatus: listing.harvestStatus }
      ).catch(() => {});
    } catch {}

    return { listing, transaction };
  },

  // Approve a dealer's bid rate (Farmer Action)
  approveBid: (bidId, remarks = "") => {
    for (const listing of cropListings) {
      const offer = (listing.offers || []).find((o) => o.id === bidId);
      if (offer) {
        offer.status = "Approved";
        offer.farmerRemarks = remarks || "Bid rate approved by cultivator. Ready for purchase.";
        offer.farmerResponseDate = new Date().toISOString();
        listing.status = "Under Negotiation";

        // Try persisting to MongoDB in background
        try {
          const Bid = require("../../Models/Bid");
          Bid.findOneAndUpdate(
            { bidId },
            { status: "Approved", farmerResponseDate: new Date(), farmerRemarks: offer.farmerRemarks }
          ).catch(() => {});
        } catch {}

        return { listing, offer };
      }
    }
    return null;
  },

  // Reject a dealer's bid rate (Farmer Action)
  rejectBid: (bidId, reason = "") => {
    for (const listing of cropListings) {
      const offer = (listing.offers || []).find((o) => o.id === bidId);
      if (offer) {
        offer.status = "Rejected";
        offer.farmerRemarks = reason || "Offered rate below minimum viable farm-gate threshold.";
        offer.farmerResponseDate = new Date().toISOString();

        // Try persisting to MongoDB in background
        try {
          const Bid = require("../../Models/Bid");
          Bid.findOneAndUpdate(
            { bidId },
            { status: "Rejected", farmerResponseDate: new Date(), farmerRemarks: offer.farmerRemarks }
          ).catch(() => {});
        } catch {}

        return { listing, offer };
      }
    }
    return null;
  },

  // Execute purchase strictly for an APPROVED bid rate
  buyApprovedBid: (bidId, buyerDetails = {}) => {
    for (const listing of cropListings) {
      const offer = (listing.offers || []).find((o) => o.id === bidId);
      if (offer) {
        // ENFORCE USER RULE: IF FARMER APPROVES THAT BID RATE THEN ONLY MOVE TO BUY
        if (offer.status !== "Approved") {
          return {
            success: false,
            error: `Purchase blocked: Cultivator has not approved this bid rate yet (Current status: ${offer.status}). You can only purchase at this rate after farmer approval.`
          };
        }

        const buyQty = Math.min(Number(offer.quantity) || listing.quantity, listing.quantity);
        const buyPrice = Number(offer.offerPrice) || listing.askingPrice;
        const totalPaid = buyQty * buyPrice;

        const transaction = {
          id: `TXN-${Date.now().toString().slice(-6)}`,
          orderId: `PO-2026-${Date.now().toString().slice(-6)}`,
          bidId: offer.id,
          dealerName: buyerDetails.dealerName || offer.dealerName || "Verified Mandi Vendor",
          dealerPhone: buyerDetails.dealerPhone || offer.dealerPhone || "+91 99000 11223",
          crop: listing.crop,
          variety: listing.variety,
          farmerName: listing.farmerName,
          farmerPhone: listing.farmerPhone,
          quantity: buyQty,
          approvedBidRate: buyPrice,
          pricePerQuintal: buyPrice,
          totalAmount: totalPaid,
          pickupDate: buyerDetails.pickupDate || offer.pickupDate || new Date().toISOString().split("T")[0],
          logistics: buyerDetails.logistics || offer.logistics || "Dealer Farm Gate Pickup",
          paymentMode: buyerDetails.paymentMode || "Instant RTGS / Escrow Mandi Transfer",
          date: new Date().toISOString().split("T")[0],
          status: "Confirmed"
        };

        if (!listing.transactions) {
          listing.transactions = [];
        }
        listing.transactions.unshift(transaction);

        // Deduct quantity from listing
        listing.quantity -= buyQty;
        listing.totalValuation = listing.quantity * listing.askingPrice;
        if (listing.quantity <= 0) {
          listing.quantity = 0;
          listing.status = "Sold";
          listing.harvestStatus = "Procured & Sold";
        }

        // Mark bid as purchased
        offer.status = "Purchased";
        offer.purchaseId = transaction.id;

        // Try persisting to MongoDB in background
        try {
          const Bid = require("../../Models/Bid");
          const Purchase = require("../../Models/Purchase");
          const SellCrop = require("../../Models/SellCrop");
          Bid.findOneAndUpdate({ bidId }, { status: "Purchased", purchaseId: transaction.id }).catch(() => {});
          SellCrop.findOneAndUpdate(
            { lotId: listing.id },
            { quantity: listing.quantity, status: listing.status, harvestStatus: listing.harvestStatus }
          ).catch(() => {});
          Purchase.create({
            orderId: transaction.orderId,
            cropId: listing.id,
            bidId: offer.id,
            cropName: listing.crop,
            variety: listing.variety,
            farmerId: listing.farmerId,
            farmerName: listing.farmerName,
            farmerPhone: listing.farmerPhone,
            dealerId: "DLR-01",
            dealerName: transaction.dealerName,
            dealerPhone: transaction.dealerPhone,
            finalRatePerQuintal: buyPrice,
            quantity: buyQty,
            grossAmount: totalPaid,
            netPayable: totalPaid,
            pickupDate: transaction.pickupDate,
            logisticsProvider: transaction.logistics,
            paymentMode: transaction.paymentMode,
            paymentStatus: "Completed",
            deliveryStatus: "In Transit"
          }).catch(() => {});
        } catch {}

        return { success: true, listing, offer, transaction };
      }
    }
    return { success: false, error: "Bid not found." };
  },

  // Delete listing
  deleteListing: (id) => {
    const idx = cropListings.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    cropListings.splice(idx, 1);
    try {
      const SellCrop = require("../../Models/SellCrop");
      SellCrop.deleteOne({ lotId: id }).catch(() => {});
    } catch {}
    return true;
  },

  // Fetch Completed Sales History directly from MongoDB Purchase collection
  getSalesHistory: async (filter = {}) => {
    try {
      const Purchase = require("../../Models/Purchase");
      const query = {};
      if (filter.farmerName) {
        query.farmerName = new RegExp(filter.farmerName, "i");
      }
      if (filter.farmerPhone) {
        query.farmerPhone = filter.farmerPhone;
      }
      if (filter.dealerName) {
        query.dealerName = new RegExp(filter.dealerName, "i");
      }
      const history = await Purchase.find(query).sort({ createdAt: -1 });
      return history;
    } catch (err) {
      console.warn("Could not query sales history from MongoDB:", err.message);
      return [];
    }
  },

  // Sync in-memory store from MongoDB
  syncFromMongo: async () => {
    try {
      const SellCrop = require("../../Models/SellCrop");
      const Bid = require("../../Models/Bid");
      const dbCrops = await SellCrop.find({});
      if (dbCrops && dbCrops.length > 0) {
        const allBids = await Bid.find({});
        cropListings = dbCrops.map((c) => {
          const matchingBids = allBids.filter((b) => b.cropId === c.lotId || b.cropId === c.id);
          return {
            id: c.lotId || c._id.toString(),
            farmerId: c.farmerId,
            farmerName: c.farmerName,
            farmerPhone: c.farmerPhone,
            crop: c.crop,
            variety: c.variety,
            grade: c.grade,
            quantity: c.quantity,
            unit: c.unit,
            askingPrice: c.askingPrice,
            totalValuation: c.totalValuation,
            harvestStatus: c.harvestStatus,
            location: `${c.district}, ${c.state}`,
            state: c.state,
            district: c.district,
            farmAddress: c.farmAddress,
            notes: c.notes,
            rating: c.rating,
            status: c.status,
            image: c.image,
            postedDate: c.createdAt ? c.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            offers: matchingBids.map((b) => ({
              id: b.bidId,
              dealerName: b.dealerName,
              dealerPhone: b.dealerPhone,
              offerPrice: b.bidPrice,
              quantity: b.quantity,
              totalAmount: b.totalAmount,
              pickupDate: b.pickupDate,
              logistics: b.logistics,
              note: b.note,
              status: b.status,
              farmerRemarks: b.farmerRemarks,
              farmerResponseDate: b.farmerResponseDate,
              purchaseId: b.purchaseId,
              date: b.createdAt ? b.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            })),
          };
        });
      }
    } catch (err) {
      console.warn("MongoDB sync fallback:", err.message);
    }
  }
};

// Auto-trigger sync in background
setTimeout(() => {
  store.syncFromMongo().catch(() => {});
}, 1000);

module.exports = store;
