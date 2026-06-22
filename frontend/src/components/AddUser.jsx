import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email, role };

    axios.post('http://localhost:5000/api/users', newUser)
      .then(() => {
        alert("User added successfully!");
        setName('');
        setEmail('');
        setRole('Student');
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '400px' }}>
      <h3>➕ Add New User</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>
          <strong>Name:</strong>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </label>

        <label>
          <strong>Email:</strong>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
          />
        </label>

        <label>
          <strong>Role:</strong>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '5px' }}>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </label>

        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Add User
        </button>
      </form>
    </div>
  );
}

export default AddUser;