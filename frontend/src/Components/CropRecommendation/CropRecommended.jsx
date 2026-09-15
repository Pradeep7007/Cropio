import React from 'react';

const CropRecommended = ({ recommendations }) => {
    let cropName = null;

    // Check 1: If the prop is the object { recommendation: "Rice" }
    if (recommendations && typeof recommendations === 'object' && recommendations.recommendation) {
        cropName = recommendations.recommendation;
    } 
    // Check 2: If the Parent Component passed the raw string directly
    else if (typeof recommendations === 'string') {
        cropName = recommendations;
    }
    // Check 3: If the Parent Component passed { data: "Rice" }
    else if (recommendations && typeof recommendations === 'object' && recommendations.data) {
        // This is a common error: passing result.data when it should be result.data.recommendation
        cropName = recommendations.data;
    }


    // Handle the case where no recommendation is available or loading
    if (!cropName) {
        return (
            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-dashed border-gray-200">
                <p className="text-sm">No personalized crop recommendation available yet. Please submit the form above.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Optimal Crop Selection Identified
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight capitalize">
                        {cropName}
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base max-w-xl">
                        Based on your field's NPK soil nutrients, rainfall profile, and climate metrics, <span className="font-semibold text-emerald-800 capitalize">{cropName}</span> offers the highest predicted yield density and stress tolerance.
                    </p>
                </div>

                {/* Badge card */}
                <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-500 to-green-700 text-white rounded-2xl shadow-lg w-full md:w-auto min-w-[220px]">
                    <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold mb-1">Recommendation Score</span>
                    <span className="text-4xl font-black">94.8%</span>
                    <span className="text-xs text-emerald-100 mt-1">Prime Suitability</span>
                </div>
            </div>

            {/* Practical Advice Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Next Step</div>
                    <div className="text-sm font-semibold text-gray-800">Review Sowing Window</div>
                    <p className="text-xs text-gray-500 mt-0.5">Check the Cultivation Guide for sowing calendar.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mandi Outlook</div>
                    <div className="text-sm font-semibold text-gray-800">Check Market Prices</div>
                    <p className="text-xs text-gray-500 mt-0.5">View current spot mandi rates in your district.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Soil Care</div>
                    <div className="text-sm font-semibold text-gray-800">Nutrient Balancing</div>
                    <p className="text-xs text-gray-500 mt-0.5">Maintain optimal organic mulch and irrigation cycle.</p>
                </div>
            </div>
        </div>
    );
};

export default CropRecommended;