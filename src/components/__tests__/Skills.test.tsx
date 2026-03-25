import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Skills } from '../Skills';

describe('Skills Component', () => {
  it('renders correctly with all mock skills initially', () => {
    render(<Skills />);

    // Check for the search input
    expect(screen.getByPlaceholderText('Search skills...')).toBeInTheDocument();

    // Check for category filter chips
    const categories = ['All', 'Dev', 'Data', 'Media', 'Productivity', 'Research'];
    categories.forEach(category => {
      expect(screen.getAllByText(category)[0]).toBeInTheDocument();
    });

    // Check that skills are rendered
    expect(screen.getByText('Code Review')).toBeInTheDocument();
    expect(screen.getByText('Web Search')).toBeInTheDocument();
    expect(screen.getByText('Generate Image')).toBeInTheDocument();

    // Ensure that run buttons are rendered
    expect(screen.getAllByText('Run').length).toBe(8);
  });

  it('filters skills based on search query', () => {
    render(<Skills />);

    const searchInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(searchInput, { target: { value: 'code' } });

    expect(screen.getByText('Code Review')).toBeInTheDocument();
    expect(screen.queryByText('Web Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Generate Image')).not.toBeInTheDocument();
    expect(screen.getAllByText('Run').length).toBe(1);
  });

  it('filters skills by category chip click', () => {
    render(<Skills />);

    const devChip = screen.getAllByText('Dev')[0];
    fireEvent.click(devChip);

    expect(screen.getByText('Code Review')).toBeInTheDocument();
    expect(screen.getByText('Terminal Execution')).toBeInTheDocument();
    expect(screen.getByText('Test API')).toBeInTheDocument();
    expect(screen.queryByText('Web Search')).not.toBeInTheDocument();
    expect(screen.queryByText('Generate Image')).not.toBeInTheDocument();
    expect(screen.getAllByText('Run').length).toBe(3);
  });

  it('displays empty state when no skills match criteria', () => {
    render(<Skills />);

    const searchInput = screen.getByPlaceholderText('Search skills...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent skill name that will not match' } });

    expect(screen.getByText('No skills found matching your criteria.')).toBeInTheDocument();
    expect(screen.queryAllByText('Run').length).toBe(0);
  });
});
