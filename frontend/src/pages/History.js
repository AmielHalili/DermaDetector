import React, { useEffect, useState } from 'react';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("derma_history")) || [];
    setHistory(data);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("derma_history");
    setHistory([]);
  };

  return (
    <div style={styles.container}>
      <h1>Prediction History</h1>

      {history.length === 0 ? (
        <p style={styles.empty}>No predictions yet.</p>
      ) : (
        <>
          <button style={styles.clearBtn} onClick={handleClearHistory}>
            🧹 Clear
          </button>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Result</th>
                <th>Confidence</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.image}
                      alt={`history-${index}`}
                      style={{ width: '200px', height: '150px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </td>
                  <td style={{ color: item.result === "Malignant" ? "red" : "green" }}>{item.result}</td>
                  <td>{item.confidence}%</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    color: '#f0f0f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  empty: {
    marginTop: '1rem',
    color: '#888',
  },
  clearBtn: {
    margin: '1rem 0',
    padding: '1rem 1rem',
    backgroundColor: '#4da6ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};
