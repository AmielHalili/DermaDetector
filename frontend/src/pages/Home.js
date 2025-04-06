// Home.js
import React, { useState } from "react";
import MapComponent from "../components/mapComponent";
import axios from "axios";


const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  


function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData
      );
      setResult(response.data);
      
      const imageData = await toBase64(image);

    const stored = JSON.parse(localStorage.getItem("derma_history")) || [];
    const newEntry = {
    image: imageData,
    result: response.data.result,
    confidence: response.data.confidence,
    timestamp: new Date().toLocaleString()
    };
    localStorage.setItem("derma_history", JSON.stringify([newEntry, ...stored]));

    

    } catch (err) {
      setResult({ error: "Failed to get prediction" });
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>DermaDetect</h1>
      </div>

      <label htmlFor="image-upload" style={styles.uploadLabel}>
        {image ? "Change Image" : "Choose Image"}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      {image && (
        <p style={styles.filename}>
          Selected file: <strong>{image.name}</strong>
        </p>
      )}

      {preview && <img src={preview} alt="preview" style={styles.preview} />}
      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? "Analyzing..." : "Predict"}
      </button>

      {result && (
        <div style={styles.result}>
          {result.error ? (
            <p style={styles.error}>{result.error}</p>
          ) : (
            <>
              <h2 style={styles.outcome}>
                Result:{" "}
                <span
                  style={{
                    color: result.result === "Malignant" ? "red" : "green",
                  }}
                >
                  {result.result}
                </span>
              </h2>
              <p>
                Confidence: <strong>{result.confidence}%</strong>
              </p>
            </>
          )}
        </div>
      )}
      {result?.result === "Malignant" && (
        <div style={{ marginTop: "1.5rem", textAlign: "left", color: "#eee" }}>
          <h3 style={{ color: "#ff4d4d" }}>Next Steps</h3>
          <ul style={{ paddingLeft: "1.2rem", lineHeight: "1.8" }}>
            <li>Don't panic, this is just a prediction, not a diagnosis.</li>
            <li>
              We recommend visiting a certified dermatologist for a full
              evaluation.
            </li>
            <li>
              Take note of any changes in the affected area (size, color,
              shape).
            </li>
            <li>
              Bring this result and the original photo to your appointment if
              possible.
            </li>
          </ul>

          <h3 style={{ color: "#4da6ff", marginTop: "1.5rem" }}>
            Dermatologists Near You
          </h3>
          <MapComponent />
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.2rem",
              fontSize: "1rem",
              backgroundColor: "#666",
              color: "#fff",
              border: "1px solid #4da6ff",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {showChat ? "Close Chat" : "Have More Questions?"}
          </button>

          {showChat && (
            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                border: "1px solid #4da6ff",
                padding: "1rem",
                height: "250px",
                overflowY: "auto",
                color: "#ccc",
                fontSize: "0.95rem",
              }}
            >
              <p>
                <strong>AI Assistant:</strong> Hi! I'm your virtual assistant.
                How can I help you with your skin concern today?
              </p>
              <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
                <em>
                  (This is a placeholder chatbox for a future AI-powered
                  assistant.)
                </em>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "500px",
    margin: "auto",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#222",
    borderRadius: "12px",
    boxShadow: "0 0 25px rgba(0, 0, 0, 0.4)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  logo: {
    width: "100px",
    height: "100px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#4da6ff",
  },
  uploadLabel: {
    display: "inline-block",
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    backgroundColor: "#333",
    border: "2px dashed #4da6ff",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "1rem",
    color: "#aaa",
  },
  filename: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    color: "#ccc",
    wordBreak: "break-all",
  },
  preview: {
    width: "100%",
    height: "auto",
    marginTop: "1rem",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #444",
    maxHeight: "250px",
  },
  button: {
    display: "block",
    margin: "1rem auto",
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    border: "none",
    backgroundColor: "#4da6ff",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  buttonActive: {
    backgroundColor: "#005bb5", // Darker color when clicked
  },
  result: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#333",
    borderRadius: "8px",
    border: "1px solid #4da6ff",
    color: "#eee",
  },
  outcome: {
    fontSize: "1.4rem",
  },
  error: {
    color: "red",
  },
};

export default Home;
