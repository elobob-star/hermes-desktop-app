const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Generic invoke method for all IPC channels
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  // Convenience methods
  ping: () => ipcRenderer.invoke('ping'),
  
  // Hermes status
  getHermesStatus: () => ipcRenderer.invoke('hermes:getStatus'),
  
  // Execute Hermes command
  executeHermesCommand: (command, args) => 
    ipcRenderer.invoke('hermes:executeCommand', command, args),
  
  // Load Hermes config
  loadHermesConfig: () => ipcRenderer.invoke('hermes:loadConfig'),
  
  // Chat with Hermes (send message and get response)
  chatWithHermes: (message, conversationHistory) => 
    ipcRenderer.invoke('hermes:chat', message, conversationHistory),
});
