// Add global types for window.api
declare global {
  interface Window {
    api?: {
      ping: () => Promise<string>;
    };
  }
}

export {};
