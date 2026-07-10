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
    <div className="dashboard-layout">
      
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ width: '32px', height: '32px', background: '#2563eb', borderRadius: '8px' }}></div>
          IT ASSET MGT
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            Assets Inventory
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Directory
          </button>
          <button 
            className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            System Logs
          </button>
        </nav>
      </aside>

      {/* MAIN RIGHT PANEL */}
      <main className="main-panel">
        
        {/* TOP NAVBAR */}
        <header className="topbar">
          <div style={{ color: '#94a3b8' }}>Search placeholder...</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '14px' }}>{currentUser.name}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>{currentUser.role}</div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: '#ef4444' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="content-scroll">
          
          <div className="header-section">
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#0f172a' }}>IT Asset Management</h1>
              <p style={{ margin: 0, color: '#64748b' }}>Enterprise resource tracking and infrastructure administration.</p>
            </div>
          </div>

          {/* DYNAMIC COMPONENT RENDERING */}
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <AddAsset onAssetAdded={() => setRefreshTrigger(prev => prev + 1)} />
              <AssetList refreshTrigger={refreshTrigger} currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'users' && <UserList />}
          {activeTab === 'logs' && <AuditLogs />}

        </div>
      </main>

    </div>
  );
}

export default App;