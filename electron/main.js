const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { HermesClient } = require('./hermes-client');
const { spawn } = require('child_process');

let hermesClient;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0F0F23',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the index.html from dist/ directory where webpack bundles it
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html')).catch(err => {
    console.error('Failed to load dist/index.html. Ensure you have run the build script.', err);
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Basic IPC setup
  ipcMain.handle('ping', () => 'pong');
}

app.whenReady().then(() => {
  createWindow();
  
  // Initialize Hermes client after window is created
  hermesClient = new HermesClient();
  console.log('Hermes client initialized');

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Additional IPC handler for chatting with Hermes
ipcMain.handle('hermes:chat', async (event, message, conversationHistory) => {
  return new Promise((resolve, reject) => {
    // First check if Hermes is available
    const status = hermesClient.status;
    
    if (!status.installed || !status.paths.executable) {
      // Return simulated response if Hermes not installed
      resolve({
        success: false,
        message: 'Hermes is not installed or not found. Running in demo mode.',
        demo: true
      });
      return;
    }

    // Try to execute Hermes chat command
    const executable = status.paths.executable;
    const args = ['chat', '--message', message];
    
    // If conversation history exists, we could pass it
    if (conversationHistory && conversationHistory.length > 0) {
      args.push('--context', JSON.stringify(conversationHistory.slice(-5))); // Last 5 messages for context
    }

    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'production' }
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          message: stdout.trim() || 'Command executed successfully.',
          demo: false
        });
      } else {
        // If Hermes fails, fall back to demo mode
        resolve({
          success: false,
          message: stderr.trim() || `Hermes exited with code ${code}`,
          demo: true,
          error: true
        });
      }
    });

    child.on('error', (err) => {
      // If Hermes can't be spawned, fall back to demo mode
      resolve({
        success: false,
        message: `Failed to execute Hermes: ${err.message}. Running in demo mode.`,
        demo: true,
        error: true
      });
    });

    // Set a timeout for the command
    setTimeout(() => {
      child.kill();
      resolve({
        success: false,
        message: 'Command timed out. Running in demo mode.',
        demo: true,
        error: true
      });
    }, 30000); // 30 second timeout
  });
});
