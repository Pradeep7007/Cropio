module.exports = function CropInsurances(req, res) {
  const cropInsurances = [
    {
      id: "ins-1",
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Comprehensive risk insurance covering yield losses due to non-preventable natural risks.",
      extraInfo: "Premium: Only 2% for Kharif crops, 1.5% for Rabi, 5% for commercial/horticultural crops. Covers prevented sowing, mid-season adversity, and post-harvest losses up to 14 days.",
      category: "Central Government",
      eligibility: "All farmers growing notified crops in notified areas (both loanee and non-loanee).",
      coverage: "Sum Insured up to 100% of scale of finance.",
      portalUrl: "https://pmfby.gov.in",
      buttons: ["Apply on PMFBY", "Check Eligibility"]
    },
    {
      id: "ins-2",
      title: "Restructured Weather Based Crop Insurance Scheme (RWBCIS)",
      description: "Weather-indexed indemnity based on adverse weather parameters (rainfall, temperature, frost, relative humidity).",
      extraInfo: "Fast settlement based on automated weather stations without needing crop cutting experiments. Ideal for horticulture and cash crops.",
      category: "Weather Index Insurance",
      eligibility: "Farmers cultivating notified fruits, vegetables, and commercial crops.",
      coverage: "Adverse rainfall, heatwaves, low temperatures, and prolonged dry spells.",
      portalUrl: "https://agricoop.nic.in",
      buttons: ["Calculate Premium", "Learn More"]
    },
    {
      id: "ins-3",
      title: "Unified Package Insurance Scheme (UPIS)",
      description: "One-stop insurance solution covering crop insurance along with personal accident, tractor, and pump-set insurance.",
      extraInfo: "Single policy bundled for rural households offering financial safety across farm assets and personal security.",
      category: "Comprehensive Rural Insurance",
      eligibility: "Any registered farmer holding Kisan Credit Card (KCC) or land title.",
      coverage: "Crop + Life + Disability + Farm machinery and pump-set damage.",
      portalUrl: "https://pmfby.gov.in",
      buttons: ["Download Brochure", "Apply Now"]
    }
  ];

  res.status(200).json(cropInsurances);
};
