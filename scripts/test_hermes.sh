#!/bin/bash
# Test Hermes Desktop App Integration

echo "=== Testing Hermes CLI Integration ==="

# Check if Hermes is installed
if command -v hermes &> /dev/null; then
    echo "Hermes CLI found: $(which hermes)"
else
    echo "Hermes CLI not found in PATH"
    exit 1
fi

# Test Hermes chat command
echo ""
echo "=== Testing 'hermes chat -q' ==="
timeout 10 hermes chat -q "What is 2+2?" -Q 2>&1 || echo "Command timed out or failed"

echo ""
echo "=== Build and Test Desktop App ==="
cd /home/bobb/Documents/HermesDirectory/projects/hermes-desktop-app

# Build
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "=== Starting App (will auto-close in 5 seconds) ==="
timeout 5 npm start 2>&1 || true

echo ""
echo "=== Test Complete ==="
echo "The app should now work with Hermes CLI."
echo "Run 'npm start' to use the app."
