import torch
import torch.nn as nn
import torch.optim as optim
from tqdm import tqdm
import os
import json

import config
from dataset import get_dataloaders
from model import get_disease_model

def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")

    # Load data
    print("Loading datasets...")
    train_loader, val_loader, class_names = get_dataloaders()
    num_classes = len(class_names)
    print(f"Found {num_classes} classes: {class_names}")

    # Save class names for inference
    os.makedirs(os.path.dirname(config.MODEL_SAVE_PATH), exist_ok=True)
    with open(os.path.join(os.path.dirname(config.MODEL_SAVE_PATH), "class_names.json"), "w") as f:
        json.dump(class_names, f)

    # Initialize model
    model = get_disease_model(num_classes=num_classes, model_type="efficientnet").to(device)

    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=config.LEARNING_RATE)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.1, patience=2, verbose=True)

    best_acc = 0.0

    print("Starting training...")
    for epoch in range(config.EPOCHS):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        loop = tqdm(train_loader, leave=False, desc=f"Epoch {epoch+1}/{config.EPOCHS} [Train]")
        for images, labels in loop:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

            loop.set_postfix(loss=loss.item(), acc=100.*correct/total)

        train_loss = running_loss / len(train_loader.dataset)
        train_acc = 100. * correct / total

        # Validation phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            val_loop = tqdm(val_loader, leave=False, desc=f"Epoch {epoch+1}/{config.EPOCHS} [Val]")
            for images, labels in val_loop:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()

        val_loss = val_loss / len(val_loader.dataset)
        val_acc = 100. * val_correct / val_total

        print(f"Epoch {epoch+1}/{config.EPOCHS} - Train Loss: {train_loss:.4f} Acc: {train_acc:.2f}% | Val Loss: {val_loss:.4f} Acc: {val_acc:.2f}%")

        scheduler.step(val_acc)

        # Save best model
        if val_acc > best_acc:
            print(f"Validation accuracy improved from {best_acc:.2f}% to {val_acc:.2f}%. Saving model...")
            best_acc = val_acc
            torch.save(model.state_dict(), config.MODEL_SAVE_PATH)

    print(f"Training complete. Best Validation Accuracy: {best_acc:.2f}%")
    print(f"Model saved to {config.MODEL_SAVE_PATH}")

if __name__ == "__main__":
    train()
