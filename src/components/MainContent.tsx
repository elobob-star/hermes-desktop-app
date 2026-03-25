import React from 'react';

const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <section className="content-section">
        <h2>Active Task</h2>
        <div className="placeholder-card">
          Visualizing agent activity...
        </div>
      </section>

      <section className="content-section">
        <h2>Recent Activity</h2>
        <div className="placeholder-card placeholder-card--tall">
          Terminal output and session history will appear here.
        </div>
      </section>

      <section className="content-section">
        <h2>Context</h2>
        <div className="placeholder-card">
          Memory and active context...
        </div>
      </section>
    </main>
  );
};

export default MainContent;
