import torch
from torchvision import transforms
from PIL import Image
import os
import json

import config
from model import get_disease_model

class DiseasePredictor:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        class_names_path = os.path.join(os.path.dirname(config.MODEL_SAVE_PATH), "class_names.json")
        if not os.path.exists(class_names_path):
            self.class_names = None
        else:
            with open(class_names_path, "r") as f:
                self.class_names = json.load(f)
                
        if self.class_names:
            self.model = get_disease_model(num_classes=len(self.class_names), model_type="efficientnet")
            if os.path.exists(config.MODEL_SAVE_PATH):
                self.model.load_state_dict(torch.load(config.MODEL_SAVE_PATH, map_location=self.device))
                self.model.to(self.device)
                self.model.eval()
            else:
                self.model = None
        else:
            self.model = None

        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.CenterCrop(config.IMAGE_SIZE),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

    def predict(self, image: Image.Image):
        if self.model is None or self.class_names is None:
            raise RuntimeError("Model or class names not loaded. Please train the model first.")

        img_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            confidence, predicted_idx = torch.max(probabilities, dim=0)

        predicted_class = self.class_names[predicted_idx.item()]
        confidence_score = confidence.item() * 100

        return predicted_class, confidence_score

    def validate_image(self, image: Image.Image):
        """
        Validates if the image is actually a plant.
        In a production scenario, you would have a binary classifier (Plant vs Non-Plant).
        Here we implement a mock logic, or you can plug in a real model.
        """
        # TODO: Load a real OOD (Out of Distribution) model here.
        # For this implementation, we assume basic validation passes, 
        # but if the user provides very small/corrupt images it fails.
        if image.width < 50 or image.height < 50:
            return False, "Image resolution is too low to be a valid plant leaf."
        
        # Simulating a validation check
        return True, "Valid Plant Image"
