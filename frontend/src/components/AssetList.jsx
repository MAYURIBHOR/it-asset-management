import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🆕 We added `currentUser` to the props so the table knows WHO is making changes!
function AssetList({ refreshTrigger, currentUser }) {
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✏️ Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', category: '', status: '' });

  // 🔍 Search State
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        
        const assetRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/assets`);
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
        setAssets(assetRes.data);
        setUsers(userRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [refreshTrigger]); 

  // --- 📜 AUDIT HELPER FUNCTION ---
  const logAction = (actionMessage) => {
    // Failsafe: if currentUser isn't loaded yet, default to 'System Admin'
    const adminName = currentUser ? currentUser.name : 'System Admin';
    
    axios.post(`${import.meta.env.VITE_API_URL}/api/audit`, {
      admin_name: adminName,
      action: actionMessage
    }).catch(err => console.error("Silent Audit Log Error:", err));
  };

  // --- CRUD FUNCTIONS (Now with Logging!) ---
  const handleDelete = (asset) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
    axios.delete(`${import.meta.env.VITE_API_URL}/api/assets/${asset.id}`)
        .then(() => {
          setAssets(assets.filter(a => a.id !== asset.id));
          
          // 📜 Log the deletion!
          logAction(`Deleted asset: ${asset.name} (ID: ${asset.id})`);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleAssignUser = (asset, userId) => {
    const payload = { user_id: userId ? parseInt(userId) : null };
    
    axios.patch(`http://localhost:5000/api/assets/${asset.id}/assign`, payload)
      .then(() => {
        setAssets(assets.map(a => {
          if (a.id === asset.id) {
            return { ...a, user_id: payload.user_id, status: payload.user_id ? 'Assigned' : 'Available' };
          }
          return a;
        }));

        // 📜 Log the assignment!
        if (userId) {
          // Find the name of the user we just assigned it to
          const assignedUser = users.find(u => u.id === parseInt(userId));
          const targetName = assignedUser ? assignedUser.name : `User ID ${userId}`;
          logAction(`Assigned asset '${asset.name}' to ${targetName}`);
        } else {
          logAction(`Revoked assignment for asset '${asset.name}' (Marked Available)`);
        }
      })
      .catch((error) => console.error("Assignment error:", error));
  };

  const handleEditClick = (asset) => {
    setEditingId(asset.id);
    setEditFormData({ name: asset.name, category: asset.category, status: asset.status });
  };

  const handleSaveClick = (asset) => {
    axios.put(`http://localhost:5000/api/assets/${asset.id}`, editFormData)
      .then(() => {
        setAssets(assets.map((a) => (a.id === asset.id ? { ...a, ...editFormData } : a)));
        setEditingId(null); 
        
        // 📜 Log the edit!
        logAction(`Updated details for asset: ${editFormData.name}`);
      })
      .catch((error) => console.error("Error updating asset:", error));
  };

  // --- 📊 ANALYTICS CALCULATIONS ---
  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.status === 'Available').length;
  const assignedAssets = assets.filter(a => a.status === 'Assigned').length;
  const repairAssets = assets.filter(a => a.status === 'In Repair').length;

  // --- 🔍 SEARCH FILTERING ---
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading inventory assets...</p>;

  return (
    <div style={{ marginTop: '10px' }}>
      
      {/* 📊 ANALYTICS DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', marginBottom: '0' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>TOTAL ASSETS</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalAssets}</p>
        </div>
        <div className="card" style={{ padding: '16px', marginBottom: '0', borderLeft: '4px solid #10b981' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>AVAILABLE</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{availableAssets}</p>
        </div>
        <div className="card" style={{ padding: '16px', marginBottom: '0', borderLeft: '4px solid #f59e0b' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>ASSIGNED</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{assignedAssets}</p>
        </div>
        <div className="card" style={{ padding: '16px', marginBottom: '0', borderLeft: '4px solid #ef4444' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>IN REPAIR</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{repairAssets}</p>
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          className="form-control"
          placeholder="🔍 Search by name, category, or status..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px 14px' }}
        />
      </div>

      {/* 📦 INVENTORY TABLE */}
      <div style={{ overflowX: 'auto' }}>
        {filteredAssets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>No matching assets found.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  
                  {editingId === asset.id ? (
                    <>
                      <td>
                        <input 
                          type="text" 
                          className="form-control"
                          value={editFormData.name} 
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <select className="form-control" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}>
                          <option value="Hardware">Hardware</option>
                          <option value="Software">Software</option>
                          <option value="Network">Network</option>
                        </select>
                      </td>
                      <td>
                        <select className="form-control" value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="In Repair">In Repair</option>
                        </select>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Save to enable assign</span>
                      </td>
                      <td style={{ minWidth: '150px' }}>
                        <button onClick={() => handleSaveClick(asset)} className="btn-action" style={{ backgroundColor: '#10b981', color: 'white' }}>💾 Save</button>
                        <button onClick={() => setEditingId(null)} className="btn-action" style={{ backgroundColor: '#64748b', color: 'white' }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{asset.name}</td>
                      <td>{asset.category}</td>
                      <td>
                        <span className={`badge badge-${asset.status === 'Available' ? 'available' : asset.status === 'Assigned' ? 'assigned' : 'repair'}`}>
                          {asset.status}
                        </span>
                      </td>
                      
                      <td>
                        <select 
                          className="form-control"
                          value={asset.user_id || ''} 
                          onChange={(e) => handleAssignUser(asset, e.target.value)}
                          style={{ padding: '6px', fontSize: '13px' }}
                        >
                          <option value="">-- Unassigned --</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                          ))}
                        </select>
                      </td>

                      <td style={{ minWidth: '160px' }}>
                        <button onClick={() => handleEditClick(asset)} className="btn-action btn-edit">✏️ Edit</button>
                        <button onClick={() => handleDelete(asset)} className="btn-action btn-delete">🗑️ Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AssetList;