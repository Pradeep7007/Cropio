import React, { useState, useEffect } from "react";
import SubsidyTabs from "../../../Components/Subsidies/SubsidyTabs";
import Section from "../../../Components/Subsidies/Section";
import Header from "../../../Components/Subsidies/Header";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function InsuranceLoans() {
  const [activeTab, setActiveTab] = useState("Crop Insurance");
  const [insurance, setInsurance] = useState([]);
  const [loans, setLoans] = useState([]);
  const [subsidies, setSubsidies] = useState([]);

  useEffect(() => {
    async function fetchData(url, setter, key) {
      try {
        const response = await fetch(url);
        const data = await response.json();

        // ✅ Normalize response: ensure it's always an array
        if (Array.isArray(data)) {
          setter(data);
        } else if (key && Array.isArray(data[key])) {
          setter(data[key]);
        } else {
          setter([data]); // wrap single object
        }

        console.log(`Fetched ${key}:`, data);
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
      }
    }

    fetchData(
      `${baseUrl}/api/farmer/governmentschemes/cropinsurances`,
      setInsurance,
      "cropinsurances"
    );
    fetchData(
      `${baseUrl}/api/farmer/governmentschemes/loans`,
      setLoans,
      "loans"
    );
    fetchData(
      `${baseUrl}/api/farmer/governmentschemes/subsidies`,
      setSubsidies,
      "subsidies"
    );
  }, []);

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden"
      style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full flex-col grow">
        <Header />
        <main className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#121b0e] tracking-light text-[32px] font-bold leading-tight min-w-72">
                Government Schemes & Financial Aid
              </p>
            </div>

            <SubsidyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "Crop Insurance" &&
              insurance.map((item, i) => (
                <Section
                  key={i}
                  title={item.title}
                  description={item.description}
                  extraInfo={item.extraInfo}
                  buttons={item.buttons || ["Learn More"]}
                />
              ))}

            {activeTab === "Loans" &&
              loans.map((item, i) => (
                <Section
                  key={i}
                  title={item.title}
                  description={item.description}
                  extraInfo={item.extraInfo}
                  buttons={item.buttons || ["Apply Now"]}
                />
              ))}

            {activeTab === "Subsidies" &&
              subsidies.map((item, i) => (
                <Section
                  key={i}
                  title={item.title}
                  description={item.description}
                  extraInfo={item.extraInfo}
                  buttons={item.buttons || ["Check Eligibility"]}
                />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
