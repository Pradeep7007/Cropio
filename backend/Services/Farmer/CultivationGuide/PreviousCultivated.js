module.exports = function PreviousCultivated(req, res) {
  try {
    const { farmerId = "FMR-101", year = "2025", season } = req.query;

    const cultivationHistory = [
      {
        id: 1,
        crop: "Basmati Rice",
        variety: "Pusa 1121",
        area: "3.2 hectares",
        plantingDate: "2025-06-20",
        harvestDate: "2025-11-15",
        yield: "48 quintals/ha",
        totalYield: "153.6 quintals",
        profit: "₹1,42,000",
        challenges: ["Stem borer attack managed via pheromone traps"],
        lessons: ["Laser land leveling saved 25% irrigation water"]
      },
      {
        id: 2,
        crop: "Sharbati Wheat",
        variety: "HD-2967",
        area: "3.2 hectares",
        plantingDate: "2024-11-10",
        harvestDate: "2025-04-05",
        yield: "52 quintals/ha",
        totalYield: "166.4 quintals",
        profit: "₹1,18,000",
        challenges: ["Sudden temperature spike in February during grain filling"],
        lessons: ["Early sowing shielded the crop from terminal heat"]
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        farmerId,
        year,
        season: season || "All Seasons",
        cultivationHistory
      },
      message: "Previous cultivation data retrieved successfully"
    });
  } catch (error) {
    console.error("Error in PreviousCultivated:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cultivation history",
      error: error.message
    });
  }
};