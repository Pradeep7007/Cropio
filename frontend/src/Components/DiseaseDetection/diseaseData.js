export const diseaseDatabase = {
  tomato: {
    diseases: [
      {
        name: "Late Blight",
        confidence: "94.2%",
        description: "Late blight is a devastating disease of tomatoes caused by the oomycete Phytophthora infestans. It affects leaves, stems, and fruits, spreading rapidly in cool, wet weather.",
        causes: "Caused by Phytophthora infestans. Spores are windborne and thrive in prolonged periods of leaf wetness and high humidity.",
        recommendedTreatments: "Apply fungicides containing chlorothalonil, copper, or mancozeb immediately upon detection.",
        prevention: "Ensure good air circulation, avoid overhead watering, and destroy infected plant debris at the end of the season.",
        pesticides: "Chlorothalonil (Daconil), Mancozeb, Copper Fungicides.",
        organicOptions: "Copper soap, Bacillus subtilis based bio-fungicides, and Neem oil."
      },
      {
        name: "Tomato Mosaic Virus",
        confidence: "88.7%",
        description: "Tomato Mosaic Virus (ToMV) is a viral disease that causes mottling and yellowing of leaves, stunting plant growth and reducing fruit yield.",
        causes: "Transmitted mechanically through contaminated tools, hands, or clothing. Can also spread via infected seeds.",
        recommendedTreatments: "There is no cure for virus-infected plants. Infected plants must be uprooted and destroyed immediately.",
        prevention: "Use certified disease-free seeds or resistant varieties. Disinfect tools and wash hands frequently when handling plants.",
        pesticides: "Not applicable (viruses cannot be treated with chemical pesticides).",
        organicOptions: "Focus entirely on prevention and quarantine. Milk spray can sometimes reduce transmission risk."
      },
      {
        name: "Healthy",
        confidence: "98.1%",
        description: "The plant appears perfectly healthy with no visible signs of disease or nutrient deficiency.",
        causes: "Optimal growing conditions, proper watering, and good soil health.",
        recommendedTreatments: "Continue current care routine.",
        prevention: "Maintain regular monitoring, balanced fertilization, and good watering practices.",
        pesticides: "None needed.",
        organicOptions: "Continue using organic compost and natural pest deterrents."
      }
    ]
  },
  wheat: {
    diseases: [
      {
        name: "Wheat Rust (Leaf Rust)",
        confidence: "91.5%",
        description: "Leaf rust is a fungal disease that creates small, orange-brown pustules on the leaf blades, severely affecting photosynthesis.",
        causes: "Caused by Puccinia triticina. Thrives in mild temperatures with frequent dew or light rain.",
        recommendedTreatments: "Apply systemic fungicides at the flag leaf emergence stage if rust is detected.",
        prevention: "Plant resistant wheat varieties and eradicate volunteer wheat that can host the disease between seasons.",
        pesticides: "Tebuconazole, Propiconazole, Azoxystrobin.",
        organicOptions: "Sulfur-based fungicides and ensuring proper spacing for air flow."
      },
      {
        name: "Healthy",
        confidence: "97.4%",
        description: "The wheat crop shows no signs of fungal infections or nutrient deficiencies.",
        causes: "Good agricultural practices.",
        recommendedTreatments: "None.",
        prevention: "Maintain crop rotation and timely fertilization.",
        pesticides: "None.",
        organicOptions: "None."
      }
    ]
  },
  corn: {
    diseases: [
      {
        name: "Northern Corn Leaf Blight",
        confidence: "89.3%",
        description: "Characterized by long, elliptical, grayish-green or tan lesions on leaves.",
        causes: "Caused by the fungus Exserohilum turcicum, favoring moderate temperatures and high humidity.",
        recommendedTreatments: "Fungicide applications are most effective when applied before the disease spreads to the upper canopy.",
        prevention: "Crop rotation, managing crop residue, and selecting resistant hybrids.",
        pesticides: "Pyraclostrobin, Azoxystrobin.",
        organicOptions: "Crop rotation and planting resistant varieties are the primary organic defenses."
      }
    ]
  },
  rice: {
    diseases: [
      {
        name: "Rice Blast",
        confidence: "92.8%",
        description: "Rice blast causes spindle-shaped lesions with gray centers on leaves and can also attack the panicle (neck blast).",
        causes: "Caused by the fungus Magnaporthe oryzae. Favored by long periods of high humidity and excessive nitrogen.",
        recommendedTreatments: "Apply appropriate fungicides such as tricyclazole or isoprothiolane.",
        prevention: "Avoid excessive nitrogen fertilizers, maintain proper field flooding, and use resistant varieties.",
        pesticides: "Tricyclazole, Isoprothiolane.",
        organicOptions: "Use bio-control agents like Pseudomonas fluorescens and Trichoderma viride."
      }
    ]
  },
  potato: {
    diseases: [
      {
        name: "Early Blight",
        confidence: "90.2%",
        description: "Early blight creates dark, concentric rings (target spots) on older leaves.",
        causes: "Caused by Alternaria solani fungus. Thrives in alternating wet and dry conditions.",
        recommendedTreatments: "Fungicide sprays should begin when the first symptoms appear and continue on a regular schedule.",
        prevention: "Crop rotation, adequate fertilization, and destroying infected vines.",
        pesticides: "Chlorothalonil, Mancozeb.",
        organicOptions: "Copper-based fungicides and Bacillus subtilis sprays."
      }
    ]
  },
  apple: {
    diseases: [
      {
        name: "Apple Scab",
        confidence: "95.1%",
        description: "Causes olive-green to black spots on leaves and fruit, leading to premature leaf drop and deformed fruit.",
        causes: "Caused by Venturia inaequalis. Ascospores are released during spring rains.",
        recommendedTreatments: "Fungicide applications starting from bud break until petal fall.",
        prevention: "Rake and destroy fallen leaves to reduce overwintering inoculum. Prune trees to improve air circulation.",
        pesticides: "Captan, Myclobutanil.",
        organicOptions: "Liquid copper soap, sulfur sprays, and Neem oil."
      }
    ]
  },
  grapes: {
    diseases: [
      {
        name: "Powdery Mildew",
        confidence: "93.4%",
        description: "Produces a white, powdery fungal growth on leaves, shoots, and grapes, reducing fruit quality.",
        causes: "Caused by Erysiphe necator. Favored by warm, dry weather with high humidity.",
        recommendedTreatments: "Apply sulfur or synthetic fungicides preventatively.",
        prevention: "Canopy management to improve sunlight exposure and air flow.",
        pesticides: "Myclobutanil, Fenarimol.",
        organicOptions: "Sulfur, potassium bicarbonate sprays, and horticultural oils."
      }
    ]
  }
};

