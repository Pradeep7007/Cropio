import React, { useState } from 'react';

// --- Note: Removed all categorical options arrays (Nitrogen, Phosporus, etc.)
// --- as your model expects N, P, K, Temperature, Humidity, Ph, Rainfall as numbers.

const RecommendationForm = ({ onRecommendationsReceived }) => {
  // State is now correctly set up for numerical input (as strings initially)
  const [formData, setFormData] = useState({
        nitrogen: 10,
        phosphorus: 10,
        potassium: 10,
        temperature: 50,
        humidity: 90,
        ph: 2.5,
        rainfall: 500
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
      // NOTE: The URL MUST match the FastAPI route exactly
      const response = await fetch(`${baseUrl}${apiPath}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Sending the cleaned, numerical data
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
      setError('Network error: Could not connect to the API server. Ensure it is running on port 6000.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Define the fields to render
  const numericalFields = [
        { key: 'nitrogen', label: 'Nitrogen (N)', units: 'kg/ha' },
        { key: 'phosphorus', label: 'Phosphorus (P)', units: 'kg/ha' },
        { key: 'potassium', label: 'Potassium (K)', units: 'kg/ha' },
        { key: 'temperature', label: 'Temperature', units: '°C' },
        { key: 'humidity', label: 'Humidity', units: '%' },
        { key: 'ph', label: 'Soil pH', units: '' },
        { key: 'rainfall', label: 'Rainfall', units: 'mm' },
    ];

  return (
    <div>
      <div className="w-full max-w-[960px]">
        <div className="p-4">
          <h1 className="text-[32px] font-bold text-[#131811]">Crop Recommendation Form</h1>
          <p className="text-sm text-[#6d8560]">Provide details about your farm to receive AI-powered crop suggestions.</p>
          {error && (
            <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Use <form> tag to allow for proper submission handling */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          
          {numericalFields.map(({ label, key, min, max, step, units }) => (
            <div key={key} className="py-2">
                <label className="flex flex-col">
                <span className="text-base font-medium text-[#131811] pb-2">{label}</span>
                <input
                    type="number"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange(key)}
                    className="h-14 p-4 rounded-xl bg-[#ecf0ea] text-base text-[#131811] focus:outline-none"
                    placeholder={`Enter value for ${label}${units ? ` (${units})` : ''}`}
                    min={min}
                    max={max}
                    step={step}
                    required
                />
                </label>
            </div>
          ))}

          <div className="md:col-span-2 flex justify-end px-4 py-3">
            <button
              type="submit" // Set type to submit for form handling
              className={`px-6 py-3 rounded text-white font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 cursor-pointer'
              }`}
              disabled={loading}
            >
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecommendationForm;