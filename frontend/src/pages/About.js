import React from 'react';

export default function About() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>About DermaDetector</h1>
      <p>
        DermaDetector is an AI-powered web app designed to classify skin lesions as benign or malignant using image recognition technology. It leverages deep learning and medical data to provide fast and informative results. This project was built to help demonstrate the potential of machine learning in healthcare.
      </p>
      <p>
        <strong>Disclaimer:</strong> This is a proof-of-concept and should not be used for actual diagnosis.
      </p>
    </div>
  );
}