export const validateImage = async (file, category, crop) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate complex validation logic
      if (!file) {
        resolve({ isValid: false, message: "Please upload an image." });
        return;
      }
      if (!category) {
        resolve({ isValid: false, message: "Please select the plant category (Leaf/Fruit/Vegetable)." });
        return;
      }
      if (!crop) {
        resolve({ isValid: false, message: "Please select the crop type." });
        return;
      }

      // Simulate a random validation failure (5% chance) to show error handling
      const randomFail = Math.random();
      if (randomFail > 0.95) {
        resolve({ 
          isValid: false, 
          message: `The uploaded image does not appear to be a valid ${category} of a ${crop} plant. Please ensure the image is clear and relevant.` 
        });
        return;
      }

      resolve({ isValid: true, message: "Image validated successfully." });
    }, 1500);
  });
};

export const predictDisease = async (crop) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API failure (5% chance)
      if (Math.random() > 0.95) {
        reject(new Error("Failed to connect to the ML model server. Please try again later."));
        return;
      }

      const cropData = diseaseDatabase[crop.toLowerCase()];
      if (!cropData) {
        resolve({
          name: "Unknown Disease",
          confidence: "60.0%",
          description: "We couldn't identify the disease for this specific crop with high confidence.",
          causes: "Various factors depending on the environment.",
          recommendedTreatments: "Consult a local agricultural expert.",
          prevention: "Maintain good agricultural practices.",
          pesticides: "Consult an expert.",
          organicOptions: "Consult an expert."
        });
        return;
      }

      const diseases = cropData.diseases;
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      resolve(randomDisease);
    }, 2500); // Simulate ML processing time
  });
};
