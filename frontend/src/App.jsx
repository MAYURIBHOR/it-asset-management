import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import AssetList from './components/AssetList';
import AddAsset from './components/AddAsset';
import AuditLogs from './components/AuditLogs';
import UserList from './components/UserList';

function App() {
  // 🔐 Security State
  const [currentUser, setCurrentUser] = useState(null);
  
  // 🧭 UI Navigation State
  const [activeTab, setActiveTab] = useState('assets');
  
  // 🔄 Refresh State (Tells the table to update when a new asset is added)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 🕵️‍♂️ Check for an active session when the browser reloads
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // 🚪 Secure Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // 🛑 THE SECURITY GATEKEEPER
  // If nobody is logged in, completely hide the dashboard and show the Auth screen.
  if (!currentUser) {
    return <Auth onLogin={(user) => setCurrentUser(user)} />;
  }

  // ✅ IF LOGGED IN, RENDER THE FULL ENTERPRISE DASHBOARD
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* 🎩 Main Header & User Info */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>IT Asset Management</h1>
          <p style={{ margin: 0, color: '#64748b' }}>Enterprise resource tracking and infrastructure administration.</p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 12px 0', fontWeight: 'bold', color: '#0f172a' }}>
            👤 {currentUser.name} <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '14px' }}>({currentUser.role})</span>
          </p>
          <button 
            onClick={handleLogout} 
            className="btn-action" 
            style={{ backgroundColor: '#ef4444', color: 'white', padding: '8px 16px' }}
          >
            🚪 Secure Logout
          </button>
        </div>
      </header>

      {/* 🗺️ Navigation Tabs */}
      <div style={{ borderBottom: '2px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => setActiveTab('assets')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'assets' ? '#0f172a' : 'transparent', 
            color: activeTab === 'assets' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          Assets Inventory
        </button>

        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'users' ? '#0f172a' : 'transparent', 
            color: activeTab === 'users' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          User Directory
        </button>

        <button 
          onClick={() => setActiveTab('logs')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: activeTab === 'logs' ? '#0f172a' : 'transparent', 
            color: activeTab === 'logs' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          System Logs
        </button>
      </div>

      {/* 📦 Main Content Routing */}
      <main>
        {activeTab === 'assets' && (
          <>
            <AddAsset onAssetAdded={() => setRefreshTrigger(prev => prev + 1)} />
            <AssetList refreshTrigger={refreshTrigger} currentUser={currentUser} />
          </>
        )}

        {activeTab === 'users' && <UserList />}

        {activeTab === 'logs' && <AuditLogs />}
      </main>

    </div>
  );
}

export default App;