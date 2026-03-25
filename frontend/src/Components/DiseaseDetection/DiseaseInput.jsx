import React, { useState } from 'react';

const DiseaseInput = ({ onDetectionResult }) => {
  const [imageFile, setImageFile] = useState(null);
  const [cropType, setCropType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const cropDiseases = {
    corn: [
      { name: 'Corn Rust', treatment: 'Use resistant varieties and fungicides' },
      { name: 'Northern Leaf Blight', treatment: 'Remove infected leaves and crop rotation' },
    ],
    wheat: [
      { name: 'Powdery Mildew', treatment: 'Apply sulfur-based fungicides' },
      { name: 'Leaf Rust', treatment: 'Use resistant wheat varieties' },
    ],
    rice: [
      { name: 'Bacterial Leaf Blight', treatment: 'Use disease-free seeds and proper spacing' },
      { name: 'Rice Blast', treatment: 'Apply fungicides and remove infected debris' },
    ],
    tomato: [
      { name: 'Late Blight', treatment: 'Remove affected leaves, fungicides, proper drainage' },
      { name: 'Tomato Mosaic Virus', treatment: 'Use resistant varieties, clean tools' },
    ],
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDetection = () => {
    if (!cropType) {
      alert('Please select a crop type');
      return;
    }

    setLoading(true);

    // Simulate API detection with random disease
    const diseases = cropDiseases[cropType];
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];

    const resultData = {
      crop: cropType,
      disease: randomDisease.name,
      treatment: randomDisease.treatment,
      confidence: `${Math.floor(Math.random() * 21) + 80}%`, // 80-100% confidence
    };

    setTimeout(() => {
      onDetectionResult(resultData);
      setLoading(false);
    }, 1000); // Simulate 1s API call
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-[#131811] mb-4">Disease Detection</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#131811] mb-2">
            Upload Plant Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 max-w-xs rounded-lg" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#131811] mb-2">
            Crop Type
          </label>
          <select
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#ecf0ea] text-[#131811] focus:outline-none"
          >
            <option value="">Select crop type</option>
            <option value="corn">Corn</option>
            <option value="wheat">Wheat</option>
            <option value="rice">Rice</option>
            <option value="tomato">Tomato</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#131811] mb-2">
            Describe Symptoms (Optional)
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe visible symptoms like discoloration, spots, wilting, etc."
            className="w-full p-3 rounded-lg bg-[#ecf0ea] text-[#131811] focus:outline-none h-24 resize-none"
          />
        </div>

        <button
          onClick={handleDetection}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium ${loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? 'Analyzing...' : 'Detect Disease'}
        </button>
      </div>
    </div>
  );
};

export default DiseaseInput;
