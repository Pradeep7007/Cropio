import React from 'react';

const DetecedDisease = ({ detectionResult }) => {
  if (!detectionResult) {
    return (
      <div className="mt-6 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-500 mb-2">Awaiting Diagnostics</h2>
          <p className="text-sm text-gray-400 max-w-sm">Results will be displayed here once you upload an image and run the ML diagnostics.</p>
        </div>
      </div>
    );
  }

  const isHealthy = detectionResult.name.toLowerCase().includes('healthy');
  const statusColor = isHealthy ? 'text-green-600' : 'text-red-600';
  const statusBg = isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`p-6 border-b ${statusBg}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Detected in {detectionResult.category} / {detectionResult.crop}
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black ${statusColor}`}>
              {detectionResult.name}
            </h2>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence Score</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-blue-600">{detectionResult.confidence}</span>
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Disease Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{detectionResult.description}</p>
        </div>

        {!isHealthy && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Possible Causes
              </h3>
              <p className="text-sm text-orange-700 leading-relaxed">{detectionResult.causes}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                Prevention Methods
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">{detectionResult.prevention}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetecedDisease;
