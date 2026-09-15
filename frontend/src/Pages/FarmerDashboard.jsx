import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { corn, wheat, soyabean, disease } from "../assets/images/Images";

const FarmerDashboard = () => {
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const userName = (() => {
    try {
      const obj = JSON.parse(localStorage.getItem("userObj"));
      return obj?.name || "Farmer";
    } catch {
      return "Farmer";
    }
  })();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const baseUrl = import.meta.env.VITE_FARMER_API_URL || "http://localhost:5000/api/farmer";
        const res = await fetch(`${baseUrl}/croprecommendation/recommendedcrops`);
        if (res.ok) {
          const data = await res.json();
          if (data.crops && Array.isArray(data.crops)) {
            setRecommendedCrops(data.crops.slice(0, 3));
          }
        }
      } catch (err) {
        console.warn("Could not fetch recommended crops:", err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, []);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8faf7] text-gray-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Top Hero / Welcome Banner */}
        <section className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold text-green-100 mb-3">
              🌱 {todayDate}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-green-100 text-sm sm:text-base mt-2 leading-relaxed">
              Your personalized agronomic dashboard. Monitor real-time soil fertility, verify crop disease symptoms with AI, and track live Mandi wholesale rates.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/croprecommendation"
                className="px-5 py-2.5 bg-white text-green-950 hover:bg-green-50 font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
              >
                Get Crop Recommendation
              </Link>
              <Link
                to="/dieseasedetection"
                className="px-5 py-2.5 bg-green-900/60 hover:bg-green-900/80 border border-green-300/30 text-white font-bold text-xs sm:text-sm rounded-xl transition"
              >
                Scan Plant Disease 📷
              </Link>
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        </section>

        {/* Quick KPI Stats Row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Today's Weather
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">☀️</span>
              <div>
                <p className="text-xl font-extrabold text-gray-900">28°C</p>
                <p className="text-xs text-gray-500">Sunny • Humidity 64%</p>
              </div>
            </div>
            <span className="inline-block text-[11px] text-green-700 font-semibold mt-3">
              Optimal for field work
            </span>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Soil Health Status
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">🧪</span>
              <div>
                <p className="text-xl font-extrabold text-green-700">85 / 100</p>
                <p className="text-xs text-gray-500">Loam • pH 7.2</p>
              </div>
            </div>
            <Link
              to="/sustainable"
              className="inline-block text-[11px] text-green-800 font-bold hover:underline mt-3"
            >
              View Soil Analytics →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Active Crops
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">🌾</span>
              <div>
                <p className="text-xl font-extrabold text-gray-900">Wheat & Rice</p>
                <p className="text-xs text-gray-500">Vegetative Stage</p>
              </div>
            </div>
            <Link
              to="/cultivationguide"
              className="inline-block text-[11px] text-green-800 font-bold hover:underline mt-3"
            >
              Stage Instructions →
            </Link>
          </div>

          <div className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-sm transition">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Mandi Benchmark
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">💹</span>
              <div>
                <p className="text-xl font-extrabold text-gray-900">₹2,450 / Q</p>
                <p className="text-xs text-green-600 font-bold">+4.2% this week</p>
              </div>
            </div>
            <Link
              to="/services/market"
              className="inline-block text-[11px] text-green-800 font-bold hover:underline mt-3"
            >
              Check Mandi Rates →
            </Link>
          </div>
        </section>

        {/* Crop Recommendations Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Recommended Crops for Your Soil
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                High-yielding, climate-resilient cultivars tailored for current seasonal weather.
              </p>
            </div>
            <Link
              to="/croprecommendation"
              className="text-xs sm:text-sm font-bold text-green-700 hover:text-green-800 hover:underline"
            >
              Run Full Soil Test →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingRecs ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse h-64 flex flex-col justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-28 bg-gray-100 rounded-xl"></div>
                </div>
              ))
            ) : recommendedCrops.length > 0 ? (
              recommendedCrops.map((item, index) => (
                <div
                  key={item.id || index}
                  className="bg-white rounded-2xl border border-[#e2e8e0] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <img
                        src={item.img || wheat}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70";
                        }}
                      />
                      {item.tag && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full text-xs font-bold text-green-800 shadow-xs">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                        {item.text}
                      </p>
                      {item.yield && (
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <span>Potential Yield:</span>
                          <span className="font-bold text-green-700">{item.yield}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <Link
                      to="/croprecommendation"
                      className="block w-full py-2 bg-gray-50 hover:bg-green-50 text-green-800 font-bold text-xs rounded-xl border border-gray-200 text-center transition"
                    >
                      View Recommendation Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
                No active seasonal recommendations available. Run a soil test to generate personalized recommendations.
              </div>
            )}
          </div>
        </section>

        {/* Disease Detection Highlight Card */}
        <section className="bg-white border border-[#e2e8e0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  AI Plant Pathology Scanner
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-3">
                  Early Crop Disease Identification
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Notice unusual leaf spots, yellowing, or blight? Upload a leaf photo or snap a picture via webcam. Our ML model identifies the pathogen and prescribes targeted organic and chemical treatments.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/dieseasedetection"
                  className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-sm"
                >
                  Scan Leaf Now 📷
                </Link>
                <Link
                  to="/cultivationguide"
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm rounded-xl transition"
                >
                  Pest Management Guide
                </Link>
              </div>
            </div>

            <div
              className="md:w-5/12 h-64 md:h-auto min-h-[220px] bg-cover bg-center"
              style={{ backgroundImage: `url(${disease})` }}
            />
          </div>
        </section>

        {/* Interactive Services Grid */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Agricultural Suite & Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Sell Cultivated Harvest",
                desc: "Post your harvested crops directly to 500+ verified APMC wholesale dealers & buyers.",
                icon: "🌾",
                path: "/services/sell-crop",
                tag: "Direct Market",
              },
              {
                title: "Live Mandi Marketplace",
                desc: "Explore daily modal arrival rates across all state APMC markets.",
                icon: "🏪",
                path: "/services/market",
                tag: "Updated Daily",
              },
              {
                title: "Govt Schemes & Subsidies",
                desc: "Check eligibility for PMFBY, KCC credit, and PM-KUSUM solar pumps.",
                icon: "🏛️",
                path: "/services/subsidy",
                tag: "Central & State",
              },
              {
                title: "Farmer Community Feed",
                desc: "Exchange agronomic questions, field tips, and pest solutions.",
                icon: "💬",
                path: "/services/community",
                tag: "Active Growers",
              },
              {
                title: "Cultivation Stages Guide",
                desc: "Step-by-step sowing, fertigation, and harvest schedules.",
                icon: "📖",
                path: "/cultivationguide",
                tag: "Crop Knowledge",
              },
              {
                title: "Yield & Production Estimator",
                desc: "Predict seasonal output based on soil, irrigation, and acreage.",
                icon: "⚖️",
                path: "/services/yield-estimation",
                tag: "Forecasting",
              },
              {
                title: "Agricultural News Feed",
                desc: "Stay updated with minimum support price (MSP) announcements and weather warnings.",
                icon: "📰",
                path: "/services/news",
                tag: "Real-time",
              },
            ].map((service, idx) => (
              <Link
                key={idx}
                to={service.path}
                className="bg-white border border-[#e2e8e0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{service.icon}</span>
                    <span className="text-[11px] font-bold text-green-800 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mt-3 group-hover:text-green-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-700 mt-4 flex items-center gap-1">
                  Access Tool →
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default FarmerDashboard;
