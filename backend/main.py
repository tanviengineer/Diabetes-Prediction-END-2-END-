from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Diabetes Prediction API",
    description="Machine Learning API for diabetes prediction",
    version="1.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load trained model and scaler
# --------------------------------------------------

model = joblib.load("diabetes_model.pkl")
scaler = joblib.load("scaler.pkl")


# --------------------------------------------------
# Input data structure
# --------------------------------------------------

class DiabetesInput(BaseModel):

    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DPF: float
    Age: int


# --------------------------------------------------
# Home route
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "Diabetes Prediction API is running"
    }


# --------------------------------------------------
# Prediction route
# --------------------------------------------------

@app.post("/predict")
def predict_diabetes(data: DiabetesInput):

    # Create input in the SAME order
    # used during model training

    input_data = np.array([[
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DPF,
        data.Age
    ]])

    # Apply the same scaler used during training

    input_scaled = scaler.transform(input_data)

    # Make prediction

    prediction = model.predict(input_scaled)[0]

    # Convert numpy value to normal Python integer

    prediction = int(prediction)

    # Return result

    if prediction == 1:

        message = "Oops! You have diabetes."

    else:

        message = "Great! You don't have diabetes."

    return {
        "prediction": prediction,
        "message": message
    }
