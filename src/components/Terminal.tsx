import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useHermes } from '../hooks/useHermes';
import './Terminal.css';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'system';
  content: string;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'system', content: 'Hermes Terminal v1.0.0' },
    { id: '2', type: 'system', content: 'Type "help" for a list of available commands.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { status, executeCommand: execHermesCommand } = useHermes();

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Add connection status message
  useEffect(() => {
    if (status) {
      if (status.installed && status.running) {
        setLines(prev => {
          const hasConnected = prev.some(l => l.content.includes('Connected to Hermes'));
          if (!hasConnected) {
            return [...prev, { 
              id: Date.now().toString(), 
              type: 'system', 
              content: 'Connected to Hermes.' 
            }];
          }
          return prev;
        });
      } else if (!status.installed) {
        setLines(prev => {
          const hasNotInstalled = prev.some(l => l.content.includes('Hermes not found'));
          if (!hasNotInstalled) {
            return [...prev, { 
              id: Date.now().toString(), 
              type: 'system', 
              content: 'Hermes not found. Running in demo mode.' 
            }];
          }
          return prev;
        });
      }
    }
  }, [status]);

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
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      type,
      content
    }]);
  };

  const executeCommand = useCallback(async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd || isExecuting) return;

    // Add command to output
    addLine('command', trimmedCmd);

    // Update history (max 50)
    setHistory(prev => {
      const newHistory = [trimmedCmd, ...prev];
      return newHistory.slice(0, 50);
    });
    setHistoryIndex(-1);

    // Handle built-in commands
    const cmdLower = trimmedCmd.toLowerCase();
    
    if (cmdLower === 'help') {
      addLine('output', `Available commands:
  help    - Show this help message
  clear   - Clear terminal output
  status  - Show Hermes connection status
  version - Show Hermes version
  Any other command will be sent to Hermes.`);
      return;
    }
    
    if (cmdLower === 'clear') {
      handleClear();
      return;
    }
    
    if (cmdLower === 'status') {
      if (status) {
        addLine('output', `Hermes Status:
  Installed: ${status.installed ? 'Yes' : 'No'}
  Running: ${status.running ? 'Yes' : 'No'}
  Executable: ${status.paths.executable || 'Not found'}
  Config: ${status.paths.config || 'Not found'}`);
      } else {
        addLine('output', 'Status: Unknown (checking...)');
      }
      return;
    }

    // Try to execute via Hermes API
    setIsExecuting(true);
    
    try {
      if (status?.installed && status.paths.executable) {
        // Execute real command
        const result = await execHermesCommand(trimmedCmd);
        addLine('output', result || 'Command executed successfully.');
      } else {
        // Demo mode - simulate response
        setTimeout(() => {
          if (cmdLower === 'version') {
            addLine('output', 'Hermes v1.0.0 (demo mode)');
          } else {
            addLine('output', `[Demo Mode] Command "${trimmedCmd}" would be sent to Hermes.`);
          }
          setIsExecuting(false);
        }, 300);
        return;
      }
    } catch (error: any) {
      addLine('error', `Error: ${error.message || 'Command failed'}`);
    } finally {
      setIsExecuting(false);
    }
  }, [status, execHermesCommand, isExecuting]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting) {
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
          {isExecuting && (
            <div className="terminal-line system">
              <span className="typing-indicator">Executing...</span>
            </div>
          )}
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
              disabled={isExecuting}
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
