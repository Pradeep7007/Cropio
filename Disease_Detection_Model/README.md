# Plant Disease Detection Model

This repository contains the complete PyTorch implementation for training and deploying a Plant Disease Detection Machine Learning model. 

It uses Transfer Learning (EfficientNet/ResNet) and applies robust data augmentation to achieve high accuracy. It also includes an API built with FastAPI to serve the model to the frontend application.

## 1. Setup Environment

Ensure you have Python 3.9+ installed.

```bash
cd Disease_Detection_Model
pip install -r requirements.txt
```

## 2. Dataset Preparation

We recommend using the **PlantVillage** dataset or **PlantDoc**.
1. Download the dataset (e.g., from Kaggle: `kaggle datasets download -d abdallahalbin/plantvillage-dataset`).
2. Extract the dataset into the `dataset/PlantVillage/` directory.

The folder structure should look like this:
```
Disease_Detection_Model/
│
├── dataset/
│   └── PlantVillage/
│       ├── Tomato_Late_blight/
│       ├── Tomato_healthy/
│       ├── Apple_scab/
│       └── ...
```

## 3. Train the Model

To train the EfficientNet model using Transfer Learning, run:

```bash
python train.py
```

*This will automatically split the dataset (80% train, 20% validation), apply data augmentations (flip, rotation, color jitter), and train the model for the configured number of epochs. The best model weights will be saved to `saved_models/disease_model.pth` along with a `class_names.json`.*

## 4. Run the API Server

Once the model is trained, you can start the FastAPI backend server to serve predictions to your frontend:

```bash
python app.py
```

The server will start at `http://0.0.0.0:8000`.

### Features of the API:
* **Validation:** Rejects files that are not valid images, and contains placeholder logic to reject out-of-distribution (OOD) non-plant images.
* **Inference:** Passes the image through the trained model to predict the disease.
* **Enrichment:** Maps the raw class label to a rich database containing descriptions, causes, treatments, and organic options.
* **Fallback Simulation:** If the model weights are not found, the API gracefully falls back to a simulated inference mode so your frontend doesn't break while you wait for training to finish.
