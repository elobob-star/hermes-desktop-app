import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import './styles/globals.css';

const App = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Hermes Desktop App</h1>
      <p>Welcome to the production-ready interface.</p>
      <button
        className="theme-transition"
        style={{
          backgroundColor: 'var(--accent-primary)',
          color: 'var(--text-primary)',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onClick={() => window.api?.ping().then(console.log)}
      >
        Ping Main Process
      </button>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
