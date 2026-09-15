module.exports = function SustainablePractices(req, res) {
  const tips = [
    {
      id: "sp-1",
      title: "Drip & Micro-Irrigation",
      category: "Water Conservation",
      description: "Delivers water straight to crop roots, slashing water wastage by up to 60% and limiting weed proliferation.",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
      benefits: ["Saves 50-60% water", "Lowers weed growth", "Uniform nutrient delivery"]
    },
    {
      id: "sp-2",
      title: "Cover Cropping & Mulching",
      category: "Soil Health",
      description: "Retains soil moisture, prevents surface erosion, and enriches natural microbial biology without chemical dependency.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80",
      benefits: ["Prevents soil erosion", "Suppresses weeds naturally", "Improves organic matter"]
    },
    {
      id: "sp-3",
      title: "Integrated Pest Management (IPM)",
      category: "Bio-Control",
      description: "Utilizes beneficial predator insects, neem-based repellents, and crop rotation to suppress pests naturally.",
      image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80",
      benefits: ["Zero chemical residue", "Cost effective", "Protects pollinator bees"]
    },
    {
      id: "sp-4",
      title: "Solar-Powered Micro Irrigation",
      category: "Clean Energy",
      description: "Cuts recurring diesel generator expenses and reduces carbon footprint with sustainable solar photovoltaic pumping.",
      image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
      benefits: ["Zero electricity bill", "Government PM-KUSUM subsidy", "Reliable daytime power"]
    },
    {
      id: "sp-5",
      title: "Crop Rotation & Polyculture",
      category: "Biodiversity",
      description: "Alternating legumes with cereals replenishes natural nitrogen in the root zone and prevents pest cycles.",
      image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop&q=80",
      benefits: ["Breaks pest cycles", "Balances soil nutrients", "Diversifies farm income"]
    },
    {
      id: "sp-6",
      title: "Composting & Vermiculture",
      category: "Organic Inputs",
      description: "Converts farm crop residue and livestock manure into nutrient-rich humus and bio-fertilizer.",
      image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=80",
      benefits: ["Reduces chemical fertilizer need", "Increases earthworm density", "Increases water holding capacity"]
    }
  ];
  res.json(tips);
};