import React from 'react';

const TreatmentOptions = ({ detectionResult }) => {
  if (!detectionResult) return null;

  return (
    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-[20px] sm:text-[22px] font-bold mb-2 sm:mb-3">Treatment Options</h2>
      <p className="text-sm sm:text-base mb-2 sm:mb-3">
        Recommended treatment for <strong>{detectionResult.disease}</strong> in <strong>{detectionResult.crop}</strong>:
      </p>
      <p className="text-sm sm:text-base mb-2 sm:mb-3">{detectionResult.treatment}</p>

      <div className="pt-2 sm:pt-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm sm:text-base w-full sm:w-auto">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default TreatmentOptions;
