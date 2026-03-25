import React from 'react';
import './Sidebar.css';

export interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'terminal', label: 'Terminal', icon: '💻' },
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'skills', label: 'Skills', icon: '🧠' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-brand">Hermes</h2>}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed ? (
          <span className="sidebar-version">v1.0.0</span>
        ) : (
          <span className="sidebar-version-collapsed" title="v1.0.0">v1</span>
        )}
      </div>
    </aside>
  );
};
