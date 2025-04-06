import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
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
    <div className="App" style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h1>DermaDetect</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img src={preview} alt="preview" style={{ width: '100%', marginTop: '1rem' }} />}
      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Analyzing...' : 'Predict'}
      </button>
      {result && (
        <div style={{ marginTop: '1rem' }}>
          {result.error ? (
            <p style={{ color: 'red' }}>{result.error}</p>
          ) : (
            <>
              <h2>Result: {result.result}</h2>
              <p>Confidence: {result.confidence}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
