import React from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Format the timestamp (e.g., "10:30 AM")
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`chat-message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
        <div className="chat-message-content">
          {message.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="chat-message-timestamp">{formattedTime}</div>
      </div>
    </div>
  );
};
