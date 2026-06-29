disease_info_db = {
    "Tomato_Late_Blight": {
        "description": "Late blight is a devastating disease of tomatoes caused by the oomycete Phytophthora infestans. It affects leaves, stems, and fruits, spreading rapidly in cool, wet weather.",
        "causes": "Caused by Phytophthora infestans. Spores are windborne and thrive in prolonged periods of leaf wetness and high humidity.",
        "symptoms": "Water-soaked spots on leaves that turn brown/black, white fungal growth on undersides, and firm, dark brown lesions on fruits.",
        "treatment": "Apply fungicides containing chlorothalonil, copper, or mancozeb immediately upon detection.",
        "prevention": "Ensure good air circulation, avoid overhead watering, and destroy infected plant debris at the end of the season.",
        "pesticides": "Chlorothalonil (Daconil), Mancozeb, Copper Fungicides.",
        "organic": "Copper soap, Bacillus subtilis based bio-fungicides, and Neem oil."
    },
    "Tomato_healthy": {
        "description": "The plant appears perfectly healthy with no visible signs of disease or nutrient deficiency.",
        "causes": "Optimal growing conditions, proper watering, and good soil health.",
        "symptoms": "Vibrant green leaves, sturdy stem, no spots or wilting.",
        "treatment": "Continue current care routine.",
        "prevention": "Maintain regular monitoring, balanced fertilization, and good watering practices.",
        "pesticides": "None needed.",
        "organic": "Continue using organic compost and natural pest deterrents."
    },
    # Add more classes mapped from PlantVillage here
}

def get_disease_info(class_name):
    # Standardize name for mock matching if exact match not found
    for key in disease_info_db.keys():
        if key.lower() in class_name.lower():
            return disease_info_db[key]
            
    if "healthy" in class_name.lower():
        return disease_info_db["Tomato_healthy"]
        
    return {
        "description": f"Detected {class_name}. Information is limited.",
        "causes": "Fungal, bacterial, viral, or environmental factors.",
        "symptoms": "Varies by disease. Often includes spots, wilting, or discoloration.",
        "treatment": "Consult a local agricultural expert for targeted chemical treatments.",
        "prevention": "Maintain crop rotation, good spacing, and sanitize tools.",
        "pesticides": "Broad-spectrum fungicides/bactericides.",
        "organic": "Neem oil, copper-based sprays, biological controls."
    }
