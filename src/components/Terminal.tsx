import React, { useState, useRef, useEffect } from 'react';
import './Terminal.css';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'output', content: 'Hermes Terminal v1.0.0' },
    { id: '2', type: 'output', content: 'Type "help" for a list of available commands.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Focus input on click anywhere in terminal body
  const handleBodyClick = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleCopy = async () => {
    const textToCopy = lines.map(line => {
      if (line.type === 'command') return `$ ${line.content}`;
      return line.content;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      // Could add a small toast here if desired, keeping it simple for now
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add command to output
    const newCommand: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: trimmedCmd
    };

    setLines(prev => [...prev, newCommand]);

    // Update history (max 50)
    setHistory(prev => {
      const newHistory = [trimmedCmd, ...prev];
      return newHistory.slice(0, 50);
    });
    setHistoryIndex(-1);

    // Mock behavior
    setTimeout(() => {
      const cmdLower = trimmedCmd.toLowerCase();
      let responseContent = '';
      let responseType: 'output' | 'error' = 'output';

      if (cmdLower === 'help') {
        responseContent = `Available commands:
  help    - Show this help message
  clear   - Clear terminal output
  status  - Show Hermes connection status`;
      } else if (cmdLower === 'clear') {
        handleClear();
        return; // Early return to avoid adding response
      } else if (cmdLower === 'status') {
        responseContent = 'Hermes: Online\nLatency: 24ms\nUptime: 2h 14m';
      } else if (cmdLower === 'error') {
        responseType = 'error';
        responseContent = 'Error: Simulated error message.';
      } else {
        responseContent = 'Command sent to Hermes...';
      }

      const responseLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: responseType,
        content: responseContent
      };

      setLines(prev => [...prev, responseLine]);
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          <span>{'>'}_</span> Terminal
        </div>
        <div className="terminal-actions">
          <button className="terminal-btn" onClick={handleCopy}>Copy Output</button>
          <button className="terminal-btn" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div className="terminal-body" onClick={handleBodyClick}>
        <div className="terminal-output">
          {lines.map((line) => (
            <div key={line.id} className={`terminal-line ${line.type}`}>
              {line.type === 'command' && (
                <span className="terminal-prompt-prefix">$</span>
              )}
              {line.content.split('\n').map((str, idx) => (
                <span key={idx}>
                  {str}
                  {idx < line.content.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>

        <div className="terminal-input-area">
          <span className="terminal-input-prompt">hermes{'>'}</span>
          <div className="terminal-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              style={{ width: inputValue ? `${inputValue.length}ch` : '1ch' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
