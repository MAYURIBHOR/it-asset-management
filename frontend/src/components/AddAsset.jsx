import React, { useState } from 'react';
import axios from 'axios';

function AddAsset() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [status, setStatus] = useState('Available');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAsset = { name, category, status };

    axios.post(`${import.meta.env.VITE_API_URL}/api/assets`, newAsset)
      .then(() => {
        alert("Asset successfully registered.");
        setName('');
        setCategory('Hardware');
        setStatus('Available');
      })
      .catch((error) => console.error("Error operationalizing data:", error));
  };

  return (
    <div className="card">
      <h3 className="card-title">Register New Asset</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Asset Identification Name</label>
          <input 
            type="text" 
            className="form-control"
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="e.g., Dell UltraSharp Monitor"
          />
        </div>

        <div className="form-group">
          <label>Asset Classification</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
          </select>
        </div>

        <div className="form-group">
          <label>Initial Lifecycle Status</label>
          <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="In Repair">In Repair</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Save Asset</button>
      </form>
    </div>
  );
}

export default AddAsset;