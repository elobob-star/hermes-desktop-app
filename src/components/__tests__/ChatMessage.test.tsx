import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChatMessage, Message } from '../ChatMessage';

describe('ChatMessage Component', () => {
  it('renders a user message correctly', () => {
    const mockUserMessage: Message = {
      id: '1',
      role: 'user',
      content: 'Hello, Hermes!',
      timestamp: new Date('2023-01-01T12:00:00Z').getTime(), // Fixed time for deterministic testing
    };

    const { container } = render(<ChatMessage message={mockUserMessage} />);

    // Content should be rendered
    expect(screen.getByText('Hello, Hermes!')).toBeInTheDocument();

    // The wrapper should have the 'user' class
    expect(container.firstChild).toHaveClass('chat-message-wrapper');
    expect(container.firstChild).toHaveClass('user');

    // The inner div should have 'user-message'
    const innerMessage = container.querySelector('.chat-message');
    expect(innerMessage).toHaveClass('user-message');
  });

  it('renders an assistant message correctly', () => {
    const mockAssistantMessage: Message = {
      id: '2',
      role: 'assistant',
      content: 'Hello! I am here to help.',
      timestamp: new Date('2023-01-01T12:01:00Z').getTime(),
    };

    const { container } = render(<ChatMessage message={mockAssistantMessage} />);

    // Content should be rendered
    expect(screen.getByText('Hello! I am here to help.')).toBeInTheDocument();

    // The wrapper should have the 'assistant' class
    expect(container.firstChild).toHaveClass('chat-message-wrapper');
    expect(container.firstChild).toHaveClass('assistant');

    // The inner div should have 'assistant-message'
    const innerMessage = container.querySelector('.chat-message');
    expect(innerMessage).toHaveClass('assistant-message');
  });

  it('renders multiline messages correctly', () => {
    const multilineMessage: Message = {
      id: '3',
      role: 'user',
      content: 'Line 1\nLine 2',
      timestamp: Date.now(),
    };

    render(<ChatMessage message={multilineMessage} />);

    // Should find the text content. Depending on implementation, we check if both lines are rendered.
    expect(screen.getByText('Line 1', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Line 2', { exact: false })).toBeInTheDocument();
  });
});
