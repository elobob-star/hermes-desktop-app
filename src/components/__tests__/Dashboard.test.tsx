import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { useHermes } from '../../hooks/useHermes';

// Mock the useHermes hook
jest.mock('../../hooks/useHermes');

describe('Dashboard Component', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders greeting and Quick Actions', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: null,
      loading: false,
      error: null
    });

    render(<Dashboard onNavigate={mockOnNavigate} />);

    expect(screen.getByText(/Commander/i)).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('handles Quick Actions clicks', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: null,
      loading: false,
      error: null
    });

    render(<Dashboard onNavigate={mockOnNavigate} />);

    fireEvent.click(screen.getByText('New Chat'));
    expect(mockOnNavigate).toHaveBeenCalledWith('chat');

    fireEvent.click(screen.getByText('Run Command'));
    expect(mockOnNavigate).toHaveBeenCalledWith('terminal');

    fireEvent.click(screen.getByText('Browse Skills'));
    expect(mockOnNavigate).toHaveBeenCalledWith('skills');
  });

  it('displays correct connection status when connected', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: { installed: true, running: true, paths: { executable: '/usr/bin/hermes', config: '/etc/hermes.json' } },
      loading: false,
      error: null
    });

    render(<Dashboard onNavigate={mockOnNavigate} />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('/usr/bin/hermes')).toBeInTheDocument();
    expect(screen.getByText('/etc/hermes.json')).toBeInTheDocument();
  });
});
