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

// IPC handler for chatting with Hermes
ipcMain.handle('hermes:chat', async (event, message, conversationHistory) => {
  return new Promise((resolve) => {
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

    // Execute Hermes chat with -q flag for non-interactive mode
    const executable = status.paths.executable;
    const args = [
      'chat',
      '-q', message,     // Query/message
      '-Q'                // Quiet mode (no banner, no spinner)
    ];

    console.log(`Executing: ${executable} ${args.join(' ')}`);
    
    const child = spawn(executable, args, {
      cwd: process.cwd(),
      env: { ...process.env, TERM: 'dumb' }
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
        // If Hermes fails, provide helpful error
        const errorMsg = stderr.trim() || stdout.trim() || `Hermes exited with code ${code}`;
        resolve({
          success: false,
          message: errorMsg,
          demo: false,
          error: true
        });
      }
    });

    child.on('error', (err) => {
      // If Hermes can't be spawned, fall back to demo mode
      resolve({
        success: false,
        message: `Failed to execute Hermes: ${err.message}`,
        demo: true,
        error: true
      });
    });

    // Set a timeout for the command (60 seconds for chat)
    setTimeout(() => {
      child.kill();
      resolve({
        success: false,
        message: 'Chat request timed out after 60 seconds.',
        demo: false,
        error: true
      });
    }, 60000);
  });
});
