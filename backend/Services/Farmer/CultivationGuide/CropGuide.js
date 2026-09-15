const { getCultivationGuide } = require("./guideDatabase");

module.exports = function CropGuide(req, res) {
  try {
    const { cropType = "rice", stage, location } = req.query;
    const cultivationData = getCultivationGuide(cropType);

    res.status(200).json({
      success: true,
      data: {
        crop: cropType,
        cultivationGuide: cultivationData,
        currentStage: stage || "vegetative_growth",
        location: location || "general"
      },
      message: "Cultivation guide retrieved successfully"
    });
  } catch (error) {
    console.error("Error in CropGuide:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cultivation guide",
      error: error.message
    });
  }
};