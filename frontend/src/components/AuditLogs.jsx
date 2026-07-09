import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest 50 logs from the backend we built yesterday
    axios.get(`${import.meta.env.VITE_API_URL}/api/audit`)
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching audit logs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading system logs...</p>;

  return (
    <div className="card" style={{ padding: '24px', marginTop: '10px' }}>
      <h2 style={{ color: '#0f172a', marginTop: 0, marginBottom: '20px' }}>📜 System Audit Trail</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>A secure, immutable record of recent administrative actions.</p>

      <div style={{ overflowX: 'auto' }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>No system actions have been logged yet.</p>
          </div>
        ) : (
          <table className="custom-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', color: '#64748b' }}>Log ID</th>
                <th style={{ padding: '12px', color: '#64748b' }}>Timestamp</th>
                <th style={{ padding: '12px', color: '#64748b' }}>Admin User</th>
                <th style={{ padding: '12px', color: '#64748b' }}>Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>#{log.id}</td>
                  <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>{log.admin_name}</td>
                  <td style={{ padding: '12px', color: '#0f172a' }}>{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;