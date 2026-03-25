import React from 'react';
import './Header.css';
import { useHermes } from '../hooks/useHermes';

interface HeaderProps {
  title: string;
  onSettingsClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSettingsClick }) => {
  const { status, loading } = useHermes();

  let statusText = 'Disconnected';
  let statusClass = 'disconnected';

  if (loading) {
    statusText = 'Connecting...';
    statusClass = 'connecting';
  } else if (status?.running) {
    statusText = 'Connected';
    statusClass = 'connected';
  }

  return (
    <header className="header theme-transition">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="connection-status">
          <div className={`status-dot ${statusClass}`} />
          <span>{statusText}</span>
        </div>

        <button
          className="icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <span className="icon">🔔</span>
        </button>

        <button
          className="icon-button"
          onClick={onSettingsClick}
          aria-label="Settings"
          title="Settings"
        >
          <span className="icon">⚙️</span>
        </button>
      </div>
    </header>
  );
};
