// Home.js
import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setResult(response.data);
    } catch (err) {
      setResult({ error: 'Failed to get prediction' });
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
        {image ? 'Change Image' : 'Choose Image'}
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      {image && (
        <p style={styles.filename}>
          Selected file: <strong>{image.name}</strong>
        </p>
      )}

      {preview && <img src={preview} alt="preview" style={styles.preview} />}
      <button onClick={handleSubmit} disabled={loading} style={styles.button}>
        {loading ? 'Analyzing...' : 'Predict'}
      </button>

      {result && (
        <div style={styles.result}>
          {result.error ? (
            <p style={styles.error}>{result.error}</p>
          ) : (
            <>
              <h2 style={styles.outcome}>
                Result: <span style={{ color: result.result === "Malignant" ? "red" : "green" }}>{result.result}</span>
              </h2>
              <p>Confidence: <strong>{result.confidence}%</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
    container: {
      padding: '2rem',
      maxWidth: '500px',
      margin: 'auto',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      backgroundColor: '#222',
      borderRadius: '12px',
      boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    logo: {
      width: '100px',
      height: '100px',
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#4da6ff',
    },
    uploadLabel: {
      display: 'inline-block',
      padding: '0.6rem 1.2rem',
      fontSize: '1rem',
      backgroundColor: '#333',
      border: '2px dashed #4da6ff',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '1rem',
      color: '#aaa',
    },
    filename: {
      marginTop: '0.5rem',
      fontSize: '0.9rem',
      color: '#ccc',
      wordBreak: 'break-all',
    },
    preview: {
      width: '100%',
      height: 'auto',
      marginTop: '1rem',
      borderRadius: '8px',
      objectFit: 'cover',
      border: '1px solid #444',
      maxHeight: '250px',
    },
    button: {
      display: 'block', 
      margin: '1rem auto',
      padding: '0.6rem 1.2rem',
      fontSize: '1rem',
      border: 'none',
      backgroundColor: '#4da6ff',
      color: '#fff',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
    },
    buttonActive: {
      backgroundColor: '#005bb5', // Darker color when clicked
    },
    result: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#333',
      borderRadius: '8px',
      border: '1px solid #4da6ff',
      color: '#eee',
    },
    outcome: {
      fontSize: '1.4rem',
    },
    error: {
      color: 'red',
    }
  };
  

export default Home;
