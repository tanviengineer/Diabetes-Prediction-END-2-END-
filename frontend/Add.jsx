import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DPF: "",
    Age: "",
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const predictDiabetes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Pregnancies: Number(formData.Pregnancies),
          Glucose: Number(formData.Glucose),
          BloodPressure: Number(formData.BloodPressure),
          SkinThickness: Number(formData.SkinThickness),
          Insulin: Number(formData.Insulin),
          BMI: Number(formData.BMI),
          DPF: Number(formData.DPF),
          Age: Number(formData.Age),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message);
      } else {
        setResult("Something went wrong. Please check your input.");
      }
    } catch (error) {
      setResult(
        "Cannot connect to the backend. Make sure FastAPI is running."
      );
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🩺 Diabetes Prediction</h1>

        <p className="subtitle">
          Enter your health information to get a prediction.
        </p>

        <form onSubmit={predictDiabetes}>
          <div className="grid">
            <input
              type="number"
              name="Pregnancies"
              placeholder="Pregnancies"
              value={formData.Pregnancies}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="Glucose"
              placeholder="Glucose"
              value={formData.Glucose}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="BloodPressure"
              placeholder="Blood Pressure"
              value={formData.BloodPressure}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="SkinThickness"
              placeholder="Skin Thickness"
              value={formData.SkinThickness}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="Insulin"
              placeholder="Insulin"
              value={formData.Insulin}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              step="0.1"
              name="BMI"
              placeholder="BMI"
              value={formData.BMI}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              step="0.001"
              name="DPF"
              placeholder="Diabetes Pedigree Function"
              value={formData.DPF}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="Age"
              placeholder="Age"
              value={formData.Age}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {loading ? "Predicting..." : "Predict Diabetes"}
          </button>
        </form>

        {result && (
          <div className="result">
            <h2>Prediction Result</h2>
            <p>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
