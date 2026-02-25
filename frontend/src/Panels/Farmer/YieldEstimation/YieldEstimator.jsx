import React, { useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function YieldEstimator() {
  const [formData, setFormData] = useState({
    crop: "wheat",
    landArea: "2",
    soilType: "Sandy",
    waterAvailability: "Low",
    irrigationMethod: "Drip",
    fertilizerUse: "Organic",
    pesticideUse: "Low",
    sowingMonth: "March",
    harvestMonth: "September",
    farmingMethod: "Organic",
  });

  const [yieldData, setYieldData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/farmer/yieldestimation/estimatedyield`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch yield estimation");
      }

      const data = await res.json();
      setYieldData(data);
      console.log("Yield Data:", data);
    } catch (error) {
      console.error("Error fetching yield data:", error);
      setYieldData({ title: "Error", description: "Unable to fetch yield data." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121b0e] focus:outline-0 focus:ring-0 border border-[#d7e7d0] bg-[#f9fcf8] focus:border-[#d7e7d0] h-14 placeholder:text-[#67974e] p-[15px] text-base font-normal leading-normal";

  const options = {
    soilType: ["Sandy", "Loamy", "Clay", "Silt", "Peaty", "Chalky"],
    waterAvailability: ["Low", "Medium", "High"],
    irrigationMethod: ["Drip", "Sprinkler", "Flood", "Manual"],
    fertilizerUse: ["None", "Organic", "Chemical", "Mixed"],
    pesticideUse: ["None", "Low", "Medium", "High"],
    sowingMonth: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    harvestMonth: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    farmingMethod: ["Conventional", "Organic", "Hydroponic", "Permaculture"]
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#121b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Crop Yield Prediction
              </p>
            </div>

            {/* Crop Select */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className={inputClass}
                  aria-label="Select Crop"
                >
                  <option value="">Select Crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="soybean">Soybean</option>
                  <option value="barley">Barley</option>
                  <option value="cotton">Cotton</option>
                </select>
              </label>
            </div>

            {/* Land Area Input */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  placeholder="Land Area (in acres)"
                  className={inputClass}
                  aria-label="Land Area"
                />
              </label>
            </div>

            {/* Other Select Inputs */}
            {[
              "soilType",
              "waterAvailability",
              "irrigationMethod",
              "fertilizerUse",
              "pesticideUse",
              "sowingMonth",
              "harvestMonth",
              "farmingMethod",
            ].map((key) => (
              <div
                key={key}
                className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
              >
                <label className="flex flex-col min-w-40 flex-1">
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={inputClass}
                    aria-label={key}
                  >
                    <option value="">{key.replace(/([A-Z])/g, " $1")}</option>
                    {options[key].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}

            {/* Predict Button */}
            <div className="flex max-w-[480px] px-4 py-3 justify-end">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Predicting..." : "Predict Yield"}
              </button>
            </div>

            {/* Yield Result Section */}
            {yieldData && (
              <div className="p-4 transition-all duration-500 ease-in-out">
                <div
                  className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]"
                  style={{
                    backgroundImage:
                      'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAB1Uu5eS3hT6E8hJk0EK6KL701j2_bDfnfAIWfcBecaHGGb8l7kdJ6Gn92H_C5G-8yJKdKqaNg8huhZK1jLmGKPTZiJD75W6hMB9Ytvk7mJXHRJpEj3D73_7W6kIdDdia3AEQTZCUj7AIZpTvJR8hZ9GJqvOzJR42oSHgmrGFaiXrL-ZzplDJ4cRPPFVbkrtzV6P50QReQOa79XwVHI4RpMr4829USLJ7xB9UXdYpU8c9hnx5O5_X88exC6_kChrLba_I4eoFlsu8")',
                  }}
                >
                  <div className="flex w-full items-end justify-between gap-4 p-4">
                    <div className="flex max-w-[440px] flex-1 flex-col gap-1">
                      <p className="text-white tracking-light text-2xl font-bold leading-tight max-w-[440px]">
                        {yieldData.title || "Predicted Yield"}
                      </p>
                      <p className="text-white text-base font-medium leading-normal">
                        {yieldData.description || "Your estimated yield will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
