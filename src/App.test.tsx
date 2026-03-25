import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByText('Hermes Desktop App')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the production-ready interface.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ping Main Process' })).toBeInTheDocument();
  });
});
