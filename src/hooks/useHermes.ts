import { useState, useEffect, useCallback } from 'react';

// Define the shape of Hermes status
export interface HermesStatus {
  installed: boolean;
  running: boolean;
  paths: {
    executable: string | null;
    config: string | null;
  };
  error: string | null;
}

export function useHermes(pollingIntervalMs = 5000) {
  const [status, setStatus] = useState<HermesStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      // Check if running in Electron with API available
      if (typeof window !== 'undefined' && window.api) {
        const currentStatus = await window.api.getHermesStatus();
        setStatus(currentStatus);
        setError(null);
      } else {
        // Not in Electron or API not available - set demo status
        setStatus({
          installed: false,
          running: false,
          paths: { executable: null, config: null },
          error: 'Not running in Electron'
        });
        setError('Not running in Electron environment');
      }
    } catch (err: any) {
      console.error('Failed to fetch Hermes status:', err);
      setError(err.message || 'Failed to fetch Hermes status');
      setStatus({
        installed: false,
        running: false,
        paths: { executable: null, config: null },
        error: err.message
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for status periodically
  useEffect(() => {
    fetchStatus(); // Initial fetch

    const interval = setInterval(() => {
      fetchStatus();
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [fetchStatus, pollingIntervalMs]);

  const executeCommand = useCallback(async (command: string, args?: string[]) => {
    try {
      if (typeof window === 'undefined' || !window.api) {
        throw new Error('Not running in Electron environment');
      }
      return await window.api.executeHermesCommand(command, args);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to execute command');
    }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      if (typeof window === 'undefined' || !window.api) {
        throw new Error('Not running in Electron environment');
      }
      return await window.api.loadHermesConfig();
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load config');
    }
  }, []);

  const chatWithHermes = useCallback(async (message: string, conversationHistory?: any[]) => {
    try {
      if (typeof window === 'undefined' || !window.api) {
        return {
          success: false,
          message: 'Not running in Electron environment',
          demo: true,
          error: true
        };
      }
      return await window.api.chatWithHermes(message, conversationHistory);
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to chat with Hermes',
        demo: true,
        error: true
      };
    }
  }, []);

  return {
    status,
    loading,
    error,
    refreshStatus: fetchStatus,
    executeCommand,
    loadConfig,
    chatWithHermes,
  };
}
