import React, { useState, useEffect } from 'react';
import { login, register } from '../../services/api';
import './Auth.css';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  // Clear fields and errors when switching between login and register
  useEffect(() => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setPasswordsMatch(true);
  }, [isLogin]);

  // Check if passwords match when either password or confirmPassword changes
  useEffect(() => {
    if (!isLogin && password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, isLogin]);
  
  // Password strength check
  const getPasswordStrength = (): {strength: string, color: string} => {
    if (!password) return { strength: '', color: '' };
    if (password.length < 6) return { strength: 'Weak', color: 'text-danger' };
    if (password.length < 8) return { strength: 'Moderate', color: 'text-warning' };
    if (password.length >= 8 && /[0-9]/.test(password) && /[a-zA-Z]/.test(password)) {
      return { strength: 'Strong', color: 'text-success' };
    }
    return { strength: 'Good', color: 'text-primary' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!username || !password) {
      setError('Please fill in all required fields');
      return;
    }

    // For registration, validate password confirmation
    if (!isLogin) {
      if (!confirmPassword) {
        setError('Please confirm your password');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
        // After registration, login automatically
      }
      
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">      <div className="auth-form-wrapper">
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        
        {!isLogin && (
          <div className="alert alert-info mb-4">
            <p className="mb-0">
              <i className="bi bi-info-circle-fill me-2"></i> 
              Create a new account to start trading
            </p>
          </div>
        )}
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
            <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {!isLogin && password && (
              <div className="mt-1 small">
                <span>Password strength: </span>
                <span className={getPasswordStrength().color}>
                  {getPasswordStrength().strength}
                </span>
              </div>
            )}
          </div>
          
          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className={`form-control ${confirmPassword && !passwordsMatch ? 'is-invalid' : ''}`}
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              {confirmPassword && !passwordsMatch && (
                <div className="invalid-feedback">
                  Passwords do not match
                </div>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading || (!isLogin && !passwordsMatch)}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
          <div className="mt-3 text-center">
          <button 
            type="button"
            className="btn btn-link text-decoration-none"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        
        {!isLogin && (
          <div className="mt-3 small text-muted">
            <p className="mb-0"><i className="bi bi-info-circle me-1"></i> Password requirements:</p>
            <ul className="ps-3">
              <li>At least 8 characters long</li>
              <li>Contains letters and numbers</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
