module.exports = function SustainablePractices (req,res) {
      const tips = [
    {
      title: "Organic Farming",
      description: "Learn about organic farming techniques.",
      image: "/images/farming.png",
    },
    {
      title: "Soil Conservation",
      description: "Discover soil conservation practices.",
      image: "/images/soil.png",
    },
    {
      title: "Water Saving Methods",
      description: "Explore water saving methods.",
      image: "/images/water_saving.png",
    },
    {
      title: "Biodiversity",
      description: "Enhance biodiversity on your farm.",
      image: "/images/biodiversity.png",
    },
  ];
  res.json(tips);
}