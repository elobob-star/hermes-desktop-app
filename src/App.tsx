import React from 'react';
import './styles/theme.css';
import './styles/globals.css';

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

export default App;
