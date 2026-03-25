import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import './styles/theme.css';
import './styles/globals.css';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{ flexGrow: 1, padding: 0, overflowY: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        {currentView === 'dashboard' ? (
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <Dashboard onNavigate={setCurrentView} />
          </div>
        ) : currentView === 'chat' ? (
          <Chat />
        ) : (
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
            <h1>Hermes Desktop App</h1>
            <p>Welcome to the production-ready interface.</p>
            <p>Current View: <strong>{currentView}</strong></p>
            <button
              className="theme-transition"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '16px'
              }}
              onClick={() => window.api?.ping().then(console.log)}
            >
              Ping Main Process
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
