import React, { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const News = () => {
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState("News");
  const [activeFilters, setActiveFilters] = useState({ Crop: false, Source: false });
  const [tabContent, setTabContent] = useState({});
  const [loading, setLoading] = useState(true);

  const tabs = ["News", "MSP Updates", "Policies", "Schemes"];
  const filters = ["Crop", "Source"];

  useEffect(() => {
    const fetchTabContent = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/farmer/news/news`);
        const data = await res.json();
        setTabContent(data);
      } catch (error) {
        console.error("Error fetching tab content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTabContent();
  }, []);

  // Filter toggle
  const toggleFilter = (filter) => {
    setActiveFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Tabs */}
        <div className="px-4 md:px-10 py-5">
          <h1 className="text-2xl md:text-[32px] font-bold text-[#121b0e] mb-4">
            Agricultural News & Updates
          </h1>

          <div className="flex gap-4 border-b border-[#d7e7d0] pb-2 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-bold text-sm tracking-[0.015em] transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "text-[#121b0e] border-b-4 border-[#4ab714]"
                    : "text-[#67974e] border-b-4 border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`flex items-center gap-2 px-4 h-8 rounded-full text-sm font-medium ${
                  activeFilters[filter]
                    ? "bg-green-700 text-white"
                    : "bg-[#ebf3e7] text-[#121b0e]"
                }`}
              >
                {filter}
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                   <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8..." />
                </svg>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {loading ? (
              <p className="text-[#67974e]">Loading...</p>
            ) : tabContent[activeTab]?.length > 0 ? (
              tabContent[activeTab].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#ebf3e7]"
                >
                  <div
                    className="bg-center bg-cover rounded-lg w-full sm:w-[120px] h-[160px] sm:h-[80px] shrink-0"
                    style={{ 
                      backgroundImage: `url('${item.img?.startsWith('http') ? item.img : `${baseUrl}${item.img}`}')` 
                    }}
                  ></div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base md:text-lg font-bold text-[#121b0e] mb-1">{item.title}</p>
                    <p className="text-sm text-[#67974e] leading-relaxed line-clamp-3 md:line-clamp-none">{item.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#67974e]">No content available for {activeTab}.</p>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-center md:justify-end py-6">
            <button className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors cursor-pointer">
              Get Push Notifications
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default News;
