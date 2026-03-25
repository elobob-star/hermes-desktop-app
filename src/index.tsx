import React from 'react';
import { createRoot } from 'react-dom/client';

// The main application component
const App = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Hermes Desktop App</h1>
      <p>Welcome to the production-ready interface.</p>
      <button onClick={() => window.api?.ping().then(console.log)}>
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
