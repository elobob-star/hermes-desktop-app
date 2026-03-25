import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Chat } from '../Chat';

describe('Chat Component', () => {
  beforeEach(() => {
    // Mock scrollIntoView which is not implemented in JSDOM
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial welcome message and input area', () => {
    render(<Chat />);

    // Check for welcome message
    expect(screen.getByText("Hello! I'm Hermes. How can I help you today?")).toBeInTheDocument();

    // Check for input area
    expect(screen.getByPlaceholderText('Message Hermes...')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('allows typing and sending a message', async () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');
    const sendButton = screen.getByLabelText('Send message');

    // Button should be disabled initially
    expect(sendButton).toBeDisabled();

    // Type a message
    fireEvent.change(input, { target: { value: 'Test message' } });

    // Button should be enabled now
    expect(sendButton).not.toBeDisabled();

    // Send the message
    fireEvent.click(sendButton);

    // Message should be displayed and input cleared
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(input).toHaveValue('');

    // Fast-forward timers for the simulated reply
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Simulated reply should appear
    await waitFor(() => {
      expect(screen.getByText(/I received your message: "Test message"/)).toBeInTheDocument();
    });
  });

  it('allows sending a message using the Enter key', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');

    // Type a message
    fireEvent.change(input, { target: { value: 'Test Enter key' } });

    // Press Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    // Message should be displayed
    expect(screen.getByText('Test Enter key')).toBeInTheDocument();
  });

  it('does not send a message when Shift+Enter is pressed', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');

    // Type a message
    fireEvent.change(input, { target: { value: 'Multiline\nText' } });

    // Press Shift+Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });

    // Message should not be sent (input not cleared)
    expect(input).toHaveValue('Multiline\nText');
  });
});
