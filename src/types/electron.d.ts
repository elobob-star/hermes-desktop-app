import { HermesStatus } from '../hooks/useHermes';

// Extend Window interface with Electron API
declare global {
  interface Window {
    api: {
      // Generic invoke
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      
      // Convenience methods
      ping: () => Promise<string>;
      
      // Hermes methods
      getHermesStatus: () => Promise<HermesStatus>;
      executeHermesCommand: (command: string, args?: string[]) => Promise<string>;
      loadHermesConfig: () => Promise<string | null>;
      chatWithHermes: (message: string, conversationHistory?: any[]) => Promise<{
        success: boolean;
        message: string;
        demo: boolean;
        error?: boolean;
      }>;
    };
  }
}

export {};
