import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';
import './App.css';


function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Logo" style={styles.logo} />
          <span style={styles.logoText}>DermaDetect</span>
        </div>
        <div style={styles.navLinks}>
        <NavLink to="/" style={styles.link} className={({ isActive }) => `navlink-hover ${isActive ? 'nav-active' : ''}`}>Home</NavLink>
        <NavLink to="/about" style={styles.link} className={({ isActive }) => `navlink-hover ${isActive ? 'nav-active' : ''}`}>About</NavLink>
        <NavLink to="/history" style={styles.link} className={({ isActive }) => `navlink-hover ${isActive ? 'nav-active' : ''}`}>History</NavLink>


        </div>
      </div>

      <div style={styles.page}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: '1rem 2rem',
    borderBottom: '1px solid #2a2a2a',
    boxShadow: '0 2px 10px rgba(0,0,0,0.7)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    height: '100px',
    width: '100px',
  },
  logoText: {
    fontSize: '3rem',
    fontWeight: '600',
    color: '#4da6ff',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1rem',
    color: '#f0f0f0',
    transition: 'color 0.2s ease',
  },
  page: {
    backgroundColor: '#1a1a1a',
    minHeight: '100vh',
    color: '#f0f0f0',
    paddingTop: '2rem',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1rem',
    color: '#f0f0f0',
    paddingBottom: '4px',
  }
  
  
  
};

export default App;
