const express = require("express");
const router = express.Router();

const CommunityFeed = require("../Services/Farmer/CommunityFeed/CommunityFeed");
const CommunityPost = require("../Services/Farmer/CommunityFeed/CommunityPost");
const CropData = require("../Services/Farmer/CropRecommendation/CropData");
const RecommendedCrops = require("../Services/Farmer/CropRecommendation/RecommendedCrop");
const CropGuide = require("../Services/Farmer/CultivationGuide/CropGuide")
const PreviousCultivated = require("../Services/Farmer/CultivationGuide/PreviousCultivated")
const SearchCrops = require("../Services/Farmer/CultivationGuide/SearchCrops");
const StageOfCrop = require("../Services/Farmer/CultivationGuide/StageOfCrop");
const Achivements = require("../Services/Farmer/Dashboard/Achivements");
const Keymetrics = require("../Services/Farmer/Dashboard/Keymetrics");
const SustainablityScore = require("../Services/Farmer/Dashboard/SustainablityScore");
const WeeklyData = require("../Services/Farmer/Dashboard/WeeklyData");
const WeeklyTips = require("../Services/Farmer/Dashboard/WeeklyTips");
const DetectionResult = require("../Services/Farmer/DieseaseDetection/DetectionResult");
const InputDiesesed = require("../Services/Farmer/DieseaseDetection/InputDieseased");
const PreventiveMeasure = require("../Services/Farmer/DieseaseDetection/PreventiveMeasures");
const TreatmentOptions = require("../Services/Farmer/DieseaseDetection/TreatmentOptions");
const CropInsurances = require("../Services/Farmer/GovernmentSchemes/CropInsurances");
const Loans = require("../Services/Farmer/GovernmentSchemes/Loans");
const Subsidies = require("../Services/Farmer/GovernmentSchemes/Subsidies");
const MarketData = require("../Services/Farmer/MarketPlace/MarketData");
const MarketPost = require("../Services/Farmer/MarketPlace/MarketPost");
const MSPupdates = require("../Services/Farmer/News/MSPupdates");
const News = require("../Services/Farmer/News/News");
const Policies = require("../Services/Farmer/News/Policies");
const Schemes = require("../Services/Farmer/News/Schemes");
const SustainablePractices = require("../Services/Farmer/SustainalbeAgriculture/SustainablePractices");
const CropYieldInput = require("../Services/Farmer/YieldEstimation/CropYieldInput");
const EstimatedYield = require("../Services/Farmer/YieldEstimation/EstimatedYield");
const {WeatherForecast} = require("../Services/Farmer/CultivationGuide/WeatherForecast");
//commmunity
router.get("/community/communityfeed", CommunityFeed);
router.post("/community/communitypost", CommunityPost);

// crop recommendation
router.post("/croprecommendation/cropdata",CropData);
router.get("/croprecommendation/recommendedcrops",RecommendedCrops);

///cultivation guide
router.get("/cultivationguide/cropguide",CropGuide);
router.get("/cultivationguide/previouscultivated",PreviousCultivated);
router.post("/cultivationguide/searchcrops",SearchCrops);
router.post("/cultivationguide/stageofcrop",StageOfCrop);
router.get("/cultivation/weather-forecast", WeatherForecast);

/// dashboard 
router.post("/sustainablity/dashboard/weeklydata",WeeklyData);
router.get("/sustainablity/keymetrics",Keymetrics);
router.get("/sustainablity/sustainability-score",SustainablityScore);
router.get("/sustainablity/achievements",Achivements);
router.get("/sustainablity/weekly-tips",WeeklyTips);

/// diesedsed
router.post("/dieseased/inputdieseased",InputDiesesed);
router.get("/diesease/detectionresult",DetectionResult);
router.get("/diesease/preventivemeasures",PreventiveMeasure);
router.get("/diesease/treatmentoptions",TreatmentOptions);

//Government Schemes
router.get("/governmentschemes/cropinsurances",CropInsurances);
router.get("/governmentschemes/loans",Loans);
router.get("/governmentschemes/subsidies",Subsidies);

// Market Place
router.get("/marketplace/marketdata",MarketData);
router.post("/marketplace/marketpost",MarketPost);

//News
router.get("/news/mspupdates",MSPupdates);
router.get("/news/news",News);
router.get("/news/polices",Policies);
router.get("/news/schemes",Schemes);

