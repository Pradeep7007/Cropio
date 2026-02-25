import React, { useState, useEffect } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function SustainableTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/farmer/sustainableagriculture/sustainablepractices`
        );
        const data = await res.json();
        console.log("Fetched sustainable tips:", data);
        setTips(data); // assuming API returns an array of { title, description, image }
      } catch (error) {
        console.error("Error fetching sustainable tips:", error);
      }
    };

    fetchTips();
  }, []);

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fafbf9] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Sustainable Farming Tips
              </p>
            </div>

            <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Explore Sustainable Practices
            </h3>

            {/* Cards */}
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col"
                      style={{ 
                        backgroundImage: `url(${tip.image?.startsWith('http') ? tip.image : `${baseUrl}${tip.image}`})` 
                      }}
                    ></div>
                    <div>
                      <p className="text-[#131811] text-base font-medium leading-normal">
                        {tip.title}
                      </p>
                      <p className="text-[#6d8560] text-sm font-normal leading-normal">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-[#131811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              AI Assistant
            </h3>

            <div className="flex w-full items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#d9e1d6]">
              <textarea
                placeholder="Ask me anything about sustainable farming..."
                className="flex-1 resize-none overflow-hidden rounded-lg text-[#131811] focus:outline-none focus:ring-0 border border-transparent bg-transparent min-h-[60px] placeholder:text-[#6d8560] p-2 text-base"
                rows={1}
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}