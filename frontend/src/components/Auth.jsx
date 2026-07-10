import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Auth({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  // ✅ FIX: Only one formData declaration, now including companyName!
  const [formData, setFormData] = useState({ name: '', email: '', password: '', companyName: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        // 🔐 Attempt Login
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        
        // Save the digital ID card (JWT) to the browser's local storage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Unlock the dashboard!
        onLogin(res.data.user);
      } else {
        // 🆕 Attempt Registration (Now sending companyName too!)
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
        alert('Enterprise workspace created successfully! Please log in.');
        setIsLoginMode(true); // Switch back to the login view
        setFormData({ name: '', email: '', password: '', companyName: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred connecting to the server.');
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE: Branding */}
      <div className="auth-branding">
        <div className="step-indicator-container">
          <span 
            className={`step-btn ${isLoginMode ? 'active' : 'inactive'}`}
            onClick={() => { setIsLoginMode(true); setError(''); }}
          >
            Step 1: User Login
          </span>
          <span className="step-divider">/</span>
          <span 
            className={`step-btn ${!isLoginMode ? 'active' : 'inactive'}`}
            onClick={() => { setIsLoginMode(false); setError(''); }}
          >
            Step 2: Admin Registration
          </span>
        </div>
        <h1>IT ASSET<br/>MANAGEMENT<br/>SYSTEM</h1>
        <p>Enterprise resource tracking and infrastructure administration.</p>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="auth-form-wrapper">
        <div className="auth-card">
          <h2>System Access</h2>
          
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            
            {/* ✅ FIX: Dynamically show both Company and Admin Name fields when registering */}
            {!isLoginMode && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Company / Workspace Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Acme Corp"
                    required 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Admin Full Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Aarya"
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="user@company.com"
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                required 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button type="submit" className="btn-action" style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '12px', fontSize: '16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
              {isLoginMode ? 'Authenticate' : 'Create Account'}
            </button>
          </form>

          <p className="toggle-text">
            {isLoginMode ? 'Need an account? ' : 'Already have an account? '}
            <span 
              className="toggle-link" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(''); // Clears any error when switching modes
              }}
            >
              {isLoginMode ? 'Register here' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;