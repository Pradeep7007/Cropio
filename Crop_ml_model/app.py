from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import warnings

warnings.filterwarnings("ignore")

# --- 1. FastAPI App Initialization ---
app = FastAPI(
    title="Crop Recommendation API",
    description="API for predicting the most suitable crop based on soil and climate data."
)

# --- 2. CORS Configuration ---
# Allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Model Loading ---
MODEL_FILE = 'model.pkl'
try:
    with open(MODEL_FILE, 'rb') as file:
        model = pickle.load(file)
    print(f"✅ Model loaded successfully from: {MODEL_FILE}")
except FileNotFoundError:
    print(f"🚨 ERROR: Model file not found at {MODEL_FILE}. Please ensure the path is correct.")
    model = None
except Exception as e:
    print(f"🚨 ERROR loading model: {e}")
    model = None

# --- 4. Define Input Data Structure (Pydantic Model) ---
# NOTE: These names MUST match the keys in your React formData
class CropData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float 
    humidity: float
    ph: float
    rainfall: float

# --- 5. Define the Prediction Endpoint ---

app.get("/")
def read_root():
    return {"message": "Welcome to the Crop Recommendation API. Use the /api/farmer/croprecommendation/cropdata endpoint to get recommendations."}

@app.post("/api/farmer/croprecommendation/cropdata")
def get_crop_recommendation(data: CropData):
    """
    Receives soil and climate parameters and returns the recommended crop.
    """
    if model is None:
        return {
            "success": False, 
            "message": "Model not loaded. Check server logs."
        }

    # RESOLVED ERROR HERE: Accessing data using the CORRECT keys from the Pydantic model
    # The order MUST match the order expected by your trained ML model!
    feature_list = [
        data.nitrogen, 
        data.phosphorus, 
        data.potassium, 
        data.temperature, 
        data.humidity, 
        data.ph, 
        data.rainfall
    ]
    
    # Prepare the data array for the model
    single_pred = np.array(feature_list).reshape(1, -1)
    
    try:
        # 6. Make Prediction
        prediction = model.predict(single_pred)
        
        # prediction is a numpy array; extract the result and format
        recommended_crop = str(prediction[0]).title()
        # 7. Return API Response
        return {
            "success": True,
            "data": {
                "recommendation": recommended_crop # Changed key to "recommendation" for simplicity
            }
        }
    except Exception as e:
        print(f"🚨 Prediction Error: {e}")
        return {
            "success": False,
            "message": f"An error occurred during prediction: {str(e)}"
        }