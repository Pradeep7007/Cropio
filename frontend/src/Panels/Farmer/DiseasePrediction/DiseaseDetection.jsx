import React, { useState } from "react";
import DiseaseInput from "../../../Components/DiseaseDetection/DiseaseInput";
import DetecedDisease from "../../../Components/DiseaseDetection/DetecedDisease";
import TreatmentOptions from "../../../Components/DiseaseDetection/TreatmentOptions";

export default function DiseaseDetection() {
  const [detectionResult, setDetectionResult] = useState(null);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#fafbf9] overflow-x-hidden" style={{ fontFamily: 'Lexend, "Noto Sans", sans-serif' }}>
      <main className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-5 flex justify-center w-full">
        <div className="flex flex-col max-w-[960px] w-full">
          <DiseaseInput onDetectionResult={setDetectionResult} />
          <DetecedDisease detectionResult={detectionResult} />
          <TreatmentOptions detectionResult={detectionResult} />
        </div>
      </main>
    </div>
  );
}
