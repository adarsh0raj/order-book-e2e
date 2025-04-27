import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './components/Auth/Auth';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is already authenticated (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  
  return (
    <BrowserRouter>
      <div className="app">
        {/* Header/Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <a className="navbar-brand" href="/">
              <i className="bi bi-bar-chart-fill me-2"></i>
              Order Book App
            </a>
            
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              {isAuthenticated && (
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" href="/">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/orders">My Orders</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/trades">Trade History</a>
                  </li>
                </ul>
              )}
              
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <span className="text-light me-3 d-none d-md-block">
                    <i className="bi bi-person-circle me-1"></i> 
                    Welcome back
                  </span>
                  <button 
                    className="navbar-button"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </div>
              ) : (
                <div className="ms-auto">
                  <button className="navbar-button">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="main-content py-4">
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Auth onLogin={handleLogin} />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="footer text-center py-3">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-4 text-md-start mb-3 mb-md-0">
                <h5 className="mb-0">Order Book App</h5>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <span>&copy; 2025 All Rights Reserved</span>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="social-links">
                  <a href="#" className="me-3"><i className="bi bi-github"></i></a>
                  <a href="#" className="me-3"><i className="bi bi-twitter"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
