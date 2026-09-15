import React, { useState, useEffect, useMemo } from "react";

const cropOptions = ["All Crops", "Wheat", "Rice (Basmati)", "Corn", "Soybean", "Mustard Seeds", "Tomato"];

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [showModal, setShowModal] = useState(false);
  const [newCust, setNewCust] = useState({
    name: "",
    phone: "",
    crop: "Wheat",
    pricePerKg: 26,
    purchasedKg: 100,
    location: "Local Mandi",
  });
  const [toast, setToast] = useState("");

  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  // Fetch from backend
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch(`${dealerApi}/customers`);
        if (res.ok) {
          const data = await res.json();
          if (data.customers && data.customers.length > 0) {
            setCustomers(data.customers);
          }
        }
      } catch (err) {
        console.warn("Using local customers store:", err.message);
      }
    }
    fetchCustomers();
  }, [dealerApi]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.crop) return;

    const item = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCust.name.trim(),
      phone: newCust.phone?.trim() || "+91 90000 00000",
      crop: newCust.crop,
      pricePerKg: parseFloat(newCust.pricePerKg) || 0,
      purchasedKg: parseFloat(newCust.purchasedKg) || 0,
      location: newCust.location?.trim() || "Regional Market",
      date: new Date().toISOString().split("T")[0],
    };

    setCustomers((prev) => [item, ...prev]);
    setShowModal(false);
    setNewCust({
      name: "",
      phone: "",
      crop: "Wheat",
      pricePerKg: 26,
      purchasedKg: 100,
      location: "Local Mandi",
    });

    setToast(`Recorded purchase for ${item.name}!`);
    setTimeout(() => setToast(""), 3000);

    try {
      await fetch(`${dealerApi}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch {}
  };

  const handleDelete = async (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setToast("Customer record deleted.");
    setTimeout(() => setToast(""), 2500);

    try {
      await fetch(`${dealerApi}/customers/${id}`, { method: "DELETE" });
    } catch {}
  };

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchCrop =
        selectedCrop === "All Crops" ||
        c.crop.toLowerCase().includes(selectedCrop.toLowerCase());
      const matchSearch =
        !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.toLowerCase().includes(search.toLowerCase());
      return matchCrop && matchSearch;
    });
  }, [customers, selectedCrop, search]);

  const metrics = useMemo(() => {
    const totalRev = filtered.reduce((sum, c) => sum + c.pricePerKg * c.purchasedKg, 0);
    const totalKg = filtered.reduce((sum, c) => sum + c.purchasedKg, 0);
    const avgOrder = filtered.length > 0 ? Math.round(totalRev / filtered.length) : 0;
    return { totalRev, totalKg, avgOrder };
  }, [filtered]);

  return (
    <div
      className="min-h-screen bg-[#fafbf9] py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e1e] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-green-500 animate-in fade-in">
          <span className="text-green-400 font-bold">✓</span>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header with Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
              Dealer Customer Ledger
            </h1>
            <p className="text-sm text-[#6d8560] mt-1">
              Active buyer records, grain purchase volumes, and customer trade summaries.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition shadow-sm cursor-pointer"
          >
            <span>+</span>
            <span>Record New Sale / Customer</span>
          </button>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Total Trade Revenue
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              ₹{metrics.totalRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-green-700 font-medium">Across current view</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Total Volume Traded
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              {metrics.totalKg.toLocaleString()} kg
            </p>
            <span className="text-xs text-gray-500 font-medium">
              ≈ {(metrics.totalKg / 100).toFixed(1)} Quintals
            </span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Active Customers
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              {filtered.length}
            </p>
            <span className="text-xs text-gray-500 font-medium">Verified buyers</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Average Order Value
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              ₹{metrics.avgOrder.toLocaleString()}
            </p>
            <span className="text-xs text-green-700 font-medium">Per transaction</span>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, phone, or mandi location..."
              className="w-full bg-white border border-[#d7e7d0] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#131811] placeholder-gray-400 focus:outline-none focus:border-green-600"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-white border border-[#d7e7d0] rounded-xl px-4 py-2.5 text-sm text-[#131811] focus:outline-none focus:border-green-600"
          >
            {cropOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.length > 0 ? (
            filtered.map((customer) => {
              const totalPrice = (customer.pricePerKg * customer.purchasedKg).toFixed(2);
              return (
                <div
                  key={customer.id}
                  className="bg-white rounded-2xl p-6 border border-[#e2e8e0] shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Customer
                        </span>
                        <h3 className="text-lg font-bold text-[#131811] mt-0.5">
                          {customer.name}
                        </h3>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-50 text-green-800 text-xs font-bold rounded-lg border border-green-200">
                        {customer.crop}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Price per kg:</span>
                        <span className="font-semibold text-gray-800">
                          ₹{customer.pricePerKg.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="font-semibold text-gray-800">
                          {customer.purchasedKg} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mandi Location:</span>
                        <span className="font-semibold text-gray-800">
                          {customer.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-semibold text-gray-800">
                          {customer.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Total Order</span>
                      <span className="text-base font-extrabold text-green-700">
                        ₹{parseFloat(totalPrice).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-semibold p-1 cursor-pointer"
                      title="Delete customer record"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              No customer records match your filter. Click "+ Record New Sale" to add one!
            </div>
          )}
        </div>

        {/* Add Customer Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">
                  Record Customer Trade
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newCust.name}
                    onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98..."
                      value={newCust.phone}
                      onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Crop
                    </label>
                    <select
                      value={newCust.crop}
                      onChange={(e) => setNewCust({ ...newCust, crop: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice (Basmati)">Rice (Basmati)</option>
                      <option value="Corn">Corn</option>
                      <option value="Soybean">Soybean</option>
                      <option value="Mustard Seeds">Mustard Seeds</option>
                      <option value="Tomato">Tomato</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Quantity (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newCust.purchasedKg}
                      onChange={(e) =>
                        setNewCust({ ...newCust, purchasedKg: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Price per kg (₹)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={newCust.pricePerKg}
                      onChange={(e) =>
                        setNewCust({ ...newCust, pricePerKg: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mandi / Delivery Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ludhiana APMC Market"
                    value={newCust.location}
                    onChange={(e) => setNewCust({ ...newCust, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-green-900 flex justify-between font-medium">
                  <span>Estimated Total:</span>
                  <span className="font-bold">
                    ₹{(parseFloat(newCust.pricePerKg || 0) * parseFloat(newCust.purchasedKg || 0)).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition shadow-sm cursor-pointer"
                  >
                    Save Order
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
