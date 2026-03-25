import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Chat } from '../Chat';

describe('Chat Component', () => {
  beforeAll(() => {
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders initial welcome message', () => {
    render(<Chat />);
    expect(screen.getByText('Hello! I am Hermes. How can I help you today?')).toBeInTheDocument();
  });

  it('allows user to type and send a message', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');
    const sendButton = screen.getByTitle('Send Message');

    // Type a message
    fireEvent.change(input, { target: { value: 'Test message from user' } });
    expect(input).toHaveValue('Test message from user');

    // Send message
    fireEvent.click(sendButton);

    // Input should be cleared and message should be in the list
    expect(input).toHaveValue('');
    expect(screen.getByText('Test message from user')).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<Chat />);

    const sendButton = screen.getByTitle('Send Message');
    expect(sendButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Message Hermes...');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(sendButton).toBeDisabled();

    fireEvent.change(input, { target: { value: 'Valid message' } });
    expect(sendButton).not.toBeDisabled();
  });

  it('sends message on Enter key (without shift)', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');

    fireEvent.change(input, { target: { value: 'Keyboard test' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(screen.getByText('Keyboard test')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('adds a new line on Shift+Enter instead of sending', () => {
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');

    fireEvent.change(input, { target: { value: 'Line 1\nLine 2' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    expect(input).toHaveValue('Line 1\nLine 2');
    expect(screen.queryByText('Line 1\nLine 2')).not.toBeInTheDocument();
  });

  it('simulates assistant response after a user message', () => {
    jest.useFakeTimers();
    render(<Chat />);

    const input = screen.getByPlaceholderText('Message Hermes...');
    const sendButton = screen.getByTitle('Send Message');

    fireEvent.change(input, { target: { value: 'Hello Hermes' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello Hermes')).toBeInTheDocument();

    // Fast-forward the timeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('I understand. I am currently a simulated assistant, so I cannot perform complex actions just yet.')).toBeInTheDocument();

    jest.useRealTimers();
  });
});
