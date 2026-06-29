import os
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split

import config

def get_transforms():
    """
    Returns the training and validation transformations.
    Includes data augmentation for training (rotation, flip, zoom/crop, brightness/contrast).
    """
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(config.IMAGE_SIZE, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet standards
                             std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.CenterCrop(config.IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    
    return train_transform, val_transform

def get_dataloaders():
    """
    Loads the PlantVillage dataset from the config path.
    Splits it into 80% training and 20% validation.
    Returns train_loader, val_loader, and class_names.
    """
    if not os.path.exists(config.DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {config.DATASET_PATH}. Please download the PlantVillage dataset and place it there.")

    train_transform, val_transform = get_transforms()
    
    # Load full dataset with basic transform just to get the length/classes
    full_dataset = datasets.ImageFolder(root=config.DATASET_PATH)
    class_names = full_dataset.classes
    
    # Split sizes
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    
    # Random split
    import torch
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size], generator=torch.Generator().manual_seed(42))
    
    # Apply specific transforms
    # Since PyTorch random_split wraps datasets, we need to hack the transform or recreate datasets using subsets.
    # A standard way is to create a wrapper class.
    class DatasetWrapper(torch.utils.data.Dataset):
        def __init__(self, subset, transform=None):
            self.subset = subset
            self.transform = transform
            
        def __getitem__(self, index):
            x, y = self.subset[index]
            if self.transform:
                # subset[index] returns the PIL Image and label, but only if the underlying ImageFolder transform doesn't override it.
                # So we initialize ImageFolder without transforms.
                pass
            return x, y # We will handle transform properly below
            
        def __len__(self):
            return len(self.subset)

    # Correct way to handle transforms with random_split:
    dataset_train = datasets.ImageFolder(root=config.DATASET_PATH, transform=train_transform)
    dataset_val = datasets.ImageFolder(root=config.DATASET_PATH, transform=val_transform)
    
    # Get indices
    indices = torch.randperm(len(full_dataset)).tolist()
    train_dataset = torch.utils.data.Subset(dataset_train, indices[:train_size])
    val_dataset = torch.utils.data.Subset(dataset_val, indices[train_size:])

    train_loader = DataLoader(train_dataset, batch_size=config.BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=config.BATCH_SIZE, shuffle=False, num_workers=4)

    return train_loader, val_loader, class_names
