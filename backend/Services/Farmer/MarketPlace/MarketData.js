module.exports = function MarketData (req,res) {
    const products = [
      {
        title: "Organic Wheat",
        available: true,
        quantity: 500,
        price: 2,
        delivery: "Available",
        category: "Grains",
        location: "USA",
        image: "/images/wheat.jpg",
      },
      {
        title: "Fresh Tomatoes",
        available: true,
        quantity: 200,
        price: 1.5,
        delivery: "Available",
        category: "Vegetables",
        location: "Mexico",
        image: "/images/tomato.jpg",
      },
      {
        title: "Apples",
        available: true,
        quantity: 300,
        price: 1,
        delivery: "Available",
        category: "Fruits",
        location: "USA",
        image: "/images/apple.jpg",
      },
      {
        title: "Corn",
        available: true,
        quantity: 400,
        price: 0.8,
        delivery: "Available",
        category: "Grains",
        location: "Mexico",
        image: "/images/corn.jpg",
      },
    ];
    res.json(products);
}