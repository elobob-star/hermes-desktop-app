import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import './App.css';
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
      default:
        return (
          <div className="placeholder-view">
            <h2>{getTitleForView(currentView)}</h2>
            <p>This view is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container theme-transition">
      <div className="sidebar-container">
        <Sidebar
          currentView={currentView}
          onViewChange={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      <div className="main-container">
        <div className="header-container">
          <Header
            title={getTitleForView(currentView)}
            onSettingsClick={() => handleNavigate('settings')}
          />
        </div>
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
