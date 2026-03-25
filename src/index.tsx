import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/theme.css';
import './styles/globals.css';
import { Header } from './components/Header';

const App = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', margin: 0, padding: 0, backgroundColor: 'var(--bg-primary)' }}>
      <Header title="Hermes Desktop App" />
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <p style={{ color: 'var(--text-primary)' }}>Welcome to the production-ready interface.</p>
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
          onClick={() => window.api?.invoke('ping').then(console.log)}
        >
          Ping Main Process
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
