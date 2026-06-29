export const newsData = {
  "News": [
    {
      title: "Monsoon Forecast: Favorable Conditions for Kharif Crops",
      desc: "The meteorological department predicts a normal to above-normal monsoon this year, ensuring adequate rainfall for key Kharif crops like Rice, Maize, and Soybeans across major agricultural belts.",
      date: "May 15, 2026",
      source: "National Weather Bureau",
      category: "Weather",
      img: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "New Pest Advisory: Fall Armyworm Spotted in Corn Belts",
      desc: "Agricultural experts have issued an advisory regarding the early spotting of Fall Armyworm in central corn-growing regions. Farmers are advised to initiate early scouting and prepare organic or chemical interventions.",
      date: "May 12, 2026",
      source: "Agri Advisory Board",
      category: "Advisory",
      img: "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Wheat Market Trends: Global Demand Surges",
      desc: "Global wheat prices have seen a 5% increase due to increased export demand. Domestic farmers holding quality stocks might see better realization in the coming weeks.",
      date: "May 10, 2026",
      source: "Agri Commodity Exchange",
      category: "Market",
      img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
    }
  ],
  "MSP Updates": {
    notification: "The Cabinet Committee on Economic Affairs (CCEA) has approved the increase in the Minimum Support Prices (MSP) for all mandated Kharif crops for Marketing Season 2026-27.",
    effectiveDate: "June 1, 2026",
    table: [
      { crop: "Paddy (Common)", previousMsp: 2183, newMsp: 2350, increase: 167 },
      { crop: "Paddy (Grade A)", previousMsp: 2203, newMsp: 2370, increase: 167 },
      { crop: "Jowar (Hybrid)", previousMsp: 3180, newMsp: 3350, increase: 170 },
      { crop: "Bajra", previousMsp: 2500, newMsp: 2650, increase: 150 },
      { crop: "Maize", previousMsp: 2090, newMsp: 2200, increase: 110 },
      { crop: "Cotton (Medium Staple)", previousMsp: 6620, newMsp: 6900, increase: 280 }
    ]
  },
  "Policies": [
    {
      title: "National Mission on Sustainable Agriculture (NMSA)",
      type: "Central Government",
      summary: "Aimed at promoting sustainable agriculture through climate change adaptation measures, enhancing agriculture productivity especially in rainfed areas focusing on integrated farming, soil health management, and synergizing resource conservation.",
      benefits: "Financial assistance for soil health cards, micro-irrigation systems, and organic farming certification.",
      eligibility: "All registered farmers. Priority given to small and marginal farmers."
    },
    {
      title: "State Solar Pump Yojana",
      type: "State Government",
      summary: "Provision of heavily subsidized solar water pumps to reduce dependence on the grid and diesel generators.",
      benefits: "Up to 75% subsidy on the capital cost of solar pumps (3HP to 7.5HP).",
      eligibility: "Farmers with verified land records and existing water sources (borewell/pond)."
    }
  ],
  "Schemes": [
    {
      title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      description: "An initiative by the government in which all farmers will get up to ₹6,000 per year as minimum income support.",
      eligibility: ["Landholding farmer families with cultivable land.", "Must hold a valid Aadhaar card and bank account."],
      documents: ["Aadhaar Card", "Land ownership records", "Active Bank Account details"],
      benefits: "₹6,000 annually, transferred directly to the bank account in three equal installments of ₹2,000.",
      process: "Apply online via the PM-KISAN portal or visit the nearest Common Service Centre (CSC).",
      deadline: "Rolling applications open year-round. Next installment cutoff is June 30, 2026.",
      link: "https://pmkisan.gov.in/"
    },
    {
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "A comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
      eligibility: ["All farmers growing notified crops in a notified area.", "Includes sharecroppers and tenant farmers."],
      documents: ["Land Possession Certificate", "Bank Passbook", "Aadhaar Card", "Sowing Certificate"],
      benefits: "Insurance cover for yield losses due to non-preventable risks like drought, flood, pests, and diseases.",
      process: "Apply via the PMFBY portal, through banks, or authorized insurance agents.",
      deadline: "Kharif season deadline: July 31, 2026.",
      link: "https://pmfby.gov.in/"
    }
  ]
};
