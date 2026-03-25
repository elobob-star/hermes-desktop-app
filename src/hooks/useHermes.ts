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

// Ensure the custom API is available on the window object
declare global {
  interface Window {
    api: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}

export function useHermes(pollingIntervalMs = 5000) {
  const [status, setStatus] = useState<HermesStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      if (!window.api) {
        throw new Error("Electron API is not available on window.api");
      }
      const currentStatus = await window.api.invoke('hermes:getStatus');
      setStatus(currentStatus);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Hermes status');
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
      if (!window.api) throw new Error("Electron API not found");
      return await window.api.invoke('hermes:executeCommand', command, args);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to execute command');
    }
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      if (!window.api) throw new Error("Electron API not found");
      return await window.api.invoke('hermes:loadConfig');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to load config');
    }
  }, []);

  return {
    status,
    loading,
    error,
    refreshStatus: fetchStatus,
    executeCommand,
    loadConfig,
  };
}
