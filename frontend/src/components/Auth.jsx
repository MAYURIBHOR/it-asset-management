import React, { useState } from 'react';
import axios from 'axios';

function Auth({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        // 🔐 Attempt Login
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        // Save the digital ID card (JWT) to the browser's local storage
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        // Unlock the dashboard!
        onLogin(res.data.user);
      } else {
        // 🆕 Attempt Registration
        await axios.post('http://localhost:5000/api/auth/register', formData);
        alert('Account created successfully! Please log in.');
        setIsLoginMode(true); // Switch back to the login view
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred connecting to the server.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <h2 style={{ textAlign: 'center', marginTop: 0, color: '#0f172a' }}>
          {isLoginMode ? 'System Access' : 'Register Admin'}
        </h2>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              className="form-control" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-action" style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '12px', fontSize: '16px' }}>
            {isLoginMode ? 'Authenticate' : 'Create Account'}
          </button>
        </form>

        <p 
          style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#3b82f6', fontSize: '14px', fontWeight: 'bold' }} 
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? 'Need an account? Register here' : 'Already have an account? Log in'}
        </p>
      </div>
    </div>
  );
}

export default Auth;