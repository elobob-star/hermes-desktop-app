const { ipcMain } = require('electron');
const { execFile } = require('child_process');
const { HermesDetector } = require('./hermes-detector');
const fs = require('fs');

class HermesClient {
  constructor() {
    this.detector = new HermesDetector();
    this.status = null;
    this.init();
  }

  init() {
    // Perform initial detection
    this.refreshStatus();

    // Register IPC handlers
    this.registerHandlers();
  }

  refreshStatus() {
    this.status = this.detector.detect();
  }

  registerHandlers() {
    ipcMain.handle('hermes:getStatus', async () => {
      // Refresh status on every call
      this.refreshStatus();
      return this.status;
    });

    ipcMain.handle('hermes:executeCommand', async (event, command, args) => {
      return new Promise((resolve, reject) => {
        if (!this.status.installed || !this.status.paths.executable) {
          return reject(new Error('Hermes executable not found.'));
        }

        const executable = this.status.paths.executable;

        // Use execFile to prevent command injection
        const commandArgs = [command];
        if (args && Array.isArray(args)) {
          commandArgs.push(...args);
        }

        execFile(executable, commandArgs, (error, stdout, stderr) => {
          if (error) {
            console.error(`Command execution error: ${error}`);
            return reject(new Error(stderr || error.message));
          }
          resolve(stdout);
        });
      });
    });

    ipcMain.handle('hermes:loadConfig', async () => {
      if (!this.status.paths.config) {
        return null;
      }

      try {
        const configPath = this.status.paths.config;
        const fileContent = fs.readFileSync(configPath, 'utf8');
        // Simplistic assumption: YAML config might be complex to parse, so returning raw string
        // or attempting JSON parse if applicable. Using simple return.
        return fileContent;
      } catch (error) {
        console.error('Error reading config file:', error);
        throw new Error('Failed to load configuration file.');
      }
    });
  }
}

module.exports = { HermesClient };
