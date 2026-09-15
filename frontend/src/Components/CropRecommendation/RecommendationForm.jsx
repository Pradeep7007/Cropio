import React, { useState } from 'react';

const RecommendationForm = ({ onRecommendationsReceived }) => {
  // State is now correctly set up for numerical input (as strings initially)
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
});
  
  // Base URL pointing to your FastAPI endpoint
  const baseUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000'; 
  const apiPath = '/api/farmer/croprecommendation/cropdata'; // Matches the FastAPI endpoint path
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    // Allows for number input (stored as string in state)
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission if wrapped in a <form>
    setLoading(true);
    setError('');

    // --- Data Validation and Conversion ---
    const dataToSend = {};
    let incomplete = false;

    // Convert all fields to float and check for empty/invalid input
    for (const key in formData) {
      const value = formData[key];
      if (value === '' || value === null) {
        incomplete = true;
        break;
      }
      // Parse the string value to a float, which the FastAPI Pydantic model expects
      dataToSend[key] = parseFloat(value); 
    }

    if (incomplete) {
      setError('Please fill in all numerical fields.');
      setLoading(false);
      return;
    }
    // --- End Validation ---

    try {
      // Sanitize URL: Remove trailing slash from baseUrl if it exists
      const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const fullUrl = `${sanitizedBaseUrl}${apiPath}`;

      const response = await fetch(fullUrl, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), 
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) { 
        console.log('API Response:', result);
        // Call the parent function to display the recommendation
        console.log("Recommendations:", result.data.recommendation);
        onRecommendationsReceived(result.data.recommendation);
        
      } else {
        // Use the error message returned from the FastAPI server if available
        const errorMessage = result.message || `Failed to get recommendations. Status: ${response.status}`;
        setError(errorMessage);
      }
    } catch (err) {
      // Catch network errors (CORS, server down, etc.)
      setError('Network error: Could not connect to the ML API server. Verify that your VITE_ML_API_URL is correct in Vercel settings.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Define the fields to render
  const numericalFields = [
    { key: 'nitrogen', label: 'Nitrogen (N)', units: 'kg/ha', min: 0, max: 200, step: "any", desc: "Available mineral nitrogen in topsoil" },
    { key: 'phosphorus', label: 'Phosphorus (P)', units: 'kg/ha', min: 0, max: 150, step: "any", desc: "Plant available soil phosphorus" },
    { key: 'potassium', label: 'Potassium (K)', units: 'kg/ha', min: 0, max: 250, step: "any", desc: "Exchangeable potassium level" },
    { key: 'temperature', label: 'Temperature', units: '°C', min: 0, max: 55, step: "0.1", desc: "Mean seasonal ambient temperature" },
    { key: 'humidity', label: 'Relative Humidity', units: '%', min: 0, max: 100, step: "0.1", desc: "Average ambient moisture index" },
    { key: 'ph', label: 'Soil pH', units: 'pH scale', min: 0, max: 14, step: "0.1", desc: "Acidity / Alkalinity level (neutral = 7.0)" },
    { key: 'rainfall', label: 'Rainfall', units: 'mm', min: 0, max: 1000, step: "any", desc: "Annual or seasonal precipitation estimate" },
  ];

  const handleFillPreset = (presetType) => {
    if (presetType === 'alluvial') {
      setFormData({
        nitrogen: "90",
        phosphorus: "42",
        potassium: "43",
        temperature: "20.8",
        humidity: "82.0",
        ph: "6.5",
        rainfall: "202.9"
      });
    } else if (presetType === 'black') {
      setFormData({
        nitrogen: "60",
        phosphorus: "55",
        potassium: "22",
        temperature: "25.5",
        humidity: "71.2",
        ph: "7.8",
        rainfall: "110.5"
      });
    } else if (presetType === 'coastal') {
      setFormData({
        nitrogen: "78",
        phosphorus: "35",
        potassium: "30",
        temperature: "27.2",
        humidity: "85.4",
        ph: "6.2",
        rainfall: "260.0"
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e0] shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Machine Learning Recommender
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            AI Crop Recommendation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Input localized agro-climatic and soil chemistry indicators to identify the optimal crop for your farm.
          </p>
        </div>

        {/* Quick Fill Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 mr-1">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleFillPreset('alluvial')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            Alluvial Soil
          </button>
          <button
            type="button"
            onClick={() => handleFillPreset('black')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            Black Soil
          </button>
          <button
            type="button"
            onClick={() => handleFillPreset('coastal')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
          >
            Coastal / Humid
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
          <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {numericalFields.map(({ label, key, min, max, step, units, desc }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  {label}
                </label>
                {units && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                    {units}
                  </span>
                )}
              </div>
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange(key)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 px-4 py-3 text-sm font-medium transition-all shadow-sm outline-none"
                placeholder={`Enter ${label.toLowerCase()}...`}
                min={min}
                max={max}
                step={step}
                required
              />
              <span className="text-[11px] text-gray-400 leading-tight">
                {desc}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            Predictions are computed using trained agricultural decision models.
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white shadow-sm transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-emerald-600/20 hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Soil Chemistry...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Crop Recommendation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;