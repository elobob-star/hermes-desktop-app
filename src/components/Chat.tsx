import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Message } from './ChatMessage';
import { useHermes } from '../hooks/useHermes';
import './Chat.css';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'assistant',
  content: 'Hello! I am Hermes, your AI assistant. How can I help you today?',
  timestamp: Date.now(),
};

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { status, executeCommand } = useHermes();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add a system message about connection status
  useEffect(() => {
    if (status) {
      if (status.installed && status.running) {
        // Connected to Hermes
        setMessages(prev => {
          const hasConnectionMsg = prev.some(m => 
            m.content.includes('Connected to Hermes')
          );
          if (!hasConnectionMsg) {
            return [...prev, {
              id: `system-${Date.now()}`,
              role: 'assistant' as const,
              content: 'Connected to Hermes. I can now execute commands and help with tasks.',
              timestamp: Date.now(),
            }];
          }
          return prev;
        });
      } else if (status.installed && !status.running) {
        // Hermes installed but not running
        setMessages(prev => {
          const hasOfflineMsg = prev.some(m => 
            m.content.includes('Hermes is installed but not running')
          );
          if (!hasOfflineMsg) {
            return [...prev, {
              id: `system-${Date.now()}`,
              role: 'assistant' as const,
              content: 'Hermes is installed but not running. Start Hermes to enable full functionality.',
              timestamp: Date.now(),
            }];
          }
          return prev;
        });
      }
    }
  }, [status]);

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Try to send to Hermes
      if (window.api?.chatWithHermes) {
        const response = await window.api.chatWithHermes(trimmed, messages);
        
        const assistantMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: response.message || 'I received your message.',
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback to simulated response
        setTimeout(() => {
          const responses = [
            "I understand. Let me help you with that.",
            "I'm processing your request. Please wait...",
            "I've noted your message. How can I assist further?",
            "That's an interesting question. Let me think about it.",
          ];
          
          const assistantMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            role: 'assistant',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: Date.now(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 500);
        return;
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to get response from Hermes.'}`,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-content">
              <span className="typing-indicator">Hermes is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Hermes..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className="chat-send-btn theme-transition"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            title="Send Message"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
