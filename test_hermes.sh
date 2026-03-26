#!/bin/bash

echo "=== Testing Hermes Integration ==="

# Check if Hermes is available
if command -v hermes &> /dev/null; then
    echo "Hermes CLI found: $(which hermes)"
else
    echo "Hermes CLI not found in PATH"
    exit 1
fi

# Test Hermes chat command
echo ""
echo "=== Testing 'hermes chat -q' ==="
timeout 10 hermes chat -q "What is 2+2?" -Q 2>&1 | head -10 || echo "Command timed out or failed"

echo ""
echo "=== Integration test complete ==="
