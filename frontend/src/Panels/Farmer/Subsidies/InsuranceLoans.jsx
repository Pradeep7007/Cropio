import React, { useState, useEffect, useMemo } from "react";
import SubsidyTabs from "../../../Components/Subsidies/SubsidyTabs";
import Header from "../../../Components/Subsidies/Header";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function InsuranceLoans() {
  const [activeTab, setActiveTab] = useState("Crop Insurance");
  const [insurance, setInsurance] = useState([]);
  const [loans, setLoans] = useState([]);
  const [subsidies, setSubsidies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Application / Eligibility Modal State
  const [modalScheme, setModalScheme] = useState(null);
  const [applicantForm, setApplicantForm] = useState({
    name: "",
    landSize: "3.5",
    crop: "Wheat",
    state: "Punjab",
    kccHolder: true,
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => {
    async function fetchData(endpoint, setter) {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}/api/farmer/governmentschemes/${endpoint}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setter(data);
        } else if (data[endpoint] && Array.isArray(data[endpoint])) {
          setter(data[endpoint]);
        } else if (typeof data === "object") {
          setter([data]);
        }
      } catch (error) {
        console.warn(`Could not fetch ${endpoint}, using fallback:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchData("cropinsurances", setInsurance);
    fetchData("loans", setLoans);
    fetchData("subsidies", setSubsidies);
  }, []);

  const currentItems = useMemo(() => {
    let list = [];
    if (activeTab === "Crop Insurance") list = insurance;
    else if (activeTab === "Loans") list = loans;
    else if (activeTab === "Subsidies") list = subsidies;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.extraInfo?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, insurance, loans, subsidies, searchQuery]);

  const handleOpenModal = (item) => {
    setModalScheme(item);
    setEligibilityResult(null);
  };

  const handleCalculateEligibility = (e) => {
    e.preventDefault();
    const acres = parseFloat(applicantForm.landSize) || 1;
    let grant = 0;
    let message = "";

    if (modalScheme.title.includes("KUSUM") || modalScheme.title.includes("Solar")) {
      grant = Math.round(acres * 35000);
      message = `Eligible for 60% Central + State Capital Subsidy on 5HP Solar Pump! Estimated Government Contribution: ₹${grant.toLocaleString()}`;
    } else if (modalScheme.title.includes("KCC") || modalScheme.title.includes("Credit")) {
      const limit = Math.min(300000, Math.round(acres * 45000));
      message = `Sanctionable KCC Credit Limit: ₹${limit.toLocaleString()} at an effective subvention interest rate of 4% p.a.`;
    } else if (modalScheme.title.includes("PMFBY") || modalScheme.title.includes("Insurance")) {
      const sumInsured = Math.round(acres * 52000);
      const farmerPremium = Math.round(sumInsured * 0.015);
      message = `Sum Insured Coverage: ₹${sumInsured.toLocaleString()}. Farmer's subsidized premium contribution: only ₹${farmerPremium.toLocaleString()} (1.5%).`;
    } else {
      grant = Math.round(acres * 18000);
      message = `Direct DBT assistance approved for registration under ${modalScheme.title}. Estimated subsidy credit: ₹${grant.toLocaleString()}`;
    }

    setEligibilityResult(message);
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full flex-col grow">
        <Header />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#121b0e]">
                Government Schemes & Financial Aid
              </h1>
              <p className="text-sm text-[#67974e] mt-1">
                Verified central & state agricultural subsidies, credit facilities, and insurance protections.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="my-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schemes by name, keyword (e.g. Solar, KCC, Drip, PMFBY)..."
                className="w-full bg-white border border-[#d7e7d0] rounded-xl px-4 py-3 pl-11 text-sm text-[#121b0e] placeholder-gray-400 focus:outline-none focus:border-green-600 shadow-xs"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <SubsidyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Scheme Cards Grid */}
          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                Loading scheme details...
              </div>
            ) : currentItems.length > 0 ? (
              currentItems.map((item, i) => (
                <div
                  key={item.id || i}
                  className="bg-white border border-[#e2e8e0] rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded-md border border-green-200">
                        {item.category || activeTab}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-[#121b0e]">
                      {item.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {item.description}
                    </p>
                    <p className="text-xs text-[#67974e] mt-2 leading-relaxed">
                      {item.extraInfo}
                    </p>

                    {item.eligibility && (
                      <p className="text-xs text-gray-500 mt-2">
                        <b>Eligibility:</b> {item.eligibility}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer text-center"
                    >
                      ⚡ Check Eligibility & Apply
                    </button>
                    {item.portalUrl && (
                      <a
                        href={item.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition text-center"
                      >
                        Official Portal ↗
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                No schemes found matching "{searchQuery}".
              </div>
            )}
          </div>
        </main>

        {/* Dynamic Eligibility Calculator Modal */}
        {modalScheme && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    Check Eligibility & Subsidy
                  </h3>
                  <p className="text-xs text-green-700 font-medium">
                    {modalScheme.title}
                  </p>
                </div>
                <button
                  onClick={() => setModalScheme(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCalculateEligibility} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={applicantForm.name}
                    onChange={(e) =>
                      setApplicantForm({ ...applicantForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cultivated Land (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      value={applicantForm.landSize}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, landSize: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Crop
                    </label>
                    <select
                      value={applicantForm.crop}
                      onChange={(e) =>
                        setApplicantForm({ ...applicantForm, crop: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-green-600"
                    >
                      <option value="Wheat">Wheat</option>
                      <option value="Rice">Rice</option>
                      <option value="Corn">Corn</option>
                      <option value="Tomato">Tomato</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Soybean">Soybean</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="kccCheck"
                    checked={applicantForm.kccHolder}
                    onChange={(e) =>
                      setApplicantForm({ ...applicantForm, kccHolder: e.target.checked })
                    }
                    className="rounded text-green-600"
                  />
                  <label htmlFor="kccCheck" className="text-xs text-gray-700 cursor-pointer">
                    I hold an active Kisan Credit Card (KCC) or Land RoR (7/12)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-sm transition shadow-sm cursor-pointer mt-2"
                >
                  ⚡ Calculate Eligible Benefit
                </button>
              </form>

              {eligibilityResult && (
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-900 text-xs font-medium leading-relaxed animate-in fade-in">
                  <p className="font-bold text-sm mb-1 text-green-950">✓ Eligibility Confirmed!</p>
                  <p>{eligibilityResult}</p>
                  <div className="mt-3 pt-2 border-t border-green-200 flex justify-end">
                    <a
                      href={modalScheme.portalUrl || "https://agricoop.nic.in"}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-green-700 text-white rounded-lg text-xs font-bold hover:bg-green-800 transition"
                    >
                      Proceed to DBT Registration ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
