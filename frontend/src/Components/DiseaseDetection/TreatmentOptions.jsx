import React from 'react';

const TreatmentOptions = ({ detectionResult }) => {
  if (!detectionResult) return null;
  
  const isHealthy = detectionResult.name.toLowerCase().includes('healthy');
  if (isHealthy) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b bg-green-50">
        <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Treatment & Action Plan
        </h2>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Recommended Immediate Actions</h3>
          <p className="text-gray-700 leading-relaxed">{detectionResult.recommendedTreatments}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-purple-100 rounded-lg p-5 bg-purple-50">
            <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <span className="bg-purple-200 text-purple-800 p-1 rounded">🧪</span>
              Chemical Pesticides/Fungicides
            </h4>
            <p className="text-purple-800 text-sm leading-relaxed">{detectionResult.pesticides}</p>
            <p className="text-xs text-purple-600 mt-2 italic">* Always follow safety guidelines and local regulations when applying chemical treatments.</p>
          </div>

          <div className="border border-emerald-100 rounded-lg p-5 bg-emerald-50">
            <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <span className="bg-emerald-200 text-emerald-800 p-1 rounded">🌿</span>
              Organic Treatment Options
            </h4>
            <p className="text-emerald-800 text-sm leading-relaxed">{detectionResult.organicOptions}</p>
          </div>
        </div>

        <div className="pt-6 border-t mt-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">Need more help? Consult with a local agricultural expert.</p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentOptions;
