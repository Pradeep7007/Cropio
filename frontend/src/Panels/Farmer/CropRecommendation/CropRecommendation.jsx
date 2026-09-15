import React, { useState } from 'react';
import RecommendationForm from "../../../Components/CropRecommendation/RecommendationForm"
import CropRecommended from "../../../Components/CropRecommendation/CropRecommended"

const CropRecommendation = () => {
  const [recommendations, setRecommendations] = useState(null);

  const handleRecommendationsReceived = (data) => {
    setRecommendations(data);
  };

  return (
    <div 
      className="min-h-screen bg-[#f8faf7] text-[#121b0e] py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
      style={{ fontFamily: "Lexend, Noto Sans, sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">
        <RecommendationForm onRecommendationsReceived={handleRecommendationsReceived} />
        {recommendations && (
          <div className="mt-6 w-full">
            <CropRecommended recommendations={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
