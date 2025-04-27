import React, { useState, useEffect } from 'react';
import { login, register } from '../../services/api';
import './Auth.css';
import { Form, Button, Alert } from 'react-bootstrap';

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
      }
      
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2 className="text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        
        {!isLogin && (
          <Alert variant="info" className="mb-4 d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-2 fs-5"></i> 
            <span>Create a new account to start trading</span>
          </Alert>
        )}
        
        {error && (
          <Alert variant="danger" className="mb-4 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <span>{error}</span>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit} className="auth-form">
          <Form.Group className="mb-4" controlId="username">
            <Form.Label>Username</Form.Label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-person"></i>
              </span>              <Form.Control
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="border-start-0"
                required
              />
            </div>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-lock"></i>
              </span>              <Form.Control
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-start-0"
                required
              />
            </div>
            {!isLogin && password && (
              <div className="mt-2 d-flex align-items-center">
                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                  <div 
                    className={`progress-bar bg-${
                      getPasswordStrength().strength === 'Strong' ? 'success' : 
                      getPasswordStrength().strength === 'Good' ? 'primary' : 
                      getPasswordStrength().strength === 'Moderate' ? 'warning' : 'danger'
                    }`} 
                    style={{ 
                      width: `${
                        getPasswordStrength().strength === 'Strong' ? '100%' : 
                        getPasswordStrength().strength === 'Good' ? '75%' : 
                        getPasswordStrength().strength === 'Moderate' ? '50%' : '25%'
                      }` 
                    }}
                  />
                </div>
                <span className={`ms-2 small ${getPasswordStrength().color}`}>
                  {getPasswordStrength().strength}
                </span>
              </div>
            )}
          </Form.Group>
          
          {!isLogin && (
            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-shield-lock"></i>
                </span>                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`border-start-0 ${confirmPassword && !passwordsMatch ? 'is-invalid' : ''}`}
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <div className="invalid-feedback">
                    Passwords do not match
                  </div>
                )}
              </div>
            </Form.Group>
          )}
          
          <Button 
            type="submit" 
            className="btn btn-primary w-100 py-3 mt-3"
            disabled={loading || (!isLogin && !passwordsMatch)}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <i className={`bi ${isLogin ? 'bi-box-arrow-in-right' : 'bi-person-plus'} me-2`}></i>
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </Button>
        </Form>
        
        <div className="mt-4 text-center">
          <Button 
            variant="link"
            className="text-decoration-none"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
          </Button>
        </div>
        
        {!isLogin && (
          <div className="mt-4 small text-muted">
            <p className="mb-2">
              <i className="bi bi-shield-check me-2"></i>
              <strong>Password requirements:</strong>
            </p>
            <ul className="ps-4 mb-0">
              <li className="mb-1">At least 8 characters long</li>
              <li>Contains both letters and numbers</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
