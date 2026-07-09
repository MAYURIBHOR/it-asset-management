import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔍 Search State
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all users from the database on load
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  // 📊 Analytics Calculations
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const employeeCount = users.filter(u => u.role !== 'Admin').length;

  // 🔍 Instant Search Filtering
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <p>Loading user directory...</p>;

  return (
    <div style={{ marginTop: '10px' }}>
      
      {/* 📊 ANALYTICS DASHBOARD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px', marginBottom: '0' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>TOTAL USERS</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{totalUsers}</p>
        </div>
        <div className="card" style={{ padding: '16px', marginBottom: '0', borderLeft: '4px solid #8b5cf6' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>SYSTEM ADMINS</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{adminCount}</p>
        </div>
        <div className="card" style={{ padding: '16px', marginBottom: '0', borderLeft: '4px solid #3b82f6' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>STANDARD EMPLOYEES</h4>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{employeeCount}</p>
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          className="form-control"
          placeholder="🔍 Search by name, email, or role..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px 14px' }}
        />
      </div>

      {/* 👥 DIRECTORY TABLE */}
      <div style={{ overflowX: 'auto' }}>
        {filteredUsers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>No matching users found.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email Account</th>
                <th>System Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td style={{ fontWeight: 'bold', color: '#0f172a' }}>{user.name}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>
                    {/* Dynamic color badges based on role! */}
                    <span className="badge" style={{ 
                      backgroundColor: user.role === 'Admin' ? '#ede9fe' : '#dbeafe', 
                      color: user.role === 'Admin' ? '#8b5cf6' : '#3b82f6',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {user.role || 'Employee'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UserList;