import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock dependencies
jest.mock('./components/Sidebar', () => ({
  Sidebar: ({ currentView, onViewChange, collapsed, onToggleCollapse }: any) => (
    <div data-testid="sidebar">
      <button data-testid="sidebar-dashboard" onClick={() => onViewChange('dashboard')}>Dashboard</button>
      <button data-testid="sidebar-chat" onClick={() => onViewChange('chat')}>Chat</button>
      <button data-testid="sidebar-settings" onClick={() => onViewChange('settings')}>Settings</button>
      <button data-testid="sidebar-toggle" onClick={onToggleCollapse}>
        {collapsed ? 'Expand' : 'Collapse'}
      </button>
      <span data-testid="sidebar-current-view">{currentView}</span>
    </div>
  )
}));

jest.mock('./components/Header', () => ({
  Header: ({ title, onSettingsClick }: any) => (
    <div data-testid="header">
      <span data-testid="header-title">{title}</span>
      <button data-testid="header-settings" onClick={onSettingsClick}>Settings</button>
    </div>
  )
}));

jest.mock('./components/Dashboard', () => ({
  Dashboard: ({ onNavigate }: any) => (
    <div data-testid="dashboard">
      <button data-testid="dashboard-nav-chat" onClick={() => onNavigate('chat')}>Go to Chat</button>
    </div>
  )
}));

describe('App Component', () => {
  it('renders correctly with default dashboard view', () => {
    render(<App />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();

    // Header should have 'Dashboard' title
    expect(screen.getByTestId('header-title')).toHaveTextContent('Dashboard');

    // Sidebar should reflect 'dashboard' as current view
    expect(screen.getByTestId('sidebar-current-view')).toHaveTextContent('dashboard');
  });

  it('navigates to chat view when sidebar chat button is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('sidebar-chat'));

    // Header should update to 'Chat'
    expect(screen.getByTestId('header-title')).toHaveTextContent('Chat');

    // Placeholder text should be shown for unimplemented view
    expect(screen.getByText('This view is under construction.')).toBeInTheDocument();

    // Dashboard should no longer be visible
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  });

  it('navigates to settings when header settings button is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('header-settings'));

    expect(screen.getByTestId('header-title')).toHaveTextContent('Settings');
    expect(screen.getByText('This view is under construction.')).toBeInTheDocument();
  });

  it('navigates when dashboard navigation callback is triggered', () => {
    render(<App />);

    fireEvent.click(screen.getByTestId('dashboard-nav-chat'));

    expect(screen.getByTestId('header-title')).toHaveTextContent('Chat');
  });

  it('toggles sidebar collapsed state', () => {
    render(<App />);

    const toggleButton = screen.getByTestId('sidebar-toggle');

    expect(toggleButton).toHaveTextContent('Collapse');

    fireEvent.click(toggleButton);

    expect(toggleButton).toHaveTextContent('Expand');
  });
});
