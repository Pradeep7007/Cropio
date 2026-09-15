import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function DealerDashboard() {
  const dealerApi =
    import.meta.env.VITE_DEALER_API_URL || "http://localhost:5000/api/dealer";

  const [liveFarmers, setLiveFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);

  const userName = (() => {
    try {
      const obj = JSON.parse(localStorage.getItem("userObj"));
      return obj?.name || "Dealer";
    } catch {
      return "Dealer";
    }
  })();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch(`${dealerApi}/farmers`);
        if (res.ok) {
          const data = await res.json();
          if (data.farmers && Array.isArray(data.farmers)) {
            setLiveFarmers(data.farmers.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn("Could not fetch farmers on dashboard:", err);
      } finally {
        setLoadingFarmers(false);
      }
    };
    fetchFarmers();
  }, [dealerApi]);

  const [demandData, setDemandData] = useState([]);
  const [oversupplyData, setOversupplyData] = useState([]);

  useEffect(() => {
    const fetchDemandSupply = async () => {
      try {
        const res = await fetch(`${dealerApi}/demand-supply`);
        if (res.ok) {
          const data = await res.json();
          if (data.highDemand) setDemandData(data.highDemand);
          if (data.oversupply) setOversupplyData(data.oversupply);
        }
      } catch (err) {
        console.warn("Could not fetch demand/supply on dashboard:", err);
      }
    };
    fetchDemandSupply();
  }, [dealerApi]);

  return (
    <div
      className="min-h-screen bg-[#f8faf7] text-gray-900 pb-16"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Top Hero Banner */}
        <section className="bg-gradient-to-r from-[#14532d] to-[#166534] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold text-green-100 mb-3">
              📊 Dealer Trading Terminal
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-green-100 text-sm sm:text-base mt-2 leading-relaxed">
              Real-time Mandi procurement intelligence, commodity supply balancing, wholesale inventory, and freight transit tracking.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/price-forecast"
                className="px-5 py-2.5 bg-white text-green-950 hover:bg-green-50 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                AI Price Forecast 📈
              </Link>
              <Link
                to="/inventory-management"
                className="px-5 py-2.5 bg-green-900/60 hover:bg-green-900/80 border border-green-300/30 text-white font-bold text-xs sm:text-sm rounded-xl transition"
              >
                Warehouse Inventory 📦
              </Link>
              <Link
                to="/farmer-connect"
                className="px-5 py-2.5 bg-green-900/60 hover:bg-green-900/80 border border-green-300/30 text-white font-bold text-xs sm:text-sm rounded-xl transition"
              >
                Connect with Farmers 🌾
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        </section>

        {/* Live Dealer KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Active Trade Turnover
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              ₹38.4 Lakh
            </p>
            <span className="inline-block text-[11px] text-green-700 font-bold mt-2">
              +12.8% vs last month
            </span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Inventory in Stock
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-800 mt-1">
              840 Quintals
            </p>
            <Link
              to="/inventory-management"
              className="inline-block text-[11px] text-green-800 font-bold hover:underline mt-2"
            >
              8 Commodity Batches →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              In-Transit Dispatches
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-1">
              4 Active
            </p>
            <Link
              to="/logistics-integration"
              className="inline-block text-[11px] text-blue-700 font-bold hover:underline mt-2"
            >
              Track Freight Status →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Partner Farmers
            </span>
            <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              128 Growers
            </p>
            <Link
              to="/farmer-connect"
              className="inline-block text-[11px] text-green-800 font-bold hover:underline mt-2"
            >
              Direct Procurement →
            </Link>
          </div>
        </section>

        {/* Demand vs Oversupply Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Regional Commodity Demand & Supply Heatmap
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Comparative analysis based on 30-day APMC arrival volumes and wholesale buyer requisitions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* High Demand Card */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    <h3 className="text-lg font-bold text-gray-900">
                      High Market Demand (Procurement Deficit)
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-green-50 text-green-800 rounded-full border border-green-200">
                    High Margin
                  </span>
                </div>

                <div className="space-y-4 mt-5">
                  {demandData.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{item.tons}</span>
                          <span className="text-green-700 font-bold">{item.trend}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-green-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Recommended Action:</span>
                <Link
                  to="/smart-purchase"
                  className="font-bold text-green-700 hover:underline"
                >
                  Run Smart Purchase Plan →
                </Link>
              </div>
            </div>

            {/* Oversupply Card */}
            <div className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📉</span>
                    <h3 className="text-lg font-bold text-gray-900">
                      Crop Oversupply & Inflow Pressure
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                    Price Dip Risk
                  </span>
                </div>

                <div className="space-y-4 mt-5">
                  {oversupplyData.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-gray-800">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{item.tons}</span>
                          <span className="text-amber-700 font-bold">{item.trend}</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Recommended Action:</span>
                <Link
                  to="/price-forecast"
                  className="font-bold text-amber-700 hover:underline"
                >
                  Check Price Trajectory →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Live Farmer Harvest Lots Ready for Procurement */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-1 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Direct Farm Gate Supply
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Fresh Farmer Crop Lots Available for Procurement
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Directly browse verified cultivator harvest lots with farm-gate asking prices.
              </p>
            </div>

            <Link
              to="/farmer-connect"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 shrink-0 hover:underline"
            >
              Open Farmer Connect Hub ({liveFarmers.length > 0 ? "Browse Lots" : "View All"}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loadingFarmers ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-48 flex flex-col justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-100 rounded-xl"></div>
                </div>
              ))
            ) : liveFarmers.length > 0 ? (
              liveFarmers.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl border border-[#e2e8e0] p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-black rounded-lg border border-emerald-100">
                        {f.crop}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        ★ {f.rating || "4.8"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {f.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        📍 {f.location || `${f.district}, ${f.state}`}
                      </p>
                    </div>

                    <div className="mt-3 bg-gray-50 rounded-xl p-2.5 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Available:</span>
                        <span className="font-extrabold text-gray-900">{f.quantity} {f.unit || "Quintals"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Asking Rate:</span>
                        <span className="font-extrabold text-emerald-800">₹{f.askingPrice} / Q</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {f.harvestStatus || "Ready for Pickup"}
                    </span>
                    <Link
                      to="/farmer-connect"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      ⚡ Bid / Buy Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
                <p className="text-sm font-semibold">No crop lots currently listed.</p>
                <Link to="/farmer-connect" className="text-xs text-emerald-700 font-bold hover:underline mt-1 inline-block">
                  Visit Farmer Connect →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Quick Operations Navigation */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dealer Operations Suite
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Customer Sales Ledger",
                desc: "Record grain dispatches, client orders, and customer payment totals.",
                icon: "👥",
                path: "/customers",
                tag: "Sales Management",
              },
              {
                title: "Warehouse Inventory Manager",
                desc: "Track batch storage, low stock alerts, and quick stock quantity adjustments.",
                icon: "📦",
                path: "/inventory-management",
                tag: "Stock Control",
              },
              {
                title: "Logistics & Freight Transit",
                desc: "Manage truck dispatches, route statuses, and expected arrival times.",
                icon: "🚚",
                path: "/logistics-integration",
                tag: "Fleet Tracking",
              },
              {
                title: "AI Price Forecasting",
                desc: "Regression models projecting 7 to 60-day wholesale Mandi price trends.",
                icon: "📈",
                path: "/price-forecast",
                tag: "Market AI",
              },
              {
                title: "Smart Purchase Strategy",
                desc: "Algorithmic procurement calculator balancing buying rates and ROI margins.",
                icon: "💡",
                path: "/smart-purchase",
                tag: "Procurement ROI",
              },
              {
                title: "Farmer Direct Connect",
                desc: "Browse verified crop batches and send instant direct purchase bids.",
                icon: "🌾",
                path: "/farmer-connect",
                tag: "Direct Farm Gate",
              },
            ].map((op, i) => (
              <Link
                key={i}
                to={op.path}
                className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{op.icon}</span>
                    <span className="text-[11px] font-bold text-green-900 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                      {op.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mt-3 group-hover:text-green-800 transition-colors">
                    {op.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {op.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-800 mt-4 flex items-center gap-1">
                  Open Module →
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
