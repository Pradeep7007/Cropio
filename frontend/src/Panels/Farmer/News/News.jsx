import React, { useState } from "react";
import { newsData } from "./newsData";

const News = () => {
  const [activeTab, setActiveTab] = useState("News");
  const tabs = ["News", "MSP Updates", "Policies", "Schemes"];

  const renderNews = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {newsData["News"].map((item, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
          <div 
            className="h-48 sm:h-auto sm:w-2/5 bg-cover bg-center"
            style={{ backgroundImage: `url('${item.img}')` }}
          />
          <div className="p-6 sm:w-3/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">{item.category}</span>
                <span className="text-gray-400 text-xs">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
            </div>
            <div className="text-sm font-medium text-green-600">Source: {item.source}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMSP = () => {
    const data = newsData["MSP Updates"];
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <h3 className="font-bold text-blue-900 mb-1">Official Notification</h3>
          <p className="text-blue-800 text-sm">{data.notification}</p>
          <p className="text-blue-600 text-sm font-bold mt-2">Effective Date: {data.effectiveDate}</p>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 font-bold border-b">Crop Name</th>
                <th className="p-4 font-bold border-b">Previous MSP (₹/Qtl)</th>
                <th className="p-4 font-bold border-b">New MSP (₹/Qtl)</th>
                <th className="p-4 font-bold border-b text-green-600">Increase (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.table.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{row.crop}</td>
                  <td className="p-4 text-gray-600">₹{row.previousMsp}</td>
                  <td className="p-4 font-bold text-gray-900">₹{row.newMsp}</td>
                  <td className="p-4 font-bold text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    {row.increase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPolicies = () => (
    <div className="space-y-6">
      {newsData["Policies"].map((policy, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${policy.type === 'Central Government' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
              {policy.type}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{policy.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">{policy.summary}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Key Benefits
              </h4>
              <p className="text-sm text-gray-600">{policy.benefits}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Eligibility
              </h4>
              <p className="text-sm text-gray-600">{policy.eligibility}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSchemes = () => (
    <div className="space-y-8">
      {newsData["Schemes"].map((scheme, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
          <div className="bg-green-50 p-6 border-b border-green-100">
            <h3 className="text-2xl font-bold text-green-900 mb-2">{scheme.title}</h3>
            <p className="text-green-700">{scheme.description}</p>
          </div>
          
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Eligibility Criteria</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {scheme.eligibility.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Required Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {scheme.documents.map((doc, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200">{doc}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Application Process</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">{scheme.process}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-2">Benefits</h4>
                <p className="text-yellow-800 text-sm font-medium">{scheme.benefits}</p>
              </div>
              
              <div className="bg-red-50 p-5 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Important Deadline
                </h4>
                <p className="text-red-800 font-bold">{scheme.deadline}</p>
              </div>
              
              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-md"
              >
                Apply / Official Portal
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-[#f9fcf8] overflow-x-hidden font-sans">
      <div className="layout-container flex h-full grow flex-col px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Agricultural <span className="text-green-600">News & Services</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">Stay updated with the latest market trends, government policies, MSP changes, and essential schemes designed to empower farmers.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-6 border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 sm:px-4 text-sm sm:text-base font-bold whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab
                  ? "text-green-700 border-green-600"
                  : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="min-h-[500px]">
          {activeTab === "News" && renderNews()}
          {activeTab === "MSP Updates" && renderMSP()}
          {activeTab === "Policies" && renderPolicies()}
          {activeTab === "Schemes" && renderSchemes()}
        </div>

      </div>
    </div>
  );
};

export default News;
