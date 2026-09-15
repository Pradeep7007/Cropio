const allRecommendedCrops = [
  {
    id: "REC-1",
    title: "Sharbati Wheat (HD-2967)",
    crop: "Wheat",
    text: "High tillering index and rust resistance for fertile loamy soil.",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=70",
    tag: "Rabi Season",
    yield: "50-55 Q/ha",
    soilCompatibility: ["loamy", "alluvial", "clay"],
    waterRequirement: "moderate",
    marketDemand: "high",
  },
  {
    id: "REC-2",
    title: "Hybrid Yellow Corn (NK-6240)",
    crop: "Corn",
    text: "Drought tolerant hybrid offering 15% higher ear fill consistency.",
    img: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=70",
    tag: "Kharif Season",
    yield: "80-90 Q/ha",
    soilCompatibility: ["loamy", "sandy", "black"],
    waterRequirement: "moderate",
    marketDemand: "high",
  },
  {
    id: "REC-3",
    title: "High-Oil Soybean (JS-335)",
    crop: "Soybean",
    text: "Enriches soil nitrogen reserves naturally through active root nodulation.",
    img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=70",
    tag: "Soil Restorer",
    yield: "25-30 Q/ha",
    soilCompatibility: ["black", "clay", "loamy"],
    waterRequirement: "moderate",
    marketDemand: "high",
  },
  {
    id: "REC-4",
    title: "Basmati Rice (Pusa 1121)",
    crop: "Rice",
    text: "High market value aromatic grain with excellent grain elongation upon cooking.",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70",
    tag: "Kharif Premium",
    yield: "45-50 Q/ha",
    soilCompatibility: ["clay", "alluvial"],
    waterRequirement: "high",
    marketDemand: "high",
  },
];

module.exports = function RecommendedCrop(req, res) {
  // If GET request, return active seasonal recommended crops for the dashboard
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      crops: allRecommendedCrops,
      count: allRecommendedCrops.length,
      timestamp: new Date().toISOString(),
    });
  }

  // POST request: dynamic recommendation based on farm profile
  try {
    const {
      location = "General",
      soilType = "loamy",
      previousCrops = "wheat",
      waterAvailability = "moderate",
      marketDemandPreferences = "high_demand",
    } = req.body || {};

    let suitable = allRecommendedCrops.filter((crop) => {
      const matchSoil = crop.soilCompatibility.includes(soilType.toLowerCase());
      return matchSoil;
    });

    if (suitable.length === 0) {
      suitable = allRecommendedCrops.slice(0, 3);
    }

    res.status(200).json({
      success: true,
      data: {
        recommendations: suitable,
        farmProfile: {
          location,
          soilType,
          waterAvailability,
          previousCrops,
        },
      },
      message: "Crop recommendations generated dynamically",
    });
  } catch (error) {
    console.error("Error in RecommendedCrop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};