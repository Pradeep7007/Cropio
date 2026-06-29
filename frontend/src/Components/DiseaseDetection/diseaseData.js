// diseaseData.js is now a wrapper that connects to our ML FastAPI Backend.

const ML_API_URL = "http://localhost:8000/predict";

export const validateImage = async (file, category, crop) => {
  if (!file) {
    return { isValid: false, message: "Please upload an image." };
  }
  if (!category) {
    return { isValid: false, message: "Please select the plant category (Leaf/Fruit/Vegetable)." };
  }
  if (!crop) {
    return { isValid: false, message: "Please select the crop type." };
  }
  return { isValid: true, message: "Inputs valid. Proceeding to ML API..." };
};

export const predictDisease = async (file, category, crop) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  formData.append("crop", crop);

  try {
    const response = await fetch(ML_API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Validation or ML Model failed on the server.");
    }

    if (!data.success) {
      throw new Error(data.message || "Failed to process the image.");
    }

    return data.data; // Return the rich ML result
  } catch (error) {
    console.warn("ML API Error:", error.message);
    // Fallback Mock System if FastAPI is not running
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to the ML Server (http://localhost:8000). Please ensure the PyTorch backend is running.");
    }
    throw error;
  }
};
