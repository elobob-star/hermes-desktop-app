import React, { useMemo } from 'react';
import { useHermes } from '../hooks/useHermes';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const mockActivity = [
  { id: 1, type: 'System', time: '10:45 AM', preview: 'Hermes agent connected successfully.' },
  { id: 2, type: 'Command', time: '10:42 AM', preview: 'Executed "ls -la" in ~/Projects' },
  { id: 3, type: 'Chat', time: '09:30 AM', preview: 'Started a new conversation with Hermes.' },
  { id: 4, type: 'Skill', time: 'Yesterday', preview: 'Installed "Python Data Analysis" skill.' },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { status, loading, error } = useHermes();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const getConnectionStatus = () => {
    if (loading) return { state: 'stopped', text: 'Loading...' };
    if (error) return { state: 'disconnected', text: 'Error connecting' };
    if (!status) return { state: 'disconnected', text: 'Status unknown' };

    if (status.installed && status.running) return { state: 'connected', text: 'Connected' };
    if (status.installed) return { state: 'stopped', text: 'Stopped' };
    return { state: 'disconnected', text: 'Not found' };
  };

  const connection = getConnectionStatus();

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h2>{greeting}, Commander</h2>
        <p>System is ready. What would you like to do today?</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <div className="action-card" onClick={() => onNavigate('chat')}>
              <span className="action-icon">💬</span>
              <h4 className="action-title">New Chat</h4>
              <p className="action-desc">Start a conversation with Hermes.</p>
            </div>
            <div className="action-card" onClick={() => onNavigate('terminal')}>
              <span className="action-icon">💻</span>
              <h4 className="action-title">Run Command</h4>
              <p className="action-desc">Execute system commands.</p>
            </div>
            <div className="action-card" onClick={() => onNavigate('skills')}>
              <span className="action-icon">⚡</span>
              <h4 className="action-title">Browse Skills</h4>
              <p className="action-desc">Manage Hermes capabilities.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>System Status</h3>
          <div className="status-content">
            <div className="status-header">
              <div className={`status-indicator ${connection.state}`}></div>
              <span className={`status-text ${connection.state}`}>
                {connection.text}
              </span>
            </div>

            {status && (
              <div className="status-details">
                <div className="status-detail-item">
                  <span className="status-detail-label">Executable:</span>
                  <span className="status-detail-value">{status.paths.executable || 'Not detected'}</span>
                </div>
                <div className="status-detail-item">
                  <span className="status-detail-label">Config:</span>
                  <span className="status-detail-value">{status.paths.config || 'Not detected'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-panel" style={{ gridColumn: '1 / -1' }}>
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            {mockActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <div className="activity-content">
                  <div className="activity-type">{activity.type}</div>
                  <p className="activity-preview">{activity.preview}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
