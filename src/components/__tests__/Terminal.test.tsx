import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Terminal } from '../Terminal';

describe('Terminal Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly with initial message', () => {
    render(<Terminal />);
    expect(screen.getByText('Hermes Terminal v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Type "help" for a list of available commands.')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles input and mock command "help"', async () => {
    render(<Terminal />);

    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    expect(input).toHaveValue('');
    expect(screen.getByText('help')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    // Check if the output contains part of the help text
    expect(screen.getByText(/Available commands:/)).toBeInTheDocument();
  });

  it('clears terminal output when clear button is clicked', async () => {
    render(<Terminal />);

    expect(screen.getByText('Hermes Terminal v1.0.0')).toBeInTheDocument();

    const clearButton = screen.getByText('Clear');

    await act(async () => {
      fireEvent.click(clearButton);
    });

    expect(screen.queryByText('Hermes Terminal v1.0.0')).not.toBeInTheDocument();
  });

  it('clears terminal output when "clear" command is typed', async () => {
    render(<Terminal />);

    expect(screen.getByText('Hermes Terminal v1.0.0')).toBeInTheDocument();

    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'clear' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
      jest.advanceTimersByTime(100);
    });

    expect(screen.queryByText('Hermes Terminal v1.0.0')).not.toBeInTheDocument();
  });

  it('navigates history with ArrowUp and ArrowDown', async () => {
    render(<Terminal />);

    const input = screen.getByRole('textbox');

    // Enter first command
    await act(async () => {
      fireEvent.change(input, { target: { value: 'cmd1' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // Enter second command
    await act(async () => {
      fireEvent.change(input, { target: { value: 'cmd2' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    // Press ArrowUp once -> should show cmd2
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    });
    expect(input).toHaveValue('cmd2');

    // Press ArrowUp again -> should show cmd1
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    });
    expect(input).toHaveValue('cmd1');

    // Press ArrowDown -> should show cmd2
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    });
    expect(input).toHaveValue('cmd2');

    // Press ArrowDown again -> should clear input
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    });
    expect(input).toHaveValue('');
  });

  it('copies output to clipboard', async () => {
    render(<Terminal />);

    const copyButton = screen.getByText('Copy Output');

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
