import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="top-header">
      <div className="status-indicator">
        <div className="status-dot"></div>
        Connected to Hermes
      </div>
      <div className="header-actions">
        <button className="icon-button" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="icon-button" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.67 14.1 19.83 13.08 19.83 12C19.83 10.92 19.67 9.89 19.4 9H21C21.38 9 21.7 8.76 21.82 8.4C21.93 8.04 21.84 7.64 21.57 7.37L20.16 5.96C19.89 5.69 19.49 5.6 19.13 5.71C18.77 5.82 18.53 6.14 18.53 6.53V8C17.63 7.73 16.61 7.57 15.53 7.57V6C15.53 5.62 15.29 5.3 14.93 5.18C14.57 5.07 14.17 5.16 13.9 5.43L12.49 6.84C12.22 7.11 12.13 7.51 12.24 7.87C12.35 8.23 12.67 8.47 13.06 8.47H14.6C14.87 9.37 15.03 10.39 15.03 11.47C15.03 12.55 14.87 13.57 14.6 14.47H13.06C12.68 14.47 12.36 14.71 12.25 15.07C12.14 15.43 12.23 15.83 12.5 16.1L13.91 17.51C14.18 17.78 14.58 17.87 14.94 17.76C15.3 17.65 15.54 17.33 15.54 16.94V15.4C16.44 15.67 17.46 15.83 18.54 15.83V17.37C18.54 17.75 18.78 18.07 19.14 18.19C19.5 18.3 19.9 18.21 20.17 17.94L21.58 16.53C21.85 16.26 21.94 15.86 21.83 15.5C21.72 15.14 21.4 14.9 21.01 14.9H19.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.6 9C4.33 9.9 4.17 10.92 4.17 12C4.17 13.08 4.33 14.11 4.6 15H3C2.62 15 2.3 15.24 2.18 15.6C2.07 15.96 2.16 16.36 2.43 16.63L3.84 18.04C4.11 18.31 4.51 18.4 4.87 18.29C5.23 18.18 5.47 17.86 5.47 17.47V16C6.37 16.27 7.39 16.43 8.47 16.43V17.97C8.47 18.35 8.71 18.67 9.07 18.79C9.43 18.9 9.83 18.81 10.1 18.54L11.51 17.13C11.78 16.86 11.87 16.46 11.76 16.1C11.65 15.74 11.33 15.5 10.94 15.5H9.4C9.13 14.6 8.97 13.58 8.97 12.5C8.97 11.42 9.13 10.4 9.4 9.5H10.94C11.32 9.5 11.64 9.26 11.75 8.9C11.86 8.54 11.77 8.14 11.5 7.87L10.09 6.46C9.82 6.19 9.42 6.1 9.06 6.21C8.7 6.32 8.46 6.64 8.46 7.03V8.57C7.56 8.3 6.54 8.14 5.46 8.14V6.6C5.46 6.22 5.22 5.9 4.86 5.78C4.5 5.67 4.1 5.76 3.83 6.03L2.42 7.44C2.15 7.71 2.06 8.11 2.17 8.47C2.28 8.83 2.6 9.07 2.99 9.07H4.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
