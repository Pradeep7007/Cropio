import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [showServices, setShowServices] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      clearTimeout(hideTimeoutRef.current);
      setShowServices(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowServices(false);
      }, 75);
    }
  };

  const [user, setUser] = useState(() => localStorage.getItem("user") || "Farmer");

  const handleSwitchRole = () => {
    const newRole = user === "Farmer" ? "Dealer" : "Farmer";
    setUser(newRole);
    localStorage.setItem("user", newRole);
    window.dispatchEvent(new Event("userChanged"));
  };

  useEffect(() => {
    const syncUser = () => setUser(localStorage.getItem("user") || "Farmer");
    window.addEventListener("userChanged", syncUser);
    return () => window.removeEventListener("userChanged", syncUser);
  }, []);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Recommendations", path: "/croprecommendation" },
    { name: "Disease Detection", path: "/dieseasedetection" },
    { name: "Cultivation Guides", path: "/cultivationguide" },
    { name: "Sustainable Practices", path: "/sustainable" },
  ];

  const services = [
    { name: "News", path: "/services/news" },
    { name: "Community", path: "/services/community" },
    { name: "Market", path: "/services/market" },
    { name: "Govt. Schemes", path: "/services/subsidy" },
    { name: "Yield Estimation", path: "/services/yield-estimation" },
  ];

  return (
    <header className="w-full px-4 md:px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm relative z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3 z-50">
        <img
          src={logo}
          alt="Cropio Logo"
          className="w-8 h-8 md:w-10 md:h-10 rounded-xl object-cover"
        />
        <h2 className="text-xl md:text-2xl font-bold text-green-700">Cropio</h2>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center space-x-6">
        <nav className="flex space-x-5 text-sm font-medium text-gray-700 relative">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-green-600 transition-colors">
              {link.name}
            </Link>
          ))}

          {/* Services Dropdown (Desktop) */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="hover:text-green-600 transition-colors flex items-center gap-1 cursor-pointer"
              onClick={() => setShowServices((prev) => !prev)}
            >
              Services <span className="text-xs">▼</span>
            </button>

            {showServices && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-md w-64 z-50 p-2 grid grid-cols-2 gap-1">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className={`block px-3 py-2 text-sm hover:bg-gray-100 rounded ${service.name === 'Yield Estimation' ? 'col-span-2 text-center' : ''}`}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 🔁 Role Switcher Button */}
        <button
          onClick={handleSwitchRole}
          className="text-sm font-medium px-3 py-1 border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors"
        >
          Switch to {user === "Farmer" ? "Dealer" : "Farmer"}
        </button>

        {/* Notification and Profile */}
        <div className="flex items-center space-x-4">
          <button className="text-xl hover:text-green-600 transition-colors">🔔</button>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden flex items-center space-x-4">
        <button className="text-xl hover:text-green-600 transition-colors">🔔</button>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl text-gray-700 focus:outline-none z-50"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 lg:hidden flex flex-col pt-20 px-6 space-y-6 overflow-y-auto">
          <nav className="flex flex-col space-y-4 text-lg font-medium text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="hover:text-green-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="py-2">
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Services</p>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="block px-3 py-2 text-sm bg-gray-50 hover:bg-green-50 rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                handleSwitchRole();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 bg-green-600 text-white rounded-xl font-bold"
            >
              Switch to {user === "Farmer" ? "Dealer" : "Farmer"}
            </button>
            <div className="mt-6 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-bold">Ethan J.</p>
                <p className="text-xs text-gray-500">View Profile</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

