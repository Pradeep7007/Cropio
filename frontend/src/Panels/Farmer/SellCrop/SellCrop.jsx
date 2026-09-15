import React, { useState, useEffect, useMemo } from "react";

export default function SellCrop() {
  const [activeTab, setActiveTab] = useState("my-listings"); // "my-listings" | "all-listings"
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");

  // Sales History State (from MongoDB Purchase collection)
  const [salesHistory, setSalesHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const baseUrl = import.meta.env.VITE_FARMER_API_URL || "http://localhost:5000/api/farmer";

  // Get current logged-in farmer info
  const userObj = (() => {
    try {
      return JSON.parse(localStorage.getItem("userObj")) || {};
    } catch {
      return {};
    }
  })();

  const currentFarmerName = userObj.name || "Baldev Singh";
  const currentFarmerPhone = userObj.phone || "+91 98140 11223";

  // Form State
  const [formData, setFormData] = useState({
    crop: "Wheat",
    variety: "Sharbati (PBW 343)",
    grade: "Grade A",
    quantity: 200,
    unit: "Quintals",
    askingPrice: 2450,
    harvestStatus: "Harvested • Ready for Pickup",
    state: "Punjab",
    district: "Ludhiana",
    farmAddress: "Village GT Road, Farm Gate #2",
    notes: "Sun-dried natural harvest with moisture under 12%. No chemical storage preservatives.",
    farmerName: currentFarmerName,
    farmerPhone: currentFarmerPhone,
  });

  // Fetch all crop listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/crops/listings`);
      if (res.ok) {
        const data = await res.json();
        if (data.listings) {
          setListings(data.listings);
        }
      }
    } catch (err) {
      console.warn("Error fetching crop listings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch completed sales history directly from MongoDB Purchase collection
  const fetchSalesHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`${baseUrl}/crops/sales-history?farmerName=${encodeURIComponent(currentFarmerName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setSalesHistory(data.history);
        }
      }
    } catch (err) {
      console.warn("Error fetching sales history from MongoDB:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchSalesHistory();
  }, []);

  useEffect(() => {
    if (activeTab === "sales-history") {
      fetchSalesHistory();
    }
  }, [activeTab]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Farmer's own listings
  const myListings = useMemo(() => {
    return listings.filter(
      (item) =>
        item.farmerName.toLowerCase() === currentFarmerName.toLowerCase() ||
        item.farmerPhone === currentFarmerPhone ||
        item.farmerId === "FMR-01" // Include demo farmer listings
    );
  }, [listings, currentFarmerName, currentFarmerPhone]);

  // Filtered market feed
  const marketListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesCrop = selectedCropFilter === "All" || item.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.crop.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.farmerName.toLowerCase().includes(q);
      return matchesCrop && matchesSearch;
    });
  }, [listings, selectedCropFilter, search]);

  // Aggregate stats
  const totalListedQty = myListings.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalAskingValuation = myListings.reduce((sum, item) => sum + (Number(item.totalValuation) || 0), 0);
  const totalOffersReceived = myListings.reduce((sum, item) => sum + ((item.offers && item.offers.length) || 0), 0);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`${baseUrl}/crops/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`🎉 Your ${formData.crop} lot has been listed! APMC dealers can now submit bids.`);
        setIsModalOpen(false);
        fetchListings();
        // Reset to default
        setFormData((prev) => ({
          ...prev,
          crop: "Wheat",
          variety: "Standard Variety",
          quantity: 100,
          askingPrice: 2400,
        }));
      } else {
        alert(data.message || "Failed to publish listing.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not reach backend server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status: Sold or Available
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Sold" : "Available";
    try {
      const res = await fetch(`${baseUrl}/crops/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Listing marked as ${newStatus}`);
        setListings((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Listing
  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to remove this crop listing?")) return;
    try {
      const res = await fetch(`${baseUrl}/crops/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Crop listing removed successfully.");
        setListings((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Farmer Bid Approval Handler
  const handleApproveBid = async (bidId, offerPrice, dealerName) => {
    try {
      const res = await fetch(`${baseUrl}/crops/bids/${bidId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remarks: "Approved by cultivator at requested rate." }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`✅ You approved the bid rate of ₹${offerPrice}/Q from ${dealerName}! The dealer can now buy at this rate.`);
        fetchListings();
      } else {
        alert(data.message || "Failed to approve bid rate.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error: Could not reach backend server.");
    }
  };

  // Farmer Bid Rejection Handler
  const handleRejectBid = async (bidId, dealerName) => {
    if (!window.confirm(`Decline the offer from ${dealerName}?`)) return;
    try {
      const res = await fetch(`${baseUrl}/crops/bids/${bidId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Offered rate below minimum viable farm-gate threshold." }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`❌ Bid from ${dealerName} declined.`);
        fetchListings();
      } else {
        alert(data.message || "Failed to decline bid.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8faf7] text-[#121b0e] py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500 animate-bounce">
            <span>✨</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#15803d] text-white p-6 sm:p-8 md:p-10 shadow-lg">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold mb-3 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                Direct Farm-Gate APMC Procurement
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                Sell Cultivated Harvest to Verified Dealers
              </h1>
              <p className="text-emerald-100/90 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Post your harvested produce directly to 500+ licensed mandi merchants, grain millers, and wholesale distributors. Eliminate middleman cuts and negotiate the best spot rates.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-sm sm:text-base bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 shadow-xl transition-all duration-200 cursor-pointer shrink-0"
            >
              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              List New Crop for Sale
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
              <span className="text-xs text-emerald-200 uppercase font-semibold">My Active Lots</span>
              <div className="text-2xl font-black mt-0.5">{myListings.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
              <span className="text-xs text-emerald-200 uppercase font-semibold">Total Listed Volume</span>
              <div className="text-2xl font-black mt-0.5">{totalListedQty} <span className="text-xs font-normal text-emerald-200">Quintals</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
              <span className="text-xs text-emerald-200 uppercase font-semibold">Total Asking Value</span>
              <div className="text-2xl font-black mt-0.5 text-emerald-300">₹{totalAskingValuation.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
              <span className="text-xs text-emerald-200 uppercase font-semibold">Dealer Bids Received</span>
              <div className="text-2xl font-black mt-0.5 text-amber-300">{totalOffersReceived}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 sm:p-2.5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "my-listings"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              My Posted Crops & Bids ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab("all-listings")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "all-listings"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Marketplace Feed ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab("sales-history")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "sales-history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <span>📜</span> Sell History ({salesHistory.length})
            </button>
          </div>

          <div className="text-xs font-medium text-gray-500 px-3">
            Logged in as: <span className="font-bold text-gray-800">{currentFarmerName}</span>
          </div>
        </div>

        {/* TAB 1: My Listings & Received Offers */}
        {activeTab === "my-listings" && (
          <div className="space-y-6">
            {myListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                  🌾
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Crop Lots Posted Yet</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  You haven't posted any cultivated crops for sale. Click the button below to list your wheat, rice, corn, or vegetables and start receiving bids from dealers.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  List My Harvest Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-[#e2e8e0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.crop}
                            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-black text-gray-900">{item.crop}</h3>
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                                {item.grade}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{item.variety}</p>
                            <p className="text-xs text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {item.location}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            item.status === "Available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {item.status === "Available" ? "🟢 Available" : "⚪ Sold Out"}
                        </span>
                      </div>

                      {/* Lot Specifications */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100 mb-4 text-xs">
                        <div>
                          <span className="text-gray-400 font-medium">Lot Size</span>
                          <div className="font-bold text-gray-900 text-sm">{item.quantity} {item.unit}</div>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Asking Price</span>
                          <div className="font-bold text-emerald-700 text-sm">₹{item.askingPrice.toLocaleString()} / Q</div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-gray-400 font-medium">Lot Valuation</span>
                          <div className="font-black text-gray-900 text-sm">₹{(item.totalValuation || item.quantity * item.askingPrice).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 mb-4 space-y-1">
                        <div><span className="font-semibold text-gray-700">Harvest Status:</span> {item.harvestStatus}</div>
                        {item.farmAddress && <div><span className="font-semibold text-gray-700">Farm Gate:</span> {item.farmAddress}</div>}
                        {item.notes && <div className="text-gray-500 italic">"{item.notes}"</div>}
                      </div>

                      {/* Received Dealer Offers Section */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Dealer Bids & Purchase Offers ({item.offers ? item.offers.length : 0})
                          </span>
                        </div>

                        {item.offers && item.offers.length > 0 ? (
                          <div className="space-y-3">
                            {item.offers.map((offer, idx) => (
                              <div
                                key={offer.id || idx}
                                className={`rounded-2xl p-4 border space-y-3 transition-all ${
                                  offer.status === "Approved"
                                    ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200"
                                    : offer.status === "Purchased"
                                    ? "bg-blue-50/70 border-blue-300"
                                    : offer.status === "Rejected"
                                    ? "bg-red-50/50 border-red-200 opacity-75"
                                    : "bg-amber-50/60 border-amber-200"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-black text-gray-900">{offer.dealerName}</span>
                                      
                                      {/* Bid Status Badge */}
                                      {offer.status === "Approved" && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                                          ✓ Rate Approved by You
                                        </span>
                                      )}
                                      {offer.status === "Purchased" && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                                          🎉 Order Executed & Paid
                                        </span>
                                      )}
                                      {offer.status === "Rejected" && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white">
                                          Declined
                                        </span>
                                      )}
                                      {(!offer.status || offer.status === "Pending") && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse">
                                          ⏳ Awaiting Your Approval
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-gray-500 mt-0.5">{offer.dealerPhone}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-black text-emerald-700">
                                      ₹{offer.offerPrice.toLocaleString()} / Q
                                    </div>
                                    <div className="text-[10px] text-gray-500 font-medium">
                                      Total: ₹{(offer.totalAmount || offer.offerPrice * offer.quantity).toLocaleString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-gray-200/60">
                                  <span>📦 Qty: <b>{offer.quantity} Q</b></span>
                                  <span>🚚 Pickup: <b>{offer.pickupDate || "Within 3 days"}</b></span>
                                  <span>⚖️ <b>{offer.logistics || "Dealer Pickup"}</b></span>
                                </div>

                                {offer.note && (
                                  <p className="text-xs text-gray-600 italic bg-white/80 p-2 rounded-xl border border-gray-100">
                                    "{offer.note}"
                                  </p>
                                )}

                                {/* Cultivator Rate Approval Action Panel */}
                                {(!offer.status || offer.status === "Pending") && (
                                  <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300/80 space-y-2">
                                    <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                                      <span>⚠️</span>
                                      <span><b>Action Required:</b> The dealer cannot buy at ₹{offer.offerPrice}/Q until you approve this rate.</span>
                                    </div>
                                    <div className="flex items-center gap-2 pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleApproveBid(offer.id, offer.offerPrice, offer.dealerName)}
                                        className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                                      >
                                        <span>✅</span> Approve Bid Rate (₹{offer.offerPrice}/Q)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRejectBid(offer.id, offer.dealerName)}
                                        className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition border border-red-200 cursor-pointer"
                                      >
                                        Decline ✕
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {offer.status === "Approved" && (
                                  <div className="p-2.5 bg-emerald-100/80 rounded-xl border border-emerald-300 text-[11px] text-emerald-900 font-medium flex items-center justify-between">
                                    <span>
                                      ✅ <b>Rate Approved:</b> Dealer is now authorized to buy this batch at <b>₹{offer.offerPrice}/Q</b>.
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                                      Ready for Purchase
                                    </span>
                                  </div>
                                )}

                                {offer.status === "Purchased" && (
                                  <div className="p-2.5 bg-blue-100/80 rounded-xl border border-blue-300 text-[11px] text-blue-900 font-medium flex items-center justify-between">
                                    <span>
                                      🎉 <b>Procurement Finalized:</b> Order contract executed and payment recorded.
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-blue-700">
                                      Ref: {offer.purchaseId || "PO-CONFIRMED"}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 pt-1">
                                  <a
                                    href={`tel:${offer.dealerPhone}`}
                                    className="flex-1 text-center py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-black transition cursor-pointer"
                                  >
                                    📞 Call Dealer
                                  </a>
                                  <a
                                    href={`https://wa.me/${(offer.dealerPhone || "").replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 rounded-xl bg-green-50 text-green-700 font-bold text-xs border border-green-200 hover:bg-green-100 transition cursor-pointer"
                                  >
                                    WhatsApp
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 p-3 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                            No dealer bids submitted yet. Your listing is visible to vendors in the Dealer Procurement portal.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer border ${
                          item.status === "Available"
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                        }`}
                      >
                        {item.status === "Available" ? "Mark as Sold" : "Re-open Lot"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteListing(item.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-3 py-2 cursor-pointer"
                      >
                        Delete Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Marketplace Feed of all active farmer crops */}
        {activeTab === "all-listings" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search by crop, farmer name, district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-gray-500 uppercase">Crop:</span>
                <select
                  value={selectedCropFilter}
                  onChange={(e) => setSelectedCropFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Crops</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Corn">Corn</option>
                  <option value="Soybean">Soybean</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 bg-gray-100">
                      <img src={item.image} alt={item.crop} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-900 font-bold text-xs shadow-sm">
                        {item.crop}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-semibold text-[11px] shadow-sm">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-gray-900">{item.variety}</h3>
                      <span className="text-xs font-semibold text-gray-500">{item.grade}</span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {item.location}
                    </p>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Available Lot:</span>
                        <span className="font-bold text-gray-900">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Farmer Asking Rate:</span>
                        <span className="font-bold text-emerald-700">₹{item.askingPrice.toLocaleString()} / Q</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Harvest Status:</span>
                        <span className="font-medium text-gray-800">{item.harvestStatus}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      Cultivator: <span className="font-bold text-gray-800">{item.farmerName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Direct APMC Trade</span>
                    <a
                      href={`tel:${item.farmerPhone}`}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      📞 {item.farmerPhone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Sales History (Executed Purchase Orders Persisted in MongoDB) */}
        {activeTab === "sales-history" && (
          <div className="space-y-6">
            <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-700 inline-block mb-2">
                  🗄️ MongoDB Atlas Verified Contracts
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  Cultivated Crops Sales & Settlement History
                </h3>
                <p className="text-emerald-300/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                  Real-time records of all executed farm-gate procurement contracts, dealer payouts, and weighbridge invoices persisted in the MongoDB <code className="bg-black/40 px-1.5 py-0.5 rounded text-emerald-300">purchases</code> collection.
                </p>
              </div>

              <button
                onClick={fetchSalesHistory}
                disabled={loadingHistory}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 rounded-xl text-xs font-bold border border-emerald-700 transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span className={loadingHistory ? "animate-spin" : ""}>🔄</span> Refresh History
              </button>
            </div>

            {loadingHistory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-gray-200 animate-pulse h-48"></div>
                ))}
              </div>
            ) : salesHistory.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-xs">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3">
                  📜
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No Finalized Sales Yet
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Once you approve a dealer's bid rate and they execute the procurement contract, the finalized invoice and transaction record will appear here and in your MongoDB database.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {salesHistory.map((order) => (
                  <div
                    key={order._id || order.orderId}
                    className="bg-white rounded-3xl p-6 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-md transition-all shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar: Order ID & Status */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-gray-900">
                              {order.cropName}
                            </span>
                            {order.variety && (
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                {order.variety}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-bold mt-1 inline-block">
                            PO: {order.orderId}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                            ✓ {order.paymentStatus || "Paid"}
                          </span>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                            {order.invoiceNumber || "INV-APMC"}
                          </div>
                        </div>
                      </div>

                      {/* Financials Grid */}
                      <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Approved Rate</span>
                          <span className="font-extrabold text-emerald-800 text-sm">
                            ₹{order.finalRatePerQuintal} / Q
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Procured Qty</span>
                          <span className="font-bold text-gray-900 text-sm">
                            {order.quantity} Q
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Gross Payout</span>
                          <span className="font-black text-gray-900 text-sm">
                            ₹{(order.grossAmount || order.netPayable || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Buyer & Logistics info */}
                      <div className="text-xs text-gray-600 space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Procuring Dealer:</span>
                          <span className="font-bold text-gray-900">{order.dealerName}</span>
                        </div>
                        {order.dealerPhone && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Buyer Phone:</span>
                            <span className="font-mono text-gray-700">{order.dealerPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Pickup Date:</span>
                          <span className="font-semibold text-gray-800">{order.pickupDate || "Completed"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Logistics & Vehicle:</span>
                          <span className="font-medium text-gray-800">
                            {order.vehicleNumber || "Transit Co."} ({order.logisticsProvider || "Self-Pickup"})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Payment Mode:</span>
                          <span className="font-medium text-emerald-800">{order.paymentMode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <span>●</span> MongoDB Persisted
                      </span>
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LIST CROP MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gray-200 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    List Cultivated Crop for Sale
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Your crop lot will be instantly broadcasted to active APMC vendors & procurement dealers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitListing} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Crop Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Crop Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="crop"
                      value={formData.crop}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice (Paddy)</option>
                      <option value="Yellow Corn">Yellow Corn (Maize)</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Chilli">Red Chilli</option>
                      <option value="Cotton">Raw Cotton (Kapas)</option>
                      <option value="Mustard Seeds">Mustard Seeds</option>
                      <option value="Tomato">Fresh Tomato</option>
                      <option value="Potato">Potato</option>
                      <option value="Onion">Onion</option>
                    </select>
                  </div>

                  {/* Variety */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Variety / Strain <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      placeholder="e.g. Sharbati, Sona Masoori, Pusa 1121"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Quantity & Unit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Available Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="flex-1 rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="Quintals">Quintals</option>
                        <option value="Kg">Kg</option>
                        <option value="Tonnes">Tonnes</option>
                      </select>
                    </div>
                  </div>

                  {/* Asking Price */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Asking Price (₹ / Quintal) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="askingPrice"
                      min="1"
                      value={formData.askingPrice}
                      onChange={handleInputChange}
                      placeholder="e.g. 2450"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* Harvest Status */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Harvest Readiness <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="harvestStatus"
                      value={formData.harvestStatus}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Harvested • Ready for Pickup">Harvested • Ready for Pickup</option>
                      <option value="Harvesting in 3-5 Days">Harvesting in 3-5 Days</option>
                      <option value="Harvesting within 10 Days">Harvesting within 10 Days</option>
                      <option value="Stored in Dry Warehouse">Stored in Dry Warehouse</option>
                    </select>
                  </div>

                  {/* Quality Grade */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Quality Grade
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="FAQ">FAQ (Fair Average Quality)</option>
                      <option value="Organic Certified">Organic Certified</option>
                      <option value="Export Quality">Export Quality</option>
                    </select>
                  </div>

                  {/* State & District */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Punjab, Haryana, Rajasthan"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="e.g. Bathinda, Karnal, Kota"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Farm Gate Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Farm Gate Address / Village Landmark
                  </label>
                  <input
                    type="text"
                    name="farmAddress"
                    value={formData.farmAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Primary School, Village Bhucho Mandi"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Contact Phone & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Cultivator / Farmer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmerName"
                      value={formData.farmerName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="farmerPhone"
                      value={formData.farmerPhone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Produce Highlights & Storage Notes
                  </label>
                  <textarea
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Mention moisture level, bag type, or pesticide-free certification..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Valuation preview box */}
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-800 font-bold uppercase">Estimated Lot Valuation</span>
                    <p className="text-xs text-emerald-600">Based on {formData.quantity} {formData.unit} @ ₹{Number(formData.askingPrice).toLocaleString()} / Q</p>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-800">
                    ₹{(Number(formData.quantity) * Number(formData.askingPrice)).toLocaleString()}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Publishing Listing..." : "Publish Crop Lot"}
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
