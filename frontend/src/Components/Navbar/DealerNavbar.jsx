import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const dealerNavItems = [
  { label: "Dashboard", path: "/", icon: "📊" },
  { label: "Customers", path: "/customers", icon: "👥" },
  { label: "Farmer Connect", path: "/farmer-connect", icon: "🌾" },
  { label: "Price Forecast", path: "/price-forecast", icon: "📈" },
  { label: "Smart Purchase", path: "/smart-purchase", icon: "💡" },
  { label: "Logistics", path: "/logistics-integration", icon: "🚚" },
  { label: "Inventory", path: "/inventory-management", icon: "📦" },
  { label: "Demand & Supply", path: "/demand-supply-dashboard", icon: "⚖️" },
];

export default function DealerNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const userName = (() => {
    try {
      const obj = JSON.parse(localStorage.getItem("userObj"));
      return obj?.name || "Dealer";
    } catch {
      return "Dealer";
    }
  })();

  const userInitial = userName ? userName.charAt(0).toUpperCase() : "D";

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userObj");
    window.dispatchEvent(new Event("loggedInChanged"));
    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <img
              src={logo}
              alt="Cropio Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-green-800 tracking-tight leading-none">
                Cropio
              </span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                Dealer Trading Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {dealerNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-green-100 text-green-900 shadow-xs"
                      : "text-gray-600 hover:text-green-800 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Tablet & Desktop Profile Area */}
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-green-50 text-green-800 border border-green-200 rounded-full">
              Dealer Account
            </span>

            <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-green-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {userInitial}
              </div>
              <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate hidden md:inline-block">
                {userName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-semibold transition cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-gray-700 hover:text-green-800 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              aria-label="Toggle dealer menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Sub-nav for Tablet (medium screens 768px - 1279px) */}
      <div className="hidden md:flex xl:hidden border-t border-gray-100 bg-[#fafbf9] px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-2 min-w-max mx-auto">
          {dealerNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-green-800 text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer (screens < 768px) */}
      {isMobileOpen && (
        <div className="xl:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-xs z-40 animate-in fade-in">
          <div className="bg-white w-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-gray-200 shadow-2xl p-6 space-y-4 animate-in slide-in-from-top-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Dealer Operations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dealerNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-green-50 text-green-900 border border-green-200"
                        : "text-gray-800 hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <span className="text-xs text-green-800 font-medium">Dealer Account</span>
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
}
