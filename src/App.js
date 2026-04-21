import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import VideosPage from './pages/VideosPage';
import ProductsPage from './pages/ProductsPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import AutomationPage from './pages/AutomationPage';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        console.log('✓ Connected to API');
      }
    } catch (error) {
      console.error('API connection failed:', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Navigation token={token} user={user} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/auth" element={<AuthPage setToken={setToken} setUser={setUser} />} />
            <Route path="/dashboard" element={token ? <DashboardPage user={user} /> : <Navigate to="/auth" replace />} />
            <Route path="/automation" element={<AutomationPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