//Sustainalbe Agriculture
router.get("/sustainableagriculture/sustainablepractices",SustainablePractices);

//Yield Estimation
router.post("/yieldestimation/cropyieldinput",CropYieldInput);
router.post("/yieldestimation/estimatedyield",EstimatedYield);

// --- Cultivated Crop Selling & Listings Endpoints ---
const cropStore = require("../Services/Shared/cropListingsStore");

// Get all active cultivated crop listings (Marketplace feed)
router.get("/crops/listings", (req, res) => {
  const { crop, state, search, status } = req.query;
  const listings = cropStore.getAllListings({ crop, state, search, status });
  res.json({ success: true, listings, count: listings.length });
});

// Get current farmer's listings and received dealer bids
router.get("/crops/my-listings", (req, res) => {
  const { farmerId, farmerPhone, farmerName } = req.query;
  let myListings = [];
  if (farmerId || farmerPhone || farmerName) {
    myListings = cropStore.getFarmerListings(farmerId || farmerPhone, farmerName);
  }
  // If no user-specific listings match yet, return either the matched ones or the top listings as demo
  res.json({
    success: true,
    listings: myListings,
    allCount: cropStore.getAllListings().length
  });
});

// Post new cultivated crop for sale
router.post("/crops/sell", (req, res) => {
  try {
    const {
      crop,
      variety,
      grade,
      quantity,
      unit,
      askingPrice,
      harvestStatus,
      state,
      district,
      farmAddress,
      notes,
      farmerName,
      farmerPhone,
      farmerId,
      image,
    } = req.body;

    if (!crop || !quantity || !askingPrice) {
      return res.status(400).json({
        success: false,
        message: "Crop name, quantity, and asking price are required.",
      });
    }

    const newListing = cropStore.createListing({
      crop,
      variety,
      grade,
      quantity,
      unit,
      askingPrice,
      harvestStatus,
      state,
      district,
      farmAddress,
      notes,
      farmerName,
      farmerPhone,
      farmerId,
      image,
    });

    res.status(201).json({
      success: true,
      message: `Successfully listed ${quantity} ${unit || "Quintals"} of ${crop} for sale!`,
      listing: newListing,
    });
  } catch (error) {
    console.error("Error creating crop listing:", error);
    res.status(500).json({ success: false, message: "Failed to publish crop listing." });
  }
});

// Update listing status (e.g. "Sold" or "Available")
router.patch("/crops/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required." });
  }
  const updated = cropStore.updateListingStatus(id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Crop listing not found." });
  }
  res.json({ success: true, message: `Listing status updated to ${status}`, listing: updated });
});

// Approve dealer bid rate (Cultivator Authorization)
router.post("/crops/bids/:bidId/approve", (req, res) => {
  const { bidId } = req.params;
  const { remarks } = req.body;
  const result = cropStore.approveBid(bidId, remarks);
  if (!result) {
    return res.status(404).json({ success: false, message: "Dealer bid not found." });
  }

  res.json({
    success: true,
    message: `Bid rate of ₹${result.offer.offerPrice}/Q approved! The dealer is now authorized to buy this crop batch at this rate.`,
    offer: result.offer,
    listing: result.listing,
  });
});

// Reject dealer bid rate
router.post("/crops/bids/:bidId/reject", (req, res) => {
  const { bidId } = req.params;
  const { reason } = req.body;
  const result = cropStore.rejectBid(bidId, reason);
  if (!result) {
    return res.status(404).json({ success: false, message: "Dealer bid not found." });
  }

  res.json({
    success: true,
    message: "Bid rate declined.",
    offer: result.offer,
    listing: result.listing,
  });
});

// Delete crop listing
router.delete("/crops/:id", (req, res) => {
  const { id } = req.params;
  const deleted = cropStore.deleteListing(id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Crop listing not found." });
  }
  res.json({ success: true, message: "Crop listing removed successfully." });
});

// Get completed sell crops history directly from MongoDB Purchase collection
router.get("/crops/sales-history", async (req, res) => {
  try {
    const { farmerName, farmerPhone } = req.query;
    const history = await cropStore.getSalesHistory({ farmerName, farmerPhone });
    res.json({ success: true, history, count: history.length });
  } catch (err) {
    console.error("Error fetching sales history from MongoDB:", err);
    res.status(500).json({ success: false, message: "Failed to fetch sales history from database." });
  }
});

module.exports = router;
