import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">Order Book App</a>
            
            {isAuthenticated && (
              <button 
                className="btn btn-outline-light ms-auto"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
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
        <footer className="footer text-center py-3 bg-light">
          <div className="container">
            <span className="text-muted">Order Book Web Application &copy; 2025</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
