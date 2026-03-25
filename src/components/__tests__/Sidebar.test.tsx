import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

describe('Sidebar', () => {
  const defaultProps = {
    currentView: 'dashboard',
    onViewChange: jest.fn(),
    collapsed: false,
    onToggleCollapse: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when expanded', () => {
    render(<Sidebar {...defaultProps} />);

    // Check brand visibility
    expect(screen.getByText('Hermes')).toBeInTheDocument();

    // Check nav items visibility
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('Files')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();

    // Check version
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();

    // Check if correct class is applied
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('sidebar expanded');
  });

  it('renders correctly when collapsed', () => {
    render(<Sidebar {...defaultProps} collapsed={true} />);

    // Brand should not be visible
    expect(screen.queryByText('Hermes')).not.toBeInTheDocument();

    // Nav item labels should not be visible (they are still in DOM but styled with display: none)
    // We can't easily check CSS display none with RTL unless we do computed styles, but we can verify the icons are there.
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();

    // Version label check
    expect(screen.getByText('v1')).toBeInTheDocument();
    expect(screen.queryByText('v1.0.0')).not.toBeInTheDocument();

    // Check if correct class is applied
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('sidebar collapsed');
  });

  it('calls onToggleCollapse when toggle button is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: /collapse sidebar/i });
    fireEvent.click(toggleButton);

    expect(defaultProps.onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it('calls onViewChange when a nav item is clicked', () => {
    render(<Sidebar {...defaultProps} />);

    const settingsButton = screen.getByRole('button', { name: /⚙️ Settings/i });
    fireEvent.click(settingsButton);

    expect(defaultProps.onViewChange).toHaveBeenCalledWith('settings');
  });

  it('applies active class to the current view', () => {
    render(<Sidebar {...defaultProps} currentView="chat" />);

    const chatButton = screen.getByRole('button', { name: /💬 Chat/i });
    expect(chatButton).toHaveClass('active');

    const dashboardButton = screen.getByRole('button', { name: /📊 Dashboard/i });
    expect(dashboardButton).not.toHaveClass('active');
  });
});
