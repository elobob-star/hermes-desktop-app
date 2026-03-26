const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Generic invoke method for all IPC channels
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  // Hermes status
  getHermesStatus: () => ipcRenderer.invoke('hermes:getStatus'),
  
  // Execute Hermes command - uses proper CLI structure
  executeHermesCommand: (command, args) => {
    // Map commands to proper Hermes CLI format
    const commandMap = {
      'chat': (message) => ['chat', '-Q', '-q', message],
      'image': (prompt) => ['image', 'generate', '-q', prompt],
      'web': (query) => ['web', 'search', '-q', query],
      'terminal': (cmd) => ['terminal', 'exec', '-c', cmd],
      'status': () => ['status'],
      'version': () => ['--version'],
      'help': () => ['--help']
    };
    
    const hermesArgs = commandMap[command] || [];
    
    return ipcRenderer.invoke('hermes:executeCommand', hermesArgs.join(' '), args || []));
  },
  
  // Chat with Hermes - uses -q flag for non-interactive mode
  chatWithHermes: (message, conversationHistory) => 
    ipcRenderer.invoke('hermes:chat', message, conversationHistory)
  ,
  // Load Hermes config
  loadHermesConfig: () => ipcRenderer.invoke('hermes:loadConfig')
});
