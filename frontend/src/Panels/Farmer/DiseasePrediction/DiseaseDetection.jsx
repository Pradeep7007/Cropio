import React, { useState } from "react";
import DiseaseInput from "../../../Components/DiseaseDetection/DiseaseInput";
import DetecedDisease from "../../../Components/DiseaseDetection/DetecedDisease";
import TreatmentOptions from "../../../Components/DiseaseDetection/TreatmentOptions";

export default function DiseaseDetection() {
  const [detectionResult, setDetectionResult] = useState(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fafbf9] overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-5xl mx-auto">
        <div className="flex flex-col w-full space-y-6">
          <DiseaseInput onDetectionResult={setDetectionResult} />
          <DetecedDisease detectionResult={detectionResult} />
          <TreatmentOptions detectionResult={detectionResult} />
        </div>
      </main>
    </div>
  );
}
