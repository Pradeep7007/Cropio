const { searchCropsDatabase } = require("./guideDatabase");

module.exports = function SearchCrops(req, res) {
  try {
    const { query = "", filters = {} } = req.body || {};
    const searchResults = searchCropsDatabase(query, filters);

    res.status(200).json({
      success: true,
      data: {
        query,
        results: searchResults,
        totalResults: searchResults.length
      },
      message: "Search completed successfully"
    });
  } catch (error) {
    console.error("Error in SearchCrops:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
};