import React, { useState } from 'react';
import { useHermes } from '../hooks/useHermes';

// Note: To match specific design requirements from PROJECT_SPEC.md, use custom CSS or tailwind
// assuming simple styles here to fulfill React component functionality.
export const HermesStatus: React.FC = () => {
  const { status, loading, error, refreshStatus, executeCommand, loadConfig } = useHermes();
  const [commandOutput, setCommandOutput] = useState<string | null>(null);
  const [configOutput, setConfigOutput] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);

  const handleTestCommand = async () => {
    setExecuting(true);
    setCommandOutput(null);
    try {
      const result = await executeCommand('--version');
      setCommandOutput(`Success: ${result}`);
    } catch (e: any) {
      setCommandOutput(`Error: ${e.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleLoadConfig = async () => {
    setConfigOutput(null);
    try {
      const configData = await loadConfig();
      setConfigOutput(configData || "No config loaded.");
    } catch (e: any) {
      setConfigOutput(`Error loading config: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 rounded-md shadow bg-gray-800 text-white animate-pulse">
        <p>Loading Hermes Status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md shadow bg-red-900 text-white">
        <h2 className="text-xl font-bold mb-2">Error Connecting to Hermes</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={refreshStatus}
          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!status) {
    return <div>No status available.</div>;
  }

  const isConnected = status.installed && status.running;
  const statusColor = isConnected ? 'text-green-400' : (status.installed ? 'text-yellow-400' : 'text-red-400');

  return (
    <div className="p-6 rounded-lg shadow-lg bg-[#1A1A2E] text-white border border-gray-700 max-w-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold font-inter text-[#E5E7EB]">Hermes Agent Status</h2>
        <div className="flex items-center space-x-3">
          <span className={`flex items-center space-x-2 ${statusColor}`}>
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : (status.installed ? 'bg-yellow-400' : 'bg-red-400')}`}></span>
            <span className="font-semibold">
              {isConnected ? 'Connected' : (status.installed ? 'Stopped' : 'Not Found')}
            </span>
          </span>
          <button
            onClick={refreshStatus}
            className="bg-[#8B5CF6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
          >
            Reconnect
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-[#0F0F23] p-4 rounded-md border border-gray-800">
          <h3 className="text-[#06B6D4] font-semibold mb-2">Installation Details</h3>
          <ul className="space-y-2 text-sm text-[#9CA3AF]">
            <li className="flex flex-col">
              <span className="font-medium text-[#E5E7EB]">Executable Path:</span>
              <span className="font-mono break-all mt-1 bg-black/30 p-1.5 rounded">
                {status.paths.executable || 'Not detected'}
              </span>
            </li>
            <li className="flex flex-col mt-3">
              <span className="font-medium text-[#E5E7EB]">Config Path:</span>
              <span className="font-mono break-all mt-1 bg-black/30 p-1.5 rounded">
                {status.paths.config || 'Not detected'}
              </span>
            </li>
          </ul>
        </div>

        {status.error && (
          <div className="bg-red-900/50 border border-red-500/50 p-3 rounded-md text-red-200 text-sm">
            <span className="font-bold">System Error:</span> {status.error}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-6">
        <div>
          <button
            disabled={!status.installed || executing}
            onClick={handleTestCommand}
            className="w-full bg-[#1A1A2E] hover:bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            {executing ? 'Testing...' : 'Test Connection (--version)'}
          </button>
          {commandOutput && (
            <div className="mt-2 bg-[#0F0F23] p-3 rounded-md border border-gray-800">
              <pre className="text-xs font-mono text-[#06B6D4] whitespace-pre-wrap break-all">
                {commandOutput}
              </pre>
            </div>
          )}
        </div>

        <div>
          <button
            disabled={!status.paths.config}
            onClick={handleLoadConfig}
            className="w-full bg-[#1A1A2E] hover:bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            Load Configuration
          </button>
          {configOutput && (
            <div className="mt-2 bg-[#0F0F23] p-3 rounded-md border border-gray-800 max-h-32 overflow-y-auto">
              <pre className="text-xs font-mono text-[#9CA3AF] whitespace-pre-wrap break-all">
                {configOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
