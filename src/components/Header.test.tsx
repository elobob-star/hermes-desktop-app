import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { useHermes } from '../hooks/useHermes';

// Mock the hook
jest.mock('../hooks/useHermes');

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: null,
      loading: false,
    });

    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('shows connecting state', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: null,
      loading: true,
    });

    render(<Header title="Dashboard" />);
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('shows connected state', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: { running: true },
      loading: false,
    });

    render(<Header title="Dashboard" />);
    expect(screen.getByText('Connected')).toBeInTheDocument();
  });

  it('shows disconnected state', () => {
    (useHermes as jest.Mock).mockReturnValue({
      status: { running: false },
      loading: false,
    });

    render(<Header title="Dashboard" />);
    expect(screen.getByText('Disconnected')).toBeInTheDocument();
  });
});
