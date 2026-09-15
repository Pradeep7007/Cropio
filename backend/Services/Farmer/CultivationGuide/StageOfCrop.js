const { determineCurrentStage } = require("./guideDatabase");

module.exports = function StageOfCrop(req, res) {
  try {
    const { cropType = "rice", currentStage, plantingDate } = req.body;
    const stageInfo = determineCurrentStage(cropType, plantingDate, currentStage);

    res.status(200).json({
      success: true,
      data: stageInfo,
      message: "Crop stage information retrieved successfully"
    });
  } catch (error) {
    console.error("Error in StageOfCrop:", error);
    res.status(500).json({
      success: false,
      message: "Failed to determine crop stage",
      error: error.message
    });
  }
};