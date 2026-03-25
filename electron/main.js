const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
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

  // Basic IPC setup
  ipcMain.handle('ping', () => 'pong');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
