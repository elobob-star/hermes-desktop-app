import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <MainContent />
      </div>
    </div>
  );
};

export default App;
