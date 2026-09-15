// Dynamic in-memory community posts store with persistent initial realistic data
let communityPosts = [
  {
    id: "post-1",
    author: "Ramesh Patel",
    role: "Farmer (Organic Wheat)",
    location: "Punjab, India",
    crop: "Wheat",
    language: "English",
    title: "Best Organic Practices for High-Yield Wheat This Rabi Season",
    description:
      "Switched to neem cake and Jeevamrutha for the past two seasons. Soil moisture retention increased significantly, and root vigor improved by 20%. Has anyone tested bio-potash with similar results?",
    tags: ["Sustainable", "Organic", "Wheat"],
    likes: 24,
    commentsCount: 6,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-2",
    author: "Dr. Ananya Sharma",
    role: "Agronomist & Researcher",
    location: "Tamil Nadu, India",
    crop: "Rice",
    language: "English",
    title: "Preventing False Smut in Paddy during Flowering Stage",
    description:
      "High humidity coupled with overcast skies creates ideal conditions for false smut. Apply copper hydroxide at 50% flowering to mitigate spore multiplication. Early morning spraying is recommended.",
    tags: ["Pest Control", "Rice", "Crop Science"],
    likes: 38,
    commentsCount: 11,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-3",
    author: "Gurpreet Singh",
    role: "Farmer (Smart Farming)",
    location: "Haryana, India",
    crop: "Corn",
    language: "Hindi",
    title: "Solar Drip Irrigation Setup Cost & Government Subsidy Experience",
    description:
      "Received 60% capital subsidy under the PM-KUSUM scheme for our 5HP solar pump. Electric bill dropped to zero and water usage decreased by 35% compared to flood irrigation.",
    tags: ["AI", "Sustainable", "Irrigation"],
    likes: 42,
    commentsCount: 9,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "post-4",
    author: "Priya Sundaram",
    role: "Horticulture Specialist",
    location: "Karnataka, India",
    crop: "Tomato",
    language: "English",
    title: "Combating Early Blight in Tomatoes with Trichoderma viride",
    description:
      "Regular foliar sprays of Trichoderma mixed with cow dung slurry act as an effective bio-fungicide against early blight without leaving harmful residues.",
    tags: ["Organic", "Pest Control"],
    likes: 19,
    commentsCount: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

module.exports = function CommunityFeed(req, res) {
  try {
    const { crop, tag, language, search } = req.query;
    let filtered = [...communityPosts];

    if (crop && crop.toLowerCase() !== "all" && crop.toLowerCase() !== "all crops") {
      filtered = filtered.filter(
        (p) => p.crop && p.crop.toLowerCase() === crop.toLowerCase()
      );
    }

    if (tag && tag.toLowerCase() !== "all" && tag.toLowerCase() !== "all tags") {
      filtered = filtered.filter(
        (p) => p.tags && p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (language && language.toLowerCase() !== "all" && language.toLowerCase() !== "all languages") {
      filtered = filtered.filter(
        (p) => p.language && p.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      total: filtered.length,
      posts: filtered,
    });
  } catch (err) {
    console.error("Error in CommunityFeed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch community posts" });
  }
};

module.exports.communityPosts = communityPosts;