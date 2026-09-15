import React, { useState, useEffect, useMemo } from "react";

export default function LogisticsIntegration() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  const [newShipment, setNewShipment] = useState({
    crop: "Wheat",
    origin: "",
    destination: "",
    quantity: "200 Quintals",
    transporter: "National Agri Fleet",
    vehicleNumber: "",
    eta: "Within 24 Hours",
  });

  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  useEffect(() => {
    async function fetchLogistics() {
      try {
        const res = await fetch(`${dealerApi}/logistics`);
        if (res.ok) {
          const data = await res.json();
          if (data.shipments && data.shipments.length > 0) {
            setShipments(data.shipments);
          }
        }
      } catch (err) {
        console.warn("Using local logistics store:", err.message);
      }
    }
    fetchLogistics();
  }, [dealerApi]);

  const handleStatusChange = async (id, newStatus) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setToast(`Shipment ${id} status updated to ${newStatus}`);
    setTimeout(() => setToast(""), 2500);

    try {
      await fetch(`${dealerApi}/logistics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    if (!newShipment.origin || !newShipment.destination) return;

    const item = {
      id: `SHP-2026-${(shipments.length + 1).toString().padStart(2, "0")}`,
      crop: newShipment.crop,
      origin: newShipment.origin.trim(),
      destination: newShipment.destination.trim(),
      quantity: newShipment.quantity.trim(),
      transporter: newShipment.transporter.trim(),
      vehicleNumber: newShipment.vehicleNumber.trim() || "MH-12-AG-5511",
      eta: newShipment.eta.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "In Transit",
    };

    setShipments((prev) => [item, ...prev]);
    setShowModal(false);
    setNewShipment({
      crop: "Wheat",
      origin: "",
      destination: "",
      quantity: "200 Quintals",
      transporter: "National Agri Fleet",
      vehicleNumber: "",
      eta: "Within 24 Hours",
    });

    setToast(`Dispatched new shipment ${item.id}!`);
    setTimeout(() => setToast(""), 3000);

    try {
      await fetch(`${dealerApi}/logistics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    } catch {}
  };

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const matchFilter = filter === "All" || s.status === filter;
      const matchSearch =
        !search.trim() ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.crop.toLowerCase().includes(search.toLowerCase()) ||
        s.origin.toLowerCase().includes(search.toLowerCase()) ||
        s.destination.toLowerCase().includes(search.toLowerCase()) ||
        s.transporter.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [shipments, filter, search]);

  const stats = useMemo(() => {
    const inTransit = shipments.filter((s) => s.status === "In Transit").length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;
    const delayed = shipments.filter((s) => s.status === "Delayed").length;
    return { inTransit, delivered, delayed, total: shipments.length };
  }, [shipments]);

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
              Logistics & Farm Freight Integration
            </h1>
            <p className="text-sm text-[#6d8560] mt-1">
              Real-time grain vehicle dispatches, transit route status, and mandi freight coordination.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold transition shadow-sm cursor-pointer"
          >
            <span>+</span>
            <span>Schedule New Dispatch</span>
          </button>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
              Total Dispatches
            </span>
            <p className="text-2xl font-extrabold text-[#131811] mt-1">
              {stats.total} Shipments
            </p>
            <span className="text-xs text-gray-500 font-medium">All logged freights</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">
              In Transit
            </span>
            <p className="text-2xl font-extrabold text-blue-700 mt-1">
              {stats.inTransit} On The Road
            </p>
            <span className="text-xs text-blue-600 font-medium">Live moving freights</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-green-700 tracking-wider">
              Completed Deliveries
            </span>
            <p className="text-2xl font-extrabold text-green-700 mt-1">
              {stats.delivered} Received
            </p>
            <span className="text-xs text-green-700 font-medium">Delivered to mandis</span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-sm">
            <span className="text-xs uppercase font-bold text-red-500 tracking-wider">
              Transit Delays
            </span>
            <p className="text-2xl font-extrabold text-red-600 mt-1">
              {stats.delayed} Delayed
            </p>
            <span className="text-xs text-red-600 font-medium">Requires driver followup</span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shipment ID, crop, transporter, or mandi destination..."
              className="w-full bg-white border border-[#d7e7d0] rounded-xl px-4 py-2.5 pl-10 text-sm text-[#131811] placeholder-gray-400 focus:outline-none focus:border-green-600"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <div className="flex gap-2">
            {["All", "In Transit", "Delivered", "Delayed"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer ${
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

        {/* Shipments Table */}
        <div className="mt-6 bg-white border border-[#e2e8e0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fafbf9] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Shipment ID</th>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Route (Origin → Destination)</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Transporter & Vehicle</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {s.id}
                        <span className="block text-[11px] font-normal text-gray-400">
                          {s.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {s.crop}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        <span className="font-medium text-gray-900">{s.origin}</span>
                        <span className="text-gray-400 mx-1.5">→</span>
                        <span className="font-semibold text-green-800">{s.destination}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {s.quantity}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        <span className="font-medium text-gray-900 block">{s.transporter}</span>
                        <span className="text-gray-400 font-mono text-[11px]">{s.vehicleNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            s.status === "Delivered"
                              ? "bg-green-50 border-green-300 text-green-800"
                              : s.status === "In Transit"
                              ? "bg-blue-50 border-blue-300 text-blue-800"
                              : "bg-red-50 border-red-300 text-red-800"
                          }`}
                        >
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                        {s.eta}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      No shipments matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Dispatch Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-900">
                  Register Freight Dispatch
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateShipment} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Crop Type
                    </label>
                    <select
                      value={newShipment.crop}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, crop: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice (Basmati)">Rice (Basmati)</option>
                      <option value="Corn">Corn</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Soybean">Soybean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Quantity (Quintals)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 300 Quintals"
                      value={newShipment.quantity}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, quantity: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Origin Mandi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Khanna Mandi"
                      value={newShipment.origin}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, origin: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Destination Mandi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Azadpur APMC"
                      value={newShipment.destination}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, destination: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Transporter Agency
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grewal Logistics"
                      value={newShipment.transporter}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, transporter: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Truck / Vehicle No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PB-10-CZ-4521"
                      value={newShipment.vehicleNumber}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, vehicleNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expected Arrival Time (ETA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow, 10:00 AM"
                    value={newShipment.eta}
                    onChange={(e) =>
                      setNewShipment({ ...newShipment, eta: e.target.value })
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
                    Dispatch Shipment
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
