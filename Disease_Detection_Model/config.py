import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset", "PlantVillage")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "saved_models", "disease_model.pth")
VALIDATION_MODEL_PATH = os.path.join(BASE_DIR, "saved_models", "plant_validator.pth")

# Hyperparameters
BATCH_SIZE = 32
LEARNING_RATE = 0.001
EPOCHS = 15
IMAGE_SIZE = (224, 224)

# Classes mapping example (Will be dynamically generated during dataset loading)
# A typical PlantVillage dataset has 38 classes.
# e.g. Tomato_Late_Blight, Tomato_healthy, Apple_scab, etc.
