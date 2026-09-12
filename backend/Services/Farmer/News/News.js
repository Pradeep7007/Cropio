require("dotenv").config();

const fallbackNews = [
  {
    title: "Government Expands Subsidies for Solar-Powered Irrigation Pumps",
    desc: "The central agricultural department has announced an enhanced 60% capital subsidy on solar agricultural pumps under the green energy initiative.",
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop",
    category: "Irrigation & Tech",
    date: "Sep 12, 2026",
    source: "AgriNews Central",
    url: "https://agricoop.nic.in"
  },
  {
    title: "New Climate-Resilient Hybrid Wheat Varieties Released for Upcoming Rabi Season",
    desc: "Agricultural research institutes have approved five drought-tolerant wheat varieties offering 15% higher yields under irregular monsoon conditions.",
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop",
    category: "Crop Science",
    date: "Sep 11, 2026",
    source: "ICAR Reports",
    url: "https://icar.org.in"
  },
  {
    title: "Digital Mandis Record 30% Spike in Direct Farmer-to-Dealer Grain Trades",
    desc: "State e-Mandi portals reported record transaction volumes this quarter, significantly reducing intermediary broker commissions for cultivators.",
    img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop",
    category: "Marketplace",
    date: "Sep 10, 2026",
    source: "Kisan Market Watch",
    url: "https://enam.gov.in"
  },
  {
    title: "Organic Fertilizer Quota Boosted to Accelerate Sustainable Soil Restoration",
    desc: "New guidelines mandate increased distribution of bio-fertilizers through local cooperative banks to lower dependency on chemical urea.",
    img: "https://images.unsplash.com/photo-1592417817098-8f3d69102a5c?w=800&auto=format&fit=crop",
    category: "Sustainable Agriculture",
    date: "Sep 09, 2026",
    source: "Soil Health Mission",
    url: "https://soilhealth.dac.gov.in"
  }
];

module.exports = async function News(req, res) {
  let liveNewsArticles = [];

  const apiKey = process.env.APITUBE_API_KEY || "api_live_NXBanRS5I5RtBvJ5uXriDjMZ1uSx5QzF3dTfyC6NpT6XBOss7ub";

  try {
    const { Client } = await import("@apitube/news-api");
    const client = new Client({ apiKey });

    const response = await client.news("everything", {
      "language.code": "en",
      query: "agriculture OR farming OR crops OR harvest OR farmers",
      per_page: 10,
    });

    if (response && Array.isArray(response.articles) && response.articles.length > 0) {
      liveNewsArticles = response.articles.map((item) => {
        let formattedDate = "Recent";
        if (item.publishedAt) {
          try {
            formattedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch (e) {
            formattedDate = "Recent";
          }
        }

        // Clean snippet / description
        let snippet = item.description || "";
        if (!snippet && Array.isArray(item.summary) && item.summary.length > 0) {
          snippet = item.summary[0].sentence || "";
        }
        if (!snippet && item.body) {
          snippet = item.body.substring(0, 150) + "...";
        }

        return {
          title: item.title,
          desc: snippet || "Latest agricultural news report on farming and crop production.",
          img: item.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop",
          category: (item.categories && item.categories[0]?.name) || "Agriculture",
          date: formattedDate,
          source: item.source?.domain || item.source?.name || "AgriTube News",
          url: item.url || "#",
        };
      });
    }
  } catch (err) {
    console.error("Error fetching live news from @apitube/news-api:", err.message);
  }

  const articlesToReturn = liveNewsArticles.length > 0 ? liveNewsArticles : fallbackNews;

  const tabContent = {
    News: articlesToReturn,
    "MSP Updates": [
      {
        notification: "Cabinet Committee on Economic Affairs (CCEA) approves Minimum Support Prices (MSP) for all mandated Rabi & Kharif Crops.",
        effectiveDate: "Current Agricultural Season",
        table: [
          { crop: "Wheat", previousMsp: "2,275", newMsp: "2,425", increase: "+150" },
          { crop: "Barley", previousMsp: "1,850", newMsp: "1,980", increase: "+130" },
          { crop: "Gram", previousMsp: "5,440", newMsp: "5,650", increase: "+210" },
          { crop: "Lentil (Masur)", previousMsp: "6,425", newMsp: "6,700", increase: "+275" },
          { crop: "Rapeseed & Mustard", previousMsp: "5,650", newMsp: "5,950", increase: "+300" },
          { crop: "Paddy (Common)", previousMsp: "2,183", newMsp: "2,300", increase: "+117" },
        ],
      },
    ],
    Policies: [
      {
        type: "Central Government",
        title: "National Mission on Natural & Regenerative Farming",
        summary: "A central scheme providing technical capacity building, soil microbial bio-inputs, and direct financial incentives of ₹15,000 per hectare for farmers transitioning to chemical-free farming.",
        benefits: "Covers organic certification costs, direct DBT incentives, and dedicated market linkages.",
        eligibility: "All small and marginal farmers owning agricultural land.",
      },
      {
        type: "State Initiative",
        title: "Micro-Irrigation & Water Conservation Subsidies",
        summary: "Providing up to 70% subsidies on installation of drip and sprinkler irrigation units to conserve ground water table.",
        benefits: "Saves up to 40% water and increases fertilizer use efficiency via fertigation.",
        eligibility: "Farmers with access to functional borewell or water source.",
      },
    ],
    Schemes: [
      {
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Comprehensive crop insurance cover against unavoidable natural risks from pre-sowing to post-harvest stages.",
        eligibility: ["All farmers including sharecroppers and tenant farmers growing notified crops."],
        documents: ["Aadhaar Card", "Land Possession Certificate (LPC) / RoR", "Bank Account Passbook", "Sowing Declaration Certificate"],
        process: "Apply directly online through the National Crop Insurance Portal or via your nearest Common Service Centre (CSC).",
        benefits: "Very low premium rates (1.5% - 2%) with fast digital claims settlement directly into Aadhaar-linked accounts.",
        deadline: "July 31 for Kharif / Dec 31 for Rabi",
        link: "https://pmfby.gov.in",
      },
    ],
  };

  res.json(tabContent);
};