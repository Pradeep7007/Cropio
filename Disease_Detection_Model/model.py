import torch
import torch.nn as nn
from torchvision import models

def get_disease_model(num_classes, model_type="efficientnet"):
    """
    Returns a PyTorch model using Transfer Learning.
    Supports 'efficientnet' (EfficientNet-B0) or 'resnet' (ResNet50).
    """
    if model_type == "efficientnet":
        # Load pre-trained EfficientNet-B0
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        # Freeze early layers for faster training (optional, but good for transfer learning)
        for param in model.parameters():
            param.requires_grad = False
            
        # Replace the classifier head
        in_features = model.classifier[1].in_features
        model.classifier[1] = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, num_classes)
        )
        
        # Unfreeze the last few blocks to fine-tune
        for param in model.features[-2:].parameters():
            param.requires_grad = True

    elif model_type == "resnet":
        # Load pre-trained ResNet50
        model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        
        for param in model.parameters():
            param.requires_grad = False
            
        in_features = model.fc.in_features
        model.fc = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, num_classes)
        )
        
        # Unfreeze layer4
        for param in model.layer4.parameters():
            param.requires_grad = True
            
    else:
        raise ValueError("Unsupported model type. Choose 'efficientnet' or 'resnet'.")

    return model
