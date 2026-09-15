module.exports = function Subsidies(req, res) {
  const agriculturalSubsidies = [
    {
      id: "sub-1",
      title: "PM-KUSUM (Solar Agricultural Pumps Scheme)",
      description: "60% government subsidy to replace diesel pumps with standalone solar agricultural pumps.",
      extraInfo: "30% Central Govt subsidy + 30% State Govt subsidy + 30% bank loan option. Farmer contributes only 10% upfront. Reduces farm electricity/diesel cost to zero.",
      category: "Solar Energy & Irrigation",
      eligibility: "Individual farmers, water user associations, and farmer groups without existing grid connection.",
      benefit: "Up to 60% capital grant on 3HP to 7.5HP solar pumps",
      portalUrl: "https://pmkusum.mnre.gov.in",
      buttons: ["Apply on PM-KUSUM", "Check Subsidy Matrix"]
    },
    {
      id: "sub-2",
      title: "Per Drop More Crop (Micro-Irrigation / PMKSY)",
      description: "Capital assistance for installing Drip Irrigation and Sprinkler systems on farm lands.",
      extraInfo: "55% subsidy for small and marginal farmers, 45% for other farmers. Increases water use efficiency by up to 50% and improves yield by 30-40%.",
      category: "Water Conservation",
      eligibility: "All farmers owning cultivable land suitable for micro-irrigation.",
      benefit: "45% to 55% subsidy on approved drip and sprinkler kits",
      portalUrl: "https://pmksy.gov.in",
      buttons: ["Estimate Drip Cost", "Apply Scheme"]
    },
    {
      id: "sub-3",
      title: "Sub-Mission on Agricultural Mechanization (SMAM)",
      description: "Financial assistance of 40% to 50% on purchase of agricultural machinery and implements.",
      extraInfo: "Subsidies available on rotavators, power weeders, seed drills, multi-crop threshers, and custom hiring centers.",
      category: "Farm Machinery",
      eligibility: "Farmers with Aadhaar card, land record (7/12 or RoR), and active bank account.",
      benefit: "40% to 50% subsidy credited directly via DBT",
      portalUrl: "https://agrimachinery.nic.in",
      buttons: ["Select Machinery", "Register on DBT Portal"]
    }
  ];

  res.status(200).json(agriculturalSubsidies);
};