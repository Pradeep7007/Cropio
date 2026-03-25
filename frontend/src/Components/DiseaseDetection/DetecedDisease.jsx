import React from 'react';

const DetecedDisease = ({ detectionResult }) => {
  if (!detectionResult) {
    return (
      <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-[20px] sm:text-[22px] font-bold mb-2 sm:mb-3">Detection Results</h2>
        <p className="text-sm sm:text-base">Results will be displayed here after processing the image.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-[20px] sm:text-[22px] font-bold mb-2 sm:mb-3">Detection Results</h2>
      <p className="text-sm sm:text-base"><strong>Crop:</strong> {detectionResult.crop}</p>
      <p className="text-sm sm:text-base"><strong>Disease:</strong> {detectionResult.disease}</p>
      <p className="text-sm sm:text-base"><strong>Confidence:</strong> {detectionResult.confidence}</p>
      <p className="text-sm sm:text-base"><strong>Treatment:</strong> {detectionResult.treatment}</p>
    </div>
  );
};

export default DetecedDisease;
