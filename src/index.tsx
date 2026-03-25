import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Chat } from './components/Chat';
import { Terminal } from './components/Terminal';
import { Skills } from './components/Skills';
import './styles/theme.css';
import './styles/globals.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const getTitleForView = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'chat': return 'Chat';
      case 'terminal': return 'Terminal';
      case 'files': return 'Files';
      case 'skills': return 'Skills';
      case 'settings': return 'Settings';
      default: return 'Hermes';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'chat':
        return <Chat />;
      case 'terminal':
        return <Terminal />;
      case 'skills':
        return <Skills />;
      case 'settings':
        return (
          <div className="settings-view" style={{ padding: '24px' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Settings</h2>
            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '20px', 
              borderRadius: '8px',
              color: 'var(--text-secondary)'
            }}>
              <p>Settings panel coming soon...</p>
              <p style={{ marginTop: '12px', fontSize: '14px', opacity: 0.7 }}>
                Configure Hermes connection, themes, and preferences.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="placeholder-view" style={{ padding: '24px', color: 'var(--text-primary)' }}>
            <h2>{getTitleForView(currentView)}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>This view is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        currentView={currentView}
        onViewChange={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div style={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <Header
          title={getTitleForView(currentView)}
          onSettingsClick={() => handleNavigate('settings')}
        />
        <main style={{ 
          flexGrow: 1, 
          overflow: 'auto',
          backgroundColor: 'var(--bg-primary)'
        }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
