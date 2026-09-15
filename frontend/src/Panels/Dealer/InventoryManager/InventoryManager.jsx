import React, { useState, useEffect, useMemo } from "react";

export default function InventoryManager() {
  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const [newCrop, setNewCrop] = useState({
    crop: "",
    category: "Cereals",
    stock: 50,
    price: 30,
    warehouse: "Central Warehouse",
    expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  // Fetch backend inventory if available
  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await fetch(`${dealerApi}/inventory`);
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setInventory(data.items);
          }
        }
      } catch (err) {
        console.warn("Using local dynamic inventory:", err.message);
      }
    }
    fetchInventory();
  }, [dealerApi]);

  const handleStockAdjust = async (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = Math.max(0, item.stock + delta);
          return { ...item, stock: updated };
        }
        return item;
      })
    );

    const item = inventory.find((i) => i.id === id);
    const newQty = item ? Math.max(0, item.stock + delta) : 0;
    setToast(`Updated ${item?.crop || "Item"} stock to ${newQty} Q`);
    setTimeout(() => setToast(""), 2000);

    try {
      await fetch(`${dealerApi}/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newQty }),
      });
    } catch {}
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newCrop.crop.trim()) return;

    const item = {
      id: `INV-00${inventory.length + 1}`,
      crop: newCrop.crop.trim(),
      category: newCrop.category,
      stock: parseFloat(newCrop.stock) || 0,
      price: parseFloat(newCrop.price) || 0,
      warehouse: newCrop.warehouse,
      acquisition: new Date().toISOString().split("T")[0],
      expiry: newCrop.expiry,
    };

    setInventory((prev) => [item, ...prev]);
    setShowModal(false);
    setNewCrop({
      crop: "",
      category: "Cereals",
      stock: 50,
      price: 30,
      warehouse: "Central Warehouse",
      expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    setToast(`Added ${item.crop} to warehouse inventory!`);
    setTimeout(() => setToast(""), 3000);

    try {
      await fetch(`${dealerApi}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch {}
  };

  const handleDelete = async (id) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    setToast("Item removed from inventory.");
    setTimeout(() => setToast(""), 2000);

    try {
      await fetch(`${dealerApi}/inventory/${id}`, { method: "DELETE" });
    } catch {}
  };

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchFilter =
        filter === "All" ||
        (filter === "In Stock" && item.stock >= 30) ||
        (filter === "Low Stock" && item.stock > 0 && item.stock < 30) ||
        (filter === "Out of Stock" && item.stock === 0);

      const matchSearch =
        !search.trim() ||
        item.crop.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [inventory, filter, search]);

  const kpis = useMemo(() => {
    const totalValuation = inventory.reduce((sum, i) => sum + i.stock * i.price * 100, 0); // approx quintals to kg
    const lowStock = inventory.filter((i) => i.stock > 0 && i.stock < 30).length;
    const outOfStock = inventory.filter((i) => i.stock === 0).length;
    return { totalValuation, count: inventory.length, lowStock, outOfStock };
  }, [inventory]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#131811]">
              Inventory & Warehouse Management
            </h1>
            <p className="text-sm text-[#6d8560] mt-1">
              Live grain stock monitoring, batch shelf-life alerts, and stock adjustments.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition shadow-sm cursor-pointer"
          >
            <span>+</span>
            <span>Add Stock / Batch</span>
          </button>
        </div>

        {/* Live KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Total Stock Valuation
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              ₹{kpis.totalValuation.toLocaleString()}
            </p>
            <span className="text-xs text-green-700 font-medium">Estimated warehouse worth</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Commodity Types
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              {kpis.count} Crops
            </p>
            <span className="text-xs text-gray-500 font-medium">Across all facilities</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">
              Low Stock Alerts
            </span>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {kpis.lowStock} Batches
            </p>
            <span className="text-xs text-amber-700 font-medium">&lt; 30 Quintals remaining</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-red-500 tracking-wider">
              Out of Stock
            </span>
            <p className="text-2xl font-extrabold text-red-600 mt-1">
              {kpis.outOfStock} Items
            </p>
            <span className="text-xs text-red-600 font-medium">Requires procurement</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by crop, category, or warehouse..."
              className="w-full bg-white border border-[#d7e7d0] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#131811] placeholder-gray-400 focus:outline-none focus:border-green-600"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <div className="flex gap-2">
            {["All", "In Stock", "Low Stock", "Out of Stock"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer ${
                  filter === status
                    ? "bg-green-700 text-white shadow-xs"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table / Grid */}
        <div className="mt-6 bg-white border border-[#e2e8e0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fafbf9] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Crop Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock (Quintals)</th>
                  <th className="px-6 py-4">Base Price/kg</th>
                  <th className="px-6 py-4">Warehouse</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4">Quick Adjust</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {item.crop}
                        <span className="block text-[11px] font-normal text-gray-400">
                          {item.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-base">
                        <span
                          className={
                            item.stock === 0
                              ? "text-red-600"
                              : item.stock < 30
                              ? "text-amber-600"
                              : "text-green-800"
                          }
                        >
                          {item.stock} Q
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-xs">
                        {item.warehouse}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {item.expiry}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item.id, -10)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm cursor-pointer"
                            title="Decrease 10 Q"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item.id, 10)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-800 font-bold text-sm cursor-pointer"
                            title="Increase 10 Q"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                      No stock items found. Click "+ Add Stock / Batch" to insert one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Item Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">
                  Register New Stock Batch
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Commodity / Crop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basmati Paddy 1121"
                    value={newCrop.crop}
                    onChange={(e) => setNewCrop({ ...newCrop, crop: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newCrop.category}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, category: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="Cereals">Cereals</option>
                      <option value="Grains">Grains</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Oilseeds">Oilseeds</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Spices">Spices</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Stock Quantity (Q)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newCrop.stock}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, stock: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Base Price/kg (₹)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={newCrop.price}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, price: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Storage Facility
                    </label>
                    <input
                      type="text"
                      value={newCrop.warehouse}
                      onChange={(e) =>
                        setNewCrop({ ...newCrop, warehouse: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiry / Re-test Date
                  </label>
                  <input
                    type="date"
                    value={newCrop.expiry}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, expiry: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
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
                    Register Batch
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
