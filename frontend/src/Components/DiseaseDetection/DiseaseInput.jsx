import React, { useState } from 'react';
import { validateImage, predictDisease } from './diseaseData';

const DiseaseInput = ({ onDetectionResult }) => {
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const cropOptions = [
    'Tomato', 'Wheat', 'Corn', 'Rice', 'Potato', 'Apple', 'Grapes', 'Other'
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  const handleDetection = async () => {
    setError('');
    
    // 1. Validation
    setLoading(true);
    setLoadingMessage('Validating image and inputs...');
    
    try {
      const validationResult = await validateImage(imageFile, category, cropType);
      
      if (!validationResult.isValid) {
        setError(validationResult.message);
        setLoading(false);
        return;
      }

      // 2. Prediction
      setLoadingMessage('Analyzing image with ML model...');
      const prediction = await predictDisease(cropType);
      
      const resultData = {
        crop: cropType,
        category: category,
        ...prediction
      };
      
      onDetectionResult(resultData);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during prediction.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-[#131811] mb-6 border-b pb-3">AI Disease Detection System</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-[#131811] mb-2">
              Upload Image (Leaf, Fruit, or Vegetable) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-green-300 rounded-xl p-4 bg-[#f9fcf8] hover:bg-[#f0f7ec] transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-100 file:text-green-800 hover:file:bg-green-200 cursor-pointer"
              />
            </div>
            {previewUrl && (
              <div className="mt-3">
                <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-lg shadow-sm border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-[#131811] mb-2">
              Image Category <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {['Leaf', 'Fruit', 'Vegetable'].map((cat) => (
                <label key={cat} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mr-2 accent-green-600"
                  />
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Crop Selection */}
          <div>
            <label className="block text-sm font-bold text-[#131811] mb-2">
              Select Crop <span className="text-red-500">*</span>
            </label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-[#131811] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
            >
              <option value="" disabled>Search or select crop...</option>
              {cropOptions.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleDetection}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${loading
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingMessage}
                </span>
              ) : 'Run ML Diagnostics'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3">Powered by Advanced Deep Learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseInput;
