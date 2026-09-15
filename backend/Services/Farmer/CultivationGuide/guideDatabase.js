// Comprehensive Cultivation Database & Helper Library

const cultivationGuides = {
  rice: {
    sowingInstructions: {
      title: "Sowing Instructions",
      content: [
        "Prepare seedbed by plowing and leveling the field thoroughly",
        "Soak seeds in water with salt solution for 24 hours before sowing",
        "Maintain 2-3 inches of standing water during seedling phase",
        "Transplant seedlings when they reach 25-30 days of nursery age",
        "Maintain 15cm spacing between rows and 10cm between individual plants"
      ],
      bestTime: "June to July (Kharif Season)",
      seedRate: "20-25 kg per hectare"
    },
    irrigationSchedule: {
      title: "Irrigation Schedule",
      content: [
        "Maintain 2-5cm standing water during vegetative stage",
        "Drain field briefly during flowering for optimal pollination",
        "Resume light irrigation after flowering during grain filling",
        "Stop irrigation completely 10-14 days before harvest"
      ],
      frequency: "Check field water depth daily",
      criticalPeriods: ["Tillering stage", "Panicle initiation", "Flowering stage", "Grain filling"]
    },
    fertilizerChart: {
      title: "Fertilizer Chart",
      content: [
        "Nitrogen: 120 kg/ha (split into basal, tillering, and panicle initiation doses)",
        "Phosphorus: 60 kg/ha (apply full dose at transplanting time)",
        "Potassium: 40 kg/ha (half at transplanting, half at flowering stage)",
        "Zinc Sulfate: 25 kg/ha in case of known zinc deficiency"
      ],
      organicOptions: [
        "Well-decomposed farmyard manure: 10-12 tons per hectare",
        "Vermicompost: 2.5-3 tons per hectare",
        "Azospirillum & PSB bio-fertilizers: 2 kg/ha"
      ]
    },
    pestWeedControl: {
      title: "Pest and Weed Control",
      content: [
        "Use certified disease-free treated seeds",
        "Apply pre-emergence herbicide like Pretilachlor within 3-5 days after transplanting",
        "Install yellow sticky traps and pheromone traps for stem borer detection",
        "Spray Neem oil (5ml/L) or Carbendazim for sheath blight control"
      ],
      commonPests: ["Yellow Stem Borer", "Brown Plant Hopper (BPH)", "Leaf Folder", "Rice Blast"],
      organicControl: ["Neem cake application", "Trichogramma cards", "Pheromone traps"]
    },
    harvestReadiness: {
      title: "Harvest Readiness",
      content: [
        "Harvest when 80-85% of panicles turn bright golden yellow",
        "Ensure grain moisture content settles around 20-22%",
        "Panicles bend gently downward due to healthy grain weight",
        "Harvest during early morning hours to avoid shattering losses"
      ],
      duration: "115-150 days depending on variety",
      signs: ["Golden yellow husk", "Hard grain texture", "Moisture 20%"]
    }
  },
  wheat: {
    sowingInstructions: {
      title: "Sowing Instructions",
      content: [
        "Prepare fine tilth with 2 plowings and planking to preserve moisture",
        "Sow using Zero Till Seed Drill for uniform depth and 20cm row spacing",
        "Seed depth should strictly be 4-5 cm below soil surface",
        "Treat seed with Trichoderma viride or Carboxin before sowing"
      ],
      bestTime: "November 1st to November 25th (Rabi Season)",
      seedRate: "100-125 kg per hectare"
    },
    irrigationSchedule: {
      title: "Irrigation Schedule",
      content: [
        "CRI (Crown Root Initiation): 20-25 days after sowing (Most critical)",
        "Tillering stage: 40-45 days after sowing",
        "Jointing stage: 60-65 days after sowing",
        "Flowering stage: 80-85 days after sowing",
        "Milk and Dough stages: 100-115 days after sowing"
      ],
      frequency: "4-6 timely irrigations depending on winter rains"
    },
    fertilizerChart: {
      title: "Fertilizer Chart",
      content: [
        "Nitrogen: 120-150 kg/ha (1/3 basal, 1/3 at 1st irrigation, 1/3 at 2nd irrigation)",
        "Phosphorus (P2O5): 60 kg/ha basal application",
        "Potash (K2O): 40 kg/ha basal application"
      ],
      organicOptions: ["Compost: 8-10 tons/ha", "Bio-NPK consortia: 1 L/ha"]
    },
    pestWeedControl: {
      title: "Pest and Weed Control",
      content: [
        "Control Phalaris minor (Gulli Danda) using Clodinafop or Sulfosulfuron at 30-35 DAS",
        "Spray Propiconazole at 0.1% if Yellow Rust / Brown Rust spots appear",
        "Avoid waterlogging to prevent root rot diseases"
      ],
      commonPests: ["Aphids", "Termites", "Yellow Rust", "Loose Smut"],
      organicControl: ["Neem seed kernel extract (NSKE 5%)", "Ladybird beetle conservation"]
    },
    harvestReadiness: {
      title: "Harvest Readiness",
      content: [
        "Harvest when straw turns golden dry and grains produce a sharp cracking sound",
        "Moisture level should be below 14% for long-term safe storage"
      ],
      duration: "130-145 days",
      signs: ["Straw turns golden yellow", "Hard grain cracking test", "Dry leaves"]
    }
  },
  corn: {
    sowingInstructions: {
      title: "Sowing Instructions",
      content: [
        "Plow to deep tilth and form ridges and furrows at 60cm spacing",
        "Plant seeds at 20-25cm spacing along ridges at 3-5cm depth",
        "Maintain adequate soil moisture at planting for prompt germination"
      ],
      bestTime: "June-July (Kharif) or Oct-Nov (Rabi)",
      seedRate: "18-20 kg per hectare"
    },
    irrigationSchedule: {
      title: "Irrigation Schedule",
      content: [
        "Knee-high vegetative stage (30-35 days)",
        "Tasseling & Silking stage (50-65 days) - Essential moisture period",
        "Grain filling stage (75-85 days)"
      ],
      frequency: "Irrigate every 8-10 days in dry spells"
    },
    fertilizerChart: {
      title: "Fertilizer Chart",
      content: [
        "Nitrogen: 120-150 kg/ha",
        "Phosphorus: 60 kg/ha",
        "Potassium: 50 kg/ha",
        "Zinc Sulfate: 20 kg/ha"
      ],
      organicOptions: ["Farmyard manure 10 t/ha", "VAM mycorrhiza 5 kg/ha"]
    },
    pestWeedControl: {
      title: "Pest and Weed Control",
      content: [
        "Scout early for Fall Armyworm (FAW)",
        "Apply pheromone traps at 4-5 per acre",
        "Use Emamectin benzoate or Metarhizium anisopliae for FAW management"
      ],
      commonPests: ["Fall Armyworm", "Stem Borer", "Turcicum Leaf Blight"],
      organicControl: ["Bt formulations", "Neem oil 1500 ppm"]
    },
    harvestReadiness: {
      title: "Harvest Readiness",
      content: [
        "Cob husks turn dry and brown, black layer forms at the kernel base",
        "Kernels feel firm and resist thumb depression"
      ],
      duration: "95-115 days",
      signs: ["Brown dry husk", "Black abscission layer on kernels"]
    }
  },
  tomato: {
    sowingInstructions: {
      title: "Sowing Instructions",
      content: [
        "Raise seedlings in pro-trays with coco-peat inside shade-net nursery",
        "Transplant 25-day-old vigorous seedlings in raised beds with silver-black mulch",
        "Spacing: 60cm between rows, 45cm between plants"
      ],
      bestTime: "August-September and February-March",
      seedRate: "150-200 grams per hectare"
    },
    irrigationSchedule: {
      title: "Irrigation Schedule",
      content: [
        "Drip irrigation 1-2 hours daily or every alternate day",
        "Avoid overhead sprinkler irrigation to prevent foliage fungal blights"
      ],
      frequency: "Daily drip scheduling based on evapotranspiration"
    },
    fertilizerChart: {
      title: "Fertilizer Chart",
      content: [
        "NPK fertigation: 150:100:150 kg/ha applied through drip system",
        "Calcium Nitrate spray at fruit set to prevent Blossom End Rot"
      ],
      organicOptions: ["Vermicompost 5 t/ha", "Panchagavya 3% foliar spray"]
    },
    pestWeedControl: {
      title: "Pest and Weed Control",
      content: [
        "Monitor for Fruit Borer (Helicoverpa) and Whitefly vectors",
        "Spray Spinosad or Beauveria bassiana for leaf miner and borers",
        "Apply Mancozeb + Metalaxyl against Late Blight"
      ],
      commonPests: ["Tomato Fruit Borer", "Whitefly", "Early/Late Blight"],
      organicControl: ["Sticky traps", "Marigold border intercropping"]
    },
    harvestReadiness: {
      title: "Harvest Readiness",
      content: [
        "Harvest at breaker/turning stage for long-distance transport",
        "Harvest at firm red stage for immediate local market supply"
      ],
      duration: "70-90 days from transplanting",
      signs: ["Pinkish-red color break", "Glossy firm skin"]
    }
  }
};

const cropsDatabase = [
  {
    id: 1,
    name: "Basmati Rice Pusa 1121",
    type: "rice",
    variety: "Pusa Basmati 1121",
    duration: "140-145 days",
    yield: "45-50 quintals/hectare",
    soilType: ["clay", "loamy"],
    waterRequirement: "high",
    season: "kharif",
    marketPrice: "₹3,800 - ₹4,200/quintal"
  },
  {
    id: 2,
    name: "Sharbati Wheat HD-2967",
    type: "wheat",
    variety: "HD-2967",
    duration: "135-140 days",
    yield: "50-55 quintals/hectare",
    soilType: ["loamy", "sandy"],
    waterRequirement: "moderate",
    season: "rabi",
    marketPrice: "₹2,450 - ₹2,750/quintal"
  },
  {
    id: 3,
    name: "Hybrid Yellow Maize NK-6240",
    type: "corn",
    variety: "NK-6240",
    duration: "95-100 days",
    yield: "80-90 quintals/hectare",
    soilType: ["loamy", "sandy"],
    waterRequirement: "moderate",
    season: "kharif",
    marketPrice: "₹2,100 - ₹2,350/quintal"
  },
  {
    id: 4,
    name: "Hybrid Tomato Arka Rakshak",
    type: "tomato",
    variety: "Arka Rakshak",
    duration: "140-150 days",
    yield: "170-190 quintals/hectare",
    soilType: ["loamy", "red soil"],
    waterRequirement: "moderate",
    season: "rabi",
    marketPrice: "₹1,800 - ₹2,600/quintal"
  },
  {
    id: 5,
    name: "Cotton Bt Hybrid RCH-659",
    type: "cotton",
    variety: "RCH-659",
    duration: "160-170 days",
    yield: "25-30 quintals/hectare",
    soilType: ["black soil", "clay"],
    waterRequirement: "moderate",
    season: "kharif",
    marketPrice: "₹6,800 - ₹7,400/quintal"
  }
];

function getCultivationGuide(cropType) {
  const normalized = (cropType || "rice").toLowerCase().trim();
  return cultivationGuides[normalized] || cultivationGuides.rice;
}

function determineCurrentStage(cropType, plantingDate) {
  const plantDate = new Date(plantingDate || Date.now() - 35 * 24 * 60 * 60 * 1000);
  const currentDate = new Date();
  const daysFromPlanting = Math.max(
    0,
    Math.floor((currentDate - plantDate) / (1000 * 60 * 60 * 24))
  );

  const cropStages = {
    rice: [
      { stage: "seedling", duration: [0, 25], description: "Nursery & seedling establishment" },
      { stage: "tillering", duration: [25, 55], description: "Active tillering and root development" },
      { stage: "vegetative_growth", duration: [55, 85], description: "Panicle initiation & stem elongation" },
      { stage: "flowering", duration: [85, 110], description: "Heading, flowering and pollination" },
      { stage: "grain_filling", duration: [110, 135], description: "Milking and dough grain formation" },
      { stage: "maturity", duration: [135, 160], description: "Golden grain maturity ready for harvest" }
    ],
    wheat: [
      { stage: "germination", duration: [0, 15], description: "Seed germination and crown root emergence" },
      { stage: "tillering", duration: [15, 45], description: "Active tillering stage" },
      { stage: "jointing", duration: [45, 75], description: "Stem elongation and flag leaf emergence" },
      { stage: "flowering", duration: [75, 95], description: "Spike emergence & anthesis" },
      { stage: "grain_filling", duration: [95, 120], description: "Milking and dough development" },
      { stage: "maturity", duration: [120, 145], description: "Straw drying and harvest readiness" }
    ]
  };

  const cropKey = (cropType || "rice").toLowerCase();
  const stages = cropStages[cropKey] || cropStages.rice;

  const currentStageInfo =
    stages.find(
      (s) => daysFromPlanting >= s.duration[0] && daysFromPlanting <= s.duration[1]
    ) || stages[stages.length - 1];

  const currentIndex = stages.findIndex((s) => s.stage === currentStageInfo.stage);
  const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;

  return {
    crop: cropType,
    currentStage: currentStageInfo.stage,
    description: currentStageInfo.description,
    daysFromPlanting,
    nextStage,
    recommendations: [
      "Check soil moisture levels daily at root zone",
      "Inspect underside of leaves for early insect pests",
      "Ensure drainage channels are clear ahead of unseasonal rain"
    ]
  };
}

function searchCropsDatabase(query, filters = {}) {
  let results = [...cropsDatabase];
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.variety.toLowerCase().includes(q)
    );
  }
  if (filters.season) {
    results = results.filter((c) => c.season.toLowerCase() === filters.season.toLowerCase());
  }
  return results;
}

module.exports = {
  cultivationGuides,
  cropsDatabase,
  getCultivationGuide,
  determineCurrentStage,
  searchCropsDatabase
};
