import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [showServices, setShowServices] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hideTimeoutRef = useRef(null);
  const location = useLocation();

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
      }, 100);
    }
  };

  const [user, setUser] = useState(() => localStorage.getItem("user") || "Farmer");

  useEffect(() => {
    const syncUser = () => setUser(localStorage.getItem("user") || "Farmer");
    window.addEventListener("userChanged", syncUser);
    return () => window.removeEventListener("userChanged", syncUser);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Recommendations", path: "/croprecommendation" },
    { name: "Disease Detection", path: "/dieseasedetection" },
    { name: "Cultivation Guides", path: "/cultivationguide" },
    { name: "Sustainable Practices", path: "/sustainable" },
  ];

  const services = [
    { name: "Sell Harvest", path: "/services/sell-crop", icon: "🌾" },
    { name: "Mandi Marketplace", path: "/services/market", icon: "🏪" },
    { name: "News & Alerts", path: "/services/news", icon: "📰" },
    { name: "Community Forum", path: "/services/community", icon: "💬" },
    { name: "Govt Schemes", path: "/services/subsidy", icon: "🏛️" },
    { name: "Yield Estimation", path: "/services/yield-estimation", icon: "⚖️" },
  ];

  const userName = (() => {
    try {
      const obj = JSON.parse(localStorage.getItem("userObj"));
      return obj?.name || "Farmer";
    } catch {
      return "Farmer";
    }
  })();

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "F";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userObj");
    window.dispatchEvent(new Event("loggedInChanged"));
    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <img
            src={logo}
            alt="Cropio Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold text-green-700 tracking-tight leading-none">
              Cropio
            </span>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
              Farmer Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          <nav className="flex items-center space-x-1 text-sm font-medium text-gray-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-green-50 text-green-700 font-bold"
                      : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  location.pathname.startsWith("/services")
                    ? "bg-green-50 text-green-700 font-bold"
                    : "text-gray-600 hover:text-green-700 hover:bg-gray-50"
                }`}
                onClick={() => setShowServices((prev) => !prev)}
              >
                <span>Services</span>
                <span className="text-[10px] transition-transform duration-200">
                  {showServices ? "▲" : "▼"}
                </span>
              </button>

              {showServices && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl w-64 z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Agricultural Services
                  </div>
                  {services.map((service) => {
                    const isServiceActive = location.pathname === service.path;
                    return (
                      <Link
                        key={service.path}
                        to={service.path}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition ${
                          isServiceActive
                            ? "bg-green-50 text-green-800 font-bold"
                            : "text-gray-700 hover:bg-gray-50 hover:text-green-700"
                        }`}
                      >
                        <span>{service.icon}</span>
                        <span>{service.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Area: Profile & Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            to="/services/sell-crop"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition active:scale-95"
          >
            <span>🌾</span>
            <span>Sell Crops</span>
          </Link>

          <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-800 border border-green-200 rounded-full">
            Farmer
          </span>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {userInitial}
            </div>
            <span className="text-xs font-semibold text-gray-800 max-w-[110px] truncate">
              {userName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="text-xs px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-semibold transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-green-700 text-white font-bold flex items-center justify-center text-xs">
            {userInitial}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-18 bg-black/30 backdrop-blur-xs z-40 animate-in fade-in">
          <div className="bg-white w-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-200 shadow-2xl p-6 space-y-6 animate-in slide-in-from-top-4">
            
            {/* Primary Nav Links */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Main Menu
              </span>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-green-50 text-green-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Services Grid */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Agricultural Services
              </span>
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => (
                  <Link
                    key={s.path}
                    to={s.path}
                    className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-green-50 rounded-xl text-xs font-semibold text-gray-800 border border-gray-100"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Footer User Info & Logout */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <span className="text-xs text-green-700 font-medium">Farmer Account</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
