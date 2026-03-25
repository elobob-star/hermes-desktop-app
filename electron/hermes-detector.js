const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

class HermesDetector {
  constructor() {
    this.homeDir = os.homedir();
    this.status = {
      installed: false,
      running: false,
      paths: {
        executable: null,
        config: null,
      },
      error: null,
    };
  }

  detect() {
    try {
      this.status.paths.executable = this.findExecutable();
      this.status.installed = !!this.status.paths.executable;

      if (this.status.installed) {
        this.status.paths.config = this.findConfig();
        this.status.running = this.checkRunning();
      }

      this.status.error = null;
    } catch (error) {
      this.status.error = error.message;
      console.error('Error detecting Hermes:', error);
    }

    return this.status;
  }

  findExecutable() {
    // 1. Check system PATH
    try {
      const command = process.platform === 'win32' ? 'where hermes' : 'which hermes';
      const result = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (result) {
        // Return first path if multiple are found
        return result.split('\n')[0].trim();
      }
    } catch (e) {
      // Not found in PATH
    }

    // 2. Check common installation paths
    const commonPaths = [
      path.join(this.homeDir, '.hermes', 'bin', 'hermes'),
      path.join(this.homeDir, '.local', 'bin', 'hermes'),
      process.platform === 'win32' ? 'C:\\Program Files\\Hermes\\hermes.exe' : '/usr/local/bin/hermes',
      process.platform === 'win32' ? 'C:\\Program Files (x86)\\Hermes\\hermes.exe' : '/usr/bin/hermes',
      process.platform === 'darwin' ? '/opt/homebrew/bin/hermes' : null
    ].filter(Boolean);

    for (const p of commonPaths) {
      if (this.fileExists(p)) {
        return p;
      }
    }

    return null;
  }

  findConfig() {
    // Check common config locations
    // Note: intentionally removed .env to avoid exposing application secrets
    const configPaths = [
      path.join(this.homeDir, '.hermes', 'config.yaml'),
      path.join(this.homeDir, '.config', 'hermes', 'config.yaml'),
      path.join(process.cwd(), 'hermes.config.yaml')
    ];

    for (const p of configPaths) {
      if (this.fileExists(p)) {
        return p;
      }
    }

    return null;
  }

  checkRunning() {
    try {
      let command;
      if (process.platform === 'win32') {
        command = 'tasklist | findstr /I "hermes.exe"';
      } else {
        // Look for the exact hermes process, excluding the grep process itself
        command = 'ps aux | grep "[h]ermes"';
      }

      const result = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      // If we got output, the process is running
      return result.trim().length > 0;
    } catch (e) {
      // Process not found or error executing command
      return false;
    }
  }

  fileExists(filePath) {
    try {
      return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (e) {
      return false;
    }
  }
}

module.exports = { HermesDetector };
