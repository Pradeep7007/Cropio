import React, { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_FARMER_API_URL 
  ? import.meta.env.VITE_FARMER_API_URL.replace(/\/api\/farmer\/?$/, '') 
  : (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000");

export default function SustainableTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hello! I am your AI Eco-Agri advisor. Ask me any question about organic farming, water conservation, composting, or bio-fertilizers." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/farmer/sustainableagriculture/sustainablepractices`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTips(data);
          }
        }
      } catch (error) {
        console.error("Error fetching sustainable tips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setQuery("");
    setChatLoading(true);

    setTimeout(() => {
      let reply = "Applying organic compost at 5-10 tonnes/hectare enhances soil cation exchange capacity and moisture retention dramatically.";
      const lower = userText.toLowerCase();
      if (lower.includes("water") || lower.includes("irrigation")) {
        reply = "Consider adopting drip irrigation coupled with tensiometer soil sensors to reduce water consumption by up to 50% while sustaining yields.";
      } else if (lower.includes("pest") || lower.includes("insect")) {
        reply = "Intercropping marigolds with your primary crop attracts parasitic wasps and deters root-knot nematodes naturally.";
      } else if (lower.includes("fertilizer") || lower.includes("soil")) {
        reply = "Green manuring with Sesbania (Dhaincha) or Sunn hemp adds up to 80-100 kg/ha of biological nitrogen when ploughed in before flowering.";
      }

      setChatMessages(prev => [...prev, { role: "assistant", text: reply }]);
      setChatLoading(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen bg-[#f8faf7] text-[#121b0e] py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Ecological Agriculture
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Sustainable Farming Practices
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Proven methods to improve soil fertility, conserve precious water resources, and reduce input costs without sacrificing harvest yield.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Eco-Certified Guidelines
          </div>
        </div>

        {/* Practices Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-emerald-600 rounded-full"></span>
              Featured Regenerative Techniques
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {tips.length} verified practices available
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse h-64 flex flex-col justify-end">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : tips.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              <p className="font-semibold">No practices currently listed.</p>
              <p className="text-xs mt-1">Please check back soon or consult the Eco Advisor below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tips.map((tip, index) => {
                const imgUrl = tip.image?.startsWith("http")
                  ? tip.image
                  : tip.image ? `${baseUrl}${tip.image}` : "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80";

                return (
                  <div
                    key={tip.id || index}
                    className="bg-white rounded-2xl border border-[#e2e8e0] overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col group"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <img
                        src={imgUrl}
                        alt={tip.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      {tip.category && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {tip.category}
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3 flex-1">
                        {tip.description}
                      </p>
                      {tip.benefits && Array.isArray(tip.benefits) && (
                        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-gray-100">
                          {tip.benefits.map((b, bi) => (
                            <span key={bi} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Sustainable Assistant Chat Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Agri-Sustainability Assistant
              </h2>
              <p className="text-xs text-gray-500">
                Ask questions regarding organic certification, green manure, composting, or bio-pesticides.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200"></span>
                  Analyzing eco-solution...
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. How to prepare Jeevamrutha or control stem borer organically?"
              className="flex-1 w-full rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 px-4 py-3 text-sm transition-all shadow-sm outline-none"
            />
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Ask Assistant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}