import React, { useState, useMemo, useEffect } from "react";

export default function FarmerConnect() {
  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all-lots"); // "all-lots" | "ready-pickup" | "my-offers"
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Offer Modal State
  const [modalFarmer, setModalFarmer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    quantity: 100,
    offerPrice: 2400,
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    logistics: "Dealer Self-Pickup (Farm Gate)",
    note: "Looking for direct farm gate pickup with immediate weighbridge digital settlement.",
  });
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Direct Buy Modal State
  const [buyModalFarmer, setBuyModalFarmer] = useState(null);
  const [buyForm, setBuyForm] = useState({
    quantity: 100,
    pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    logistics: "Dealer Dedicated Fleet",
    paymentMode: "Instant RTGS / Escrow Mandi Transfer",
  });
  const [submittingBuy, setSubmittingBuy] = useState(false);

  // Approved Bid Buy Modal State (Strict farmer approval workflow)
  const [approvedBidToBuy, setApprovedBidToBuy] = useState(null);
  const [approvedBidForm, setApprovedBidForm] = useState({
    pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    logistics: "Dealer Dedicated Fleet",
    paymentMode: "Instant RTGS / Escrow Mandi Transfer",
  });
  const [submittingApprovedBuy, setSubmittingApprovedBuy] = useState(false);

  const [toast, setToast] = useState("");

  // Dealer user info
  const dealerObj = (() => {
    try {
      return JSON.parse(localStorage.getItem("userObj")) || {};
    } catch {
      return {};
    }
  })();

  const currentDealerName = dealerObj.name || "AgroTrade APMC Partner";
  const currentDealerPhone = dealerObj.phone || "+91 98765 00112";

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4500);
  };

  const fetchFarmersList = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${dealerApi}/farmers`);
      if (res.ok) {
        const data = await res.json();
        if (data.farmers && Array.isArray(data.farmers)) {
          setFarmers(data.farmers);
        }
      }
    } catch (err) {
      console.warn("Error loading farmer listings:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmersList();
  }, [dealerApi]);

  // Open Offer Modal
  const handleOpenOffer = (farmer) => {
    setModalFarmer(farmer);
    setOfferForm({
      quantity: Math.min(Number(farmer.quantity) || 100, 100),
      offerPrice: Number(farmer.askingPrice) || 2400,
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      logistics: "Dealer Self-Pickup (Farm Gate)",
      note: "Ready for direct farm gate pickup with immediate weighbridge clearance and digital settlement.",
    });
  };

  // Submit Bid/Offer
  const handleSendOffer = async (e) => {
    e.preventDefault();
    setSubmittingOffer(true);
    const farmerName = modalFarmer.name;
    const total = (offerForm.quantity * offerForm.offerPrice).toLocaleString();

    try {
      const res = await fetch(`${dealerApi}/farmers/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: modalFarmer.id,
          dealerName: currentDealerName,
          dealerPhone: currentDealerPhone,
          offerPrice: offerForm.offerPrice,
          quantity: offerForm.quantity,
          pickupDate: offerForm.deliveryDate,
          logistics: offerForm.logistics,
          note: offerForm.note,
        }),
      });

      if (res.ok) {
        showToast(`🎉 Bid of ₹${offerForm.offerPrice}/Q for ${offerForm.quantity} Q (₹${total}) sent to ${farmerName}!`);
        setModalFarmer(null);
        fetchFarmersList();
      } else {
        const errData = await res.json();
        showToast(`⚠️ ${errData.message || "Failed to dispatch bid."}`);
      }
    } catch (err) {
      console.warn("Offer submission error:", err);
      showToast("⚠️ Could not reach server. Please check network connection.");
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Open Direct Buy Modal
  const handleOpenBuy = (farmer) => {
    setBuyModalFarmer(farmer);
    setBuyForm({
      quantity: Number(farmer.quantity) || 50,
      pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      logistics: "Dealer Dedicated Fleet",
      paymentMode: "Instant RTGS / Escrow Mandi Transfer",
    });
  };

  // Submit Direct Buy
  const handleConfirmBuy = async (e) => {
    e.preventDefault();
    setSubmittingBuy(true);
    const farmerName = buyModalFarmer.name;
    const cropName = buyModalFarmer.crop;
    const qty = buyForm.quantity;
    const price = buyModalFarmer.askingPrice;
    const total = (qty * price).toLocaleString();

    try {
      const res = await fetch(`${dealerApi}/crops/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropId: buyModalFarmer.id,
          quantity: qty,
          price: price,
          dealerName: currentDealerName,
          dealerPhone: currentDealerPhone,
          logistics: buyForm.logistics,
          pickupDate: buyForm.pickupDate,
        }),
      });

      if (res.ok) {
        showToast(`✅ Procurement Confirmed! Acquired ${qty} Q of ${cropName} for ₹${total}. Batch added to Inventory!`);
        setBuyModalFarmer(null);
        fetchFarmersList();
      } else {
        const errData = await res.json();
        showToast(`⚠️ ${errData.message || "Purchase failed."}`);
      }
    } catch (err) {
      console.warn("Purchase error:", err);
      showToast("⚠️ Purchase request failed. Please check server.");
    } finally {
      setSubmittingBuy(false);
    }
  };

  // Open checkout modal to buy at farmer-approved rate
  const handleOpenApprovedBidBuy = (bid, farmerLot) => {
    if (bid.status !== "Approved") {
      showToast(`⚠️ Cannot buy yet: Cultivator has not approved this bid rate (Status: ${bid.status}).`);
      return;
    }
    setApprovedBidToBuy({ bid, farmerLot });
    setApprovedBidForm({
      pickupDate: bid.pickupDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      logistics: bid.logistics || "Dealer Dedicated Fleet",
      paymentMode: "Instant RTGS / Escrow Mandi Transfer",
    });
  };

  // Submit contract purchase against approved bid
  const handleConfirmApprovedBidBuy = async (e) => {
    e.preventDefault();
    if (!approvedBidToBuy) return;
    setSubmittingApprovedBuy(true);

    const { bid, farmerLot } = approvedBidToBuy;
    const total = (bid.quantity * bid.offerPrice).toLocaleString();

    try {
      const res = await fetch(`${dealerApi}/crops/bids/${bid.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerName: currentDealerName,
          dealerPhone: currentDealerPhone,
          pickupDate: approvedBidForm.pickupDate,
          logistics: approvedBidForm.logistics,
          paymentMode: approvedBidForm.paymentMode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 Contract Executed! Purchased ${bid.quantity} Q of ${farmerLot.crop} at approved rate ₹${bid.offerPrice}/Q for ₹${total}. Batch added to Inventory!`);
        setApprovedBidToBuy(null);
        fetchFarmersList();
      } else {
        showToast(`⚠️ ${data.message || "Purchase failed."}`);
      }
    } catch (err) {
      console.warn("Approved bid purchase error:", err);
      showToast("⚠️ Could not reach server. Please check connection.");
    } finally {
      setSubmittingApprovedBuy(false);
    }
  };

  // Collect all bids belonging to this dealer across all harvest lots
  const myBidsList = useMemo(() => {
    const list = [];
    farmers.forEach((f) => {
      (f.offers || []).forEach((o) => {
        const isMine =
          o.dealerName?.toLowerCase() === currentDealerName.toLowerCase() ||
          o.dealerPhone === currentDealerPhone;
        if (isMine) {
          list.push({
            bid: o,
            farmerLot: f,
          });
        }
      });
    });
    return list;
  }, [farmers, currentDealerName, currentDealerPhone]);

  // Extract unique commodities and states
  const availableCrops = useMemo(() => {
    const set = new Set();
    farmers.forEach((f) => {
      if (f.crop) set.add(f.crop);
    });
    return ["All", ...Array.from(set)];
  }, [farmers]);

  const availableStates = useMemo(() => {
    const set = new Set();
    farmers.forEach((f) => {
      if (f.state) set.add(f.state);
    });
    return ["All", ...Array.from(set)];
  }, [farmers]);

  // Filtered and Sorted Listings
  const filteredListings = useMemo(() => {
    return farmers.filter((f) => {
      // Tab filter
      if (activeTab === "ready-pickup") {
        const statusText = (f.harvestStatus || "").toLowerCase();
        if (!statusText.includes("ready") && !statusText.includes("harvested")) {
          return false;
        }
      } else if (activeTab === "my-offers") {
        const hasMyOffer = (f.offers || []).some(
          (o) =>
            o.dealerName?.toLowerCase() === currentDealerName.toLowerCase() ||
            o.dealerPhone === currentDealerPhone
        );
        if (!hasMyOffer) return false;
      }

      // Crop filter
      if (selectedCrop !== "All" && (f.crop || "").toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // State filter
      if (selectedState !== "All" && (f.state || "").toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const inName = (f.name || "").toLowerCase().includes(q);
        const inCrop = (f.crop || "").toLowerCase().includes(q);
        const inVariety = (f.variety || "").toLowerCase().includes(q);
        const inLoc = (f.location || "").toLowerCase().includes(q);
        const inDistrict = (f.district || "").toLowerCase().includes(q);
        if (!inName && !inCrop && !inVariety && !inLoc && !inDistrict) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return (a.askingPrice || 0) - (b.askingPrice || 0);
      if (sortBy === "price-high") return (b.askingPrice || 0) - (a.askingPrice || 0);
      if (sortBy === "qty-high") return (b.quantity || 0) - (a.quantity || 0);
      return 0; // default order
    });
  }, [farmers, activeTab, selectedCrop, selectedState, search, sortBy, currentDealerName, currentDealerPhone]);

  // Aggregate stats
  const totalLots = farmers.length;
  const totalVolume = farmers.reduce((sum, f) => sum + (Number(f.quantity) || 0), 0);
  const totalValue = farmers.reduce((sum, f) => sum + ((Number(f.quantity) || 0) * (Number(f.askingPrice) || 0)), 0);
  const totalActiveOffers = farmers.reduce((sum, f) => sum + (Number(f.offersCount) || 0), 0);

  return (
    <div
      className="min-h-screen bg-[#f8faf7] text-gray-900 pb-16"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-emerald-400 text-lg font-black">✓</span>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Header & Procurement Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Farm-Gate Procurement Feed
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Farmer Connect & Direct Procurement
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-2xl leading-relaxed">
              Explore freshly cultivated crop lots posted directly by verified farmers. Inspect harvest readiness, place competitive wholesale bids, or execute instant farm-gate purchase contracts.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchFarmersList}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition cursor-pointer"
            >
              <span className={loading ? "animate-spin" : ""}>🔄</span>
              Refresh Listings
            </button>
            <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="block text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Direct APMC Link
              </span>
              <span className="text-xs font-extrabold text-emerald-900">
                Zero Middlemen
              </span>
            </div>
          </div>
        </div>

        {/* Live Procurement Metrics KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#e2e8e0] shadow-xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Available Harvest Lots
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {totalLots} <span className="text-sm font-semibold text-gray-500">Lots</span>
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              Active across {availableStates.length - 1 || 1} agricultural states
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#e2e8e0] shadow-xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Volume Available
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-800 mt-1">
              {totalVolume.toLocaleString()} <span className="text-sm font-semibold text-emerald-600">Q</span>
            </p>
            <span className="text-[11px] text-gray-500 font-medium mt-1 block">
              Direct farm-gate supply
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#e2e8e0] shadow-xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Procurement Pipeline Value
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ₹{(totalValue / 100000).toFixed(1)} <span className="text-sm font-semibold text-gray-500">Lakh</span>
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              Based on cultivator asking rates
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#e2e8e0] shadow-xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Dealer Offers Dispatched
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              ⚡ {totalActiveOffers}
            </p>
            <span className="text-[11px] text-gray-500 font-medium mt-1 block">
              Active procurement negotiations
            </span>
          </div>
        </div>

        {/* Tab Navigation & Search / Filter Controls */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8e0] shadow-sm space-y-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
            <button
              onClick={() => setActiveTab("all-lots")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === "all-lots"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🌾 All Harvest Lots ({farmers.length})
            </button>
            <button
              onClick={() => setActiveTab("ready-pickup")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === "ready-pickup"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ⚡ Ready for Immediate Pickup
            </button>
            <button
              onClick={() => setActiveTab("my-offers")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "my-offers"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>📋</span> My Bids & Approval Tracker ({myBidsList.length})
              {myBidsList.some(item => item.bid.status === "Approved") && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white animate-pulse" title="Rates Approved by Farmer!"></span>
              )}
            </button>
          </div>

          {/* Search, Commodity, State, and Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search crop, farmer, district..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pl-9 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                🔍
              </span>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Commodity Selector */}
            <div>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="All">All Commodities</option>
                {availableCrops.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* State Selector */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="All">All States / Regions</option>
                {availableStates.filter((s) => s !== "All").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="newest">Sort: Newest Listings</option>
                <option value="price-low">Asking Price: Low to High</option>
                <option value="price-high">Asking Price: High to Low</option>
                <option value="qty-high">Quantity: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Farmer Posted Crops Grid OR My Bids & Approval Tracker */}
        <div>
          {activeTab === "my-offers" ? (
            <div className="space-y-6">
              {/* Workflow Rule Alert Header */}
              <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold border border-emerald-700 inline-block mb-2">
                      ⚡ APMC Rate Approval Rule
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      Wholesale Bids & Cultivator Rate Approvals
                    </h3>
                    <p className="text-emerald-300/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                      When you submit a bid rate, the cultivator reviews your proposed price. Only after the farmer <b>approves your bid rate</b> is the procurement contract unlocked for you to buy at that rate.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="px-4 py-2 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 text-center">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Pending</span>
                      <span className="text-lg font-black text-amber-400">
                        {myBidsList.filter(i => (!i.bid.status || i.bid.status === "Pending")).length}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 text-center">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Approved</span>
                      <span className="text-lg font-black text-emerald-400">
                        {myBidsList.filter(i => i.bid.status === "Approved").length}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-900/60 rounded-2xl border border-emerald-700/50 text-center">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">Purchased</span>
                      <span className="text-lg font-black text-blue-300">
                        {myBidsList.filter(i => i.bid.status === "Purchased").length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {myBidsList.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#e2e8e0] p-12 text-center shadow-xs">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                    📋
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No Active Bids Placed Yet
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    You haven't placed any wholesale procurement bids yet. Browse the available harvest lots and propose your wholesale rate.
                  </p>
                  <button
                    onClick={() => setActiveTab("all-lots")}
                    className="mt-4 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer shadow-xs"
                  >
                    Explore Harvest Lots to Bid
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myBidsList.map(({ bid, farmerLot }, idx) => {
                    const isPending = !bid.status || bid.status === "Pending";
                    const isApproved = bid.status === "Approved";
                    const isPurchased = bid.status === "Purchased";
                    const isRejected = bid.status === "Rejected";

                    return (
                      <div
                        key={bid.id || idx}
                        className={`bg-white rounded-3xl border ${
                          isApproved
                            ? "border-emerald-400 ring-2 ring-emerald-300/60 shadow-md"
                            : isPending
                            ? "border-amber-300 shadow-sm"
                            : isPurchased
                            ? "border-blue-300 bg-blue-50/20 shadow-sm"
                            : "border-gray-200 opacity-80"
                        } p-6 transition-all flex flex-col justify-between`}
                      >
                        <div className="space-y-4">
                          {/* Header: Lot & Status */}
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-base font-black text-gray-900">
                                  {farmerLot.crop}
                                </span>
                                {farmerLot.variety && (
                                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {farmerLot.variety}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Cultivator: <b className="text-gray-800">{farmerLot.name}</b> • 📍 {farmerLot.location}
                              </p>
                            </div>

                            {/* Status Badges */}
                            <div>
                              {isPending && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                                  <span>⏳</span> Pending Farmer Approval
                                </span>
                              )}
                              {isApproved && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                                  <span>✅</span> Rate Approved by Farmer!
                                </span>
                              )}
                              {isPurchased && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                                  <span>🎉</span> Purchased & Invoiced
                                </span>
                              )}
                              {isRejected && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-700 border border-red-200">
                                  <span>❌</span> Declined by Cultivator
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rate Comparison Card */}
                          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs">
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">Farmer Asking</span>
                              <span className="font-bold text-gray-700 text-sm">
                                ₹{farmerLot.askingPrice}/Q
                              </span>
                            </div>
                            <div>
                              <span className="text-emerald-800 block text-[10px] uppercase font-black">Your Bid Rate</span>
                              <span className="font-extrabold text-emerald-800 text-sm">
                                ₹{bid.offerPrice}/Q
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block text-[10px] uppercase font-bold">Batch Volume</span>
                              <span className="font-extrabold text-gray-900 text-sm">
                                {bid.quantity} Q
                              </span>
                            </div>
                          </div>

                          {/* Logistics & Valuation */}
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                            <span className="text-gray-500">Gross Valuation @ Bid Rate:</span>
                            <span className="font-black text-gray-900 text-base">
                              ₹{(bid.quantity * bid.offerPrice).toLocaleString()}
                            </span>
                          </div>

                          <div className="text-[11px] text-gray-500 space-y-1">
                            <div>📅 Scheduled Pickup: <b className="text-gray-700">{bid.pickupDate || "Immediate"}</b></div>
                            <div>🚚 Logistics Mode: <b className="text-gray-700">{bid.logistics}</b></div>
                            {bid.note && <div className="italic text-gray-400 bg-gray-50 p-2 rounded-xl">"{bid.note}"</div>}
                          </div>

                          {/* Conditional Status Banner */}
                          {isPending && (
                            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                              <div className="font-bold flex items-center gap-1.5">
                                <span>⏳</span> Waiting for Farmer Approval
                              </div>
                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                {farmerLot.name} has not accepted your rate of ₹{bid.offerPrice}/Q yet. You can only move to purchase this batch once the cultivator approves your offer.
                              </p>
                            </div>
                          )}

                          {isApproved && (
                            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                              <div className="font-black flex items-center gap-1.5 text-emerald-800">
                                <span>🎉</span> Rate Approved! Move to Buy Unlocked
                              </div>
                              <p className="text-[11px] text-emerald-800 leading-relaxed">
                                {farmerLot.name} has approved your bid rate of <b>₹{bid.offerPrice}/Q</b>. You are now authorized to execute the contract and procure this batch.
                              </p>
                            </div>
                          )}

                          {isPurchased && (
                            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900">
                              <div className="font-bold flex items-center gap-1.5 text-blue-800">
                                <span>✓</span> Order Executed & Added to Inventory
                              </div>
                              <p className="text-[11px] text-blue-700 mt-0.5">
                                Batch #{bid.id} has been processed into your warehouse and logistics shipment created.
                              </p>
                            </div>
                          )}

                          {isRejected && (
                            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900">
                              <div className="font-bold flex items-center gap-1.5 text-red-800">
                                <span>❌</span> Offer Declined
                              </div>
                              <p className="text-[11px] text-red-700 mt-0.5">
                                Cultivator declined ₹{bid.offerPrice}/Q. You can submit a new offer closer to asking price ₹{farmerLot.askingPrice}/Q.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 pt-3 border-t border-gray-100 space-y-2">
                          {isApproved && (
                            <button
                              onClick={() => handleOpenApprovedBidBuy(bid, farmerLot)}
                              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>🛒</span> Complete Purchase @ ₹{bid.offerPrice}/Q (Approved Rate)
                            </button>
                          )}

                          {isPending && (
                            <button
                              disabled
                              title="Farmer must approve this bid rate before order execution"
                              className="w-full py-2.5 px-4 bg-gray-100 text-gray-400 rounded-xl text-xs font-bold border border-gray-200 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <span>🔒</span> Purchase Locked (Awaiting Farmer Approval)
                            </button>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleOpenOffer(farmerLot)}
                              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                            >
                              <span>⚡</span> Place Revised Counter-Bid
                            </button>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`tel:${farmerLot.phone}`}
                              className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700 text-xs font-bold transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>📞</span> Call Farmer
                            </a>
                            <a
                              href={`https://wa.me/${(farmerLot.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${farmerLot.name}, regarding my bid of ₹${bid.offerPrice}/Q for your ${farmerLot.crop} lot on Cropio APMC.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-800 text-xs font-bold transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>💬</span> WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-emerald-600 rounded-full"></span>
                  Available Farm-Gate Lots
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-1">
                    {filteredListings.length} matching
                  </span>
                </h2>

                {(search || selectedCrop !== "All" || selectedState !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCrop("All");
                      setSelectedState("All");
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Reset Filters ↺
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-3xl border border-gray-200 p-6 animate-pulse h-80 flex flex-col justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-32 bg-gray-100 rounded-2xl"></div>
                      <div className="h-8 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#e2e8e0] p-12 text-center shadow-xs">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                    🌾
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    No Farmer Listings Match Selected Criteria
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                    Try switching the commodity or state filter, or clear your search term to see all freshly posted harvest lots.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCrop("All");
                      setSelectedState("All");
                      setActiveTab("all-lots");
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
                  >
                    Show All Available Crops
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((farmer) => {
                    const isSoldOut = farmer.quantity <= 0 || farmer.status === "Sold";
                    const isReady = (farmer.harvestStatus || "").toLowerCase().includes("ready") || (farmer.harvestStatus || "").toLowerCase().includes("harvested");
                    const myBid = (farmer.offers || []).find(
                      (o) =>
                        o.dealerName?.toLowerCase() === currentDealerName.toLowerCase() ||
                        o.dealerPhone === currentDealerPhone
                    );
                    const hasMyBid = Boolean(myBid);

                    return (
                      <div
                        key={farmer.id}
                        className={`bg-white rounded-3xl border ${
                          isSoldOut
                            ? "border-gray-200 opacity-75"
                            : "border-[#e2e8e0] hover:border-emerald-300 hover:shadow-lg"
                        } p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between group shadow-sm`}
                      >
                        <div>
                          {/* Card Header & Photo */}
                          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100 mb-4">
                            <img
                              src={
                                farmer.image ||
                                "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70"
                              }
                              alt={farmer.crop}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=70";
                              }}
                            />

                            {/* Status Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                              <span className="bg-white/95 backdrop-blur-md text-emerald-900 text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs">
                                {farmer.crop}
                              </span>
                              {farmer.variety && (
                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                  {farmer.variety}
                                </span>
                              )}
                            </div>

                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                              {isSoldOut ? (
                                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                                  Sold Out
                                </span>
                              ) : isReady ? (
                                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                                  ● Ready for Pickup
                                </span>
                              ) : (
                                <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
                                  Harvest in Progress
                                </span>
                              )}

                              {farmer.grade && (
                                <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                  {farmer.grade}
                                </span>
                              )}
                            </div>

                            {/* Lot ID Badge */}
                            <div className="absolute bottom-2 left-3 bg-black/50 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                              ID: {farmer.id}
                            </div>
                          </div>

                          {/* Cultivator Profile */}
                          <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                                  {farmer.name}
                                </h3>
                                <span className="text-emerald-600 text-xs" title="Verified Cultivator">
                                  ✓
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                <span>📍</span>
                                {farmer.location || `${farmer.district}, ${farmer.state}`}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                ★ {farmer.rating || "4.8"}
                              </span>
                            </div>
                          </div>

                          {/* Lot Specifications Grid */}
                          <div className="mt-3.5 bg-gray-50/80 rounded-2xl p-3.5 border border-gray-100 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 font-medium">Available Volume:</span>
                              <span className="font-extrabold text-gray-900 text-sm">
                                {farmer.quantity} {farmer.unit || "Quintals"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 font-medium">Asking Mandi Rate:</span>
                              <span className="font-extrabold text-emerald-800 text-sm">
                                ₹{Number(farmer.askingPrice).toLocaleString()} / Q
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-200/60">
                              <span className="text-gray-500 font-medium">Total Lot Valuation:</span>
                              <span className="font-bold text-gray-800">
                                ₹{(farmer.quantity * farmer.askingPrice).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Farm Readiness & Notes */}
                          <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                            {farmer.harvestStatus && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-emerald-700 font-bold">🌾 Status:</span>
                                <span className="font-medium text-gray-700">{farmer.harvestStatus}</span>
                              </div>
                            )}
                            {farmer.farmAddress && (
                              <div className="flex items-start gap-1.5">
                                <span className="text-gray-400">🚜 Gate:</span>
                                <span className="text-gray-500 truncate">{farmer.farmAddress}</span>
                              </div>
                            )}
                            {farmer.notes && (
                              <p className="text-[11px] text-gray-500 bg-white p-2 rounded-xl border border-gray-100 mt-2 line-clamp-2 leading-relaxed">
                                "{farmer.notes}"
                              </p>
                            )}
                          </div>

                          {/* Active Bids Badge */}
                          <div className="mt-3 flex items-center justify-between text-[11px]">
                            {farmer.offersCount > 0 ? (
                              <span className="text-amber-700 font-bold flex items-center gap-1">
                                <span>⚡</span> {farmer.offersCount} Active Dealer Bid{farmer.offersCount > 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-medium">
                                No dealer bids yet — Be first
                              </span>
                            )}

                            {hasMyBid && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                ✓ Your Bid Submitted
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 pt-3 border-t border-gray-100 space-y-2">
                          {!isSoldOut ? (
                            <div className="space-y-2">
                              {/* If this dealer has an APPROVED bid, prominent Buy at Approved Rate button */}
                              {hasMyBid && myBid && myBid.status === "Approved" ? (
                                <button
                                  onClick={() => handleOpenApprovedBidBuy(myBid, farmer)}
                                  className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <span>🛒</span> Buy @ Approved Rate ₹{myBid.offerPrice}/Q!
                                </button>
                              ) : hasMyBid && myBid && (!myBid.status || myBid.status === "Pending") ? (
                                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-center text-[11px] font-bold text-amber-800 flex items-center justify-center gap-1">
                                  <span>⏳</span> Bid ₹{myBid.offerPrice}/Q Pending Farmer Approval
                                </div>
                              ) : null}

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenOffer(farmer)}
                                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <span>⚡</span> {hasMyBid ? "Place Revised Bid" : "Place Bid / Offer"}
                                </button>
                                <button
                                  onClick={() => handleOpenBuy(farmer)}
                                  className="py-2.5 px-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                  title="Instant Direct Purchase Contract at Asking Price"
                                >
                                  🛒 Buy Now
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="py-2.5 bg-gray-100 text-gray-500 text-center rounded-xl text-xs font-bold">
                              Batch Procured & Sold Out
                            </div>
                          )}

                          {/* Direct Communication Buttons */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${farmer.phone}`}
                              className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700 text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                            >
                              <span>📞</span> Call Farmer
                            </a>
                            <a
                              href={`https://wa.me/${(farmer.phone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${farmer.name}, I saw your ${farmer.crop} listing (${farmer.quantity} Quintals) on Cropio APMC. I am interested in purchasing.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl text-emerald-800 text-xs font-bold transition text-center flex items-center justify-center gap-1.5"
                            >
                              <span>💬</span> WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Place Bid / Purchase Offer Modal */}
        {modalFarmer && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1 border border-emerald-100">
                    <span>⚡</span> Direct Procurement Bid
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    Place Purchase Bid
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    For {modalFarmer.name}'s {modalFarmer.crop} ({modalFarmer.variety || "Lot"}) • {modalFarmer.location}
                  </p>
                </div>
                <button
                  onClick={() => setModalFarmer(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSendOffer} className="space-y-4 mt-5">
                
                {/* Lot Summary Box */}
                <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block">Cultivator Asking Rate:</span>
                    <span className="font-extrabold text-emerald-800 text-sm">
                      ₹{modalFarmer.askingPrice} / Quintal
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Available Batch Size:</span>
                    <span className="font-extrabold text-gray-900 text-sm">
                      {modalFarmer.quantity} Quintals
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Purchase Quantity (Quintals) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={modalFarmer.quantity}
                      required
                      value={offerForm.quantity}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, quantity: Math.max(1, parseFloat(e.target.value) || 0) })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Max lot size: {modalFarmer.quantity} Q
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Your Offer Price (₹ / Q) *
                    </label>
                    <input
                      type="number"
                      step="10"
                      min="100"
                      required
                      value={offerForm.offerPrice}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, offerPrice: Math.max(100, parseFloat(e.target.value) || 0) })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                      Asking: ₹{modalFarmer.askingPrice}/Q
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Target Delivery / Pickup Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={offerForm.deliveryDate}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, deliveryDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Logistics Mode *
                    </label>
                    <select
                      value={offerForm.logistics}
                      onChange={(e) =>
                        setOfferForm({ ...offerForm, logistics: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Dealer Self-Pickup (Farm Gate)">Dealer Self-Pickup (Farm Gate)</option>
                      <option value="Farmer Delivery to Mandi">Farmer Delivery to Mandi Yard</option>
                      <option value="Third-Party Freight Carrier">Third-Party Freight Carrier</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Terms & Instructions for Farmer
                  </label>
                  <textarea
                    rows={2}
                    value={offerForm.note}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, note: e.target.value })
                    }
                    placeholder="e.g. Moisture test clearance required. Immediate digital payment via RTGS."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Total Value Calculation */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider">
                      Total Bid Commitment
                    </span>
                    <span className="text-xs text-gray-600">
                      {offerForm.quantity} Q × ₹{offerForm.offerPrice}/Q
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-900">
                    ₹{(offerForm.quantity * offerForm.offerPrice).toLocaleString()}
                  </span>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalFarmer(null)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingOffer}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {submittingOffer ? "Dispatching..." : "Dispatch Bid to Farmer ⚡"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Direct Buy (Contract) Modal */}
        {buyModalFarmer && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
              
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
                    <span>🛒</span> Instant Contract Purchase
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    Confirm Purchase Contract
                  </h3>
                  <p className="text-xs text-gray-500">
                    {buyModalFarmer.crop} • {buyModalFarmer.name}
                  </p>
                </div>
                <button
                  onClick={() => setBuyModalFarmer(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmBuy} className="space-y-4 mt-4">
                <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fixed Mandi Rate:</span>
                    <span className="font-extrabold text-blue-900">₹{buyModalFarmer.askingPrice} / Quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Farm Gate:</span>
                    <span className="font-medium text-gray-800">{buyModalFarmer.location}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Procurement Quantity (Quintals) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={buyModalFarmer.quantity}
                    required
                    value={buyForm.quantity}
                    onChange={(e) =>
                      setBuyForm({ ...buyForm, quantity: Math.min(buyModalFarmer.quantity, Math.max(1, parseFloat(e.target.value) || 0)) })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                  <span className="text-[10px] text-gray-400">Available: {buyModalFarmer.quantity} Q</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pickup Schedule Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={buyForm.pickupDate}
                    onChange={(e) => setBuyForm({ ...buyForm, pickupDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Payment & Settlement Channel
                  </label>
                  <select
                    value={buyForm.paymentMode}
                    onChange={(e) => setBuyForm({ ...buyForm, paymentMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Instant RTGS / Escrow Mandi Transfer">Instant RTGS / Escrow Mandi Transfer</option>
                    <option value="Weighbridge Clearance Check">Weighbridge Clearance Check</option>
                    <option value="Direct UPI Mandate">Direct UPI Mandate</option>
                  </select>
                </div>

                {/* Total Invoice */}
                <div className="p-4 bg-gray-900 text-white rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider">
                      Gross Settlement Amount
                    </span>
                    <span className="text-xs text-gray-300">
                      {buyForm.quantity} Q × ₹{buyModalFarmer.askingPrice}
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{(buyForm.quantity * buyModalFarmer.askingPrice).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBuyModalFarmer(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBuy}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {submittingBuy ? "Processing Contract..." : "Confirm & Execute Contract 🛒"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Purchase Contract Modal for Farmer-Approved Bid Rate */}
        {approvedBidToBuy && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8">
              
              <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1 border border-emerald-200">
                    <span>✅</span> Farmer-Approved Bid Rate
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    Execute Purchase Contract
                  </h3>
                  <p className="text-xs text-gray-500">
                    {approvedBidToBuy.farmerLot.crop} • Cultivator: {approvedBidToBuy.farmerLot.name} ({approvedBidToBuy.farmerLot.location})
                  </p>
                </div>
                <button
                  onClick={() => setApprovedBidToBuy(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmApprovedBidBuy} className="space-y-4 mt-4">
                
                {/* Rate Approval Confirmation Banner */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Cultivator Asking Rate:</span>
                    <span className="font-semibold text-gray-400 line-through">₹{approvedBidToBuy.farmerLot.askingPrice} / Q</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold text-emerald-900">
                    <span>Approved Contract Rate:</span>
                    <span className="text-base bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-lg font-black">
                      ₹{approvedBidToBuy.bid.offerPrice} / Quintal
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 pt-1 border-t border-emerald-200/60">
                    <span>Contract Procurement Quantity:</span>
                    <span className="font-bold text-gray-900">{approvedBidToBuy.bid.quantity} Quintals</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pickup Schedule Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={approvedBidForm.pickupDate}
                    onChange={(e) => setApprovedBidForm({ ...approvedBidForm, pickupDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Logistics & Fleet Provider *
                  </label>
                  <select
                    value={approvedBidForm.logistics}
                    onChange={(e) => setApprovedBidForm({ ...approvedBidForm, logistics: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Dealer Dedicated Fleet">Dealer Dedicated Fleet</option>
                    <option value="Farm Gate Transit Co.">Farm Gate Transit Co.</option>
                    <option value="Cultivator Arranged Transit">Cultivator Arranged Transit</option>
                    <option value="Third-Party Freight Carrier">Third-Party Freight Carrier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Settlement & Escrow Channel
                  </label>
                  <select
                    value={approvedBidForm.paymentMode}
                    onChange={(e) => setApprovedBidForm({ ...approvedBidForm, paymentMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Instant RTGS / Escrow Mandi Transfer">Instant RTGS / Escrow Mandi Transfer</option>
                    <option value="Weighbridge Clearance Digital Check">Weighbridge Clearance Digital Check</option>
                    <option value="Direct APMC Bank Transfer">Direct APMC Bank Transfer</option>
                  </select>
                </div>

                {/* Gross Amount at Approved Rate */}
                <div className="p-4 bg-gray-900 text-white rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-bold">
                      Net Payable @ Approved Rate
                    </span>
                    <span className="text-xs text-gray-300">
                      {approvedBidToBuy.bid.quantity} Q × ₹{approvedBidToBuy.bid.offerPrice}/Q
                    </span>
                  </div>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{(approvedBidToBuy.bid.quantity * approvedBidToBuy.bid.offerPrice).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApprovedBidToBuy(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApprovedBuy}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>🛒</span>
                    {submittingApprovedBuy ? "Executing Contract..." : "Confirm & Purchase @ Approved Rate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
