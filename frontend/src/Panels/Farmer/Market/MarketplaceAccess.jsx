import React, { useState, useEffect, useMemo } from "react";
import MarketFilter from "../../../Components/Market/MarketFilter";
import MarketPlace from "../../../Components/Market/MarketPage";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function MarketplaceAccess() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Products");
  const [location, setLocation] = useState("All Locations");
  const [delivery, setDelivery] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(
          `${baseUrl}/api/farmer/marketplace/marketdata`
        );
        const result = await response.json();
        console.log("Marketplace data fetched:", result);
        setProducts(result.products || result || []); // ✅ ensure array
      } catch (error) {
        console.error("Error fetching marketplace data:", error);
      }
    }
    getData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesCategory =
        category === "All Products" || p.category === category;

      const matchesLocation =
        location === "All Locations" || p.location === location;

      const matchesDelivery = delivery === "All" || p.delivery === delivery;

      const matchesMinPrice =
        minPrice === "" || (p.price && p.price >= parseFloat(minPrice));

      const matchesMaxPrice =
        maxPrice === "" || (p.price && p.price <= parseFloat(maxPrice));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesDelivery &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [products, searchTerm, category, location, delivery, minPrice, maxPrice]); // ✅ include products

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] group/design-root overflow-x-hidden"
      style={{
        "--select-button-svg":
          "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(103,151,78)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
        fontFamily: "Lexend, 'Noto Sans', sans-serif",
      }}
    >
      <div className="layout-container flex h-full grow flex-row gap-6 px-6 py-5">
        <MarketFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          location={location}
          setLocation={setLocation}
          delivery={delivery}
          setDelivery={setDelivery}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />
        <MarketPlace products={filteredProducts} />
      </div>
    </div>
  );
}
