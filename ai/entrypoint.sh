#!/bin/bash
set -e

# Start Ollama server in background
ollama serve &

# Wait a few seconds for the server to be ready
sleep 5

# Pull TinyLlama if not already present
if ! ollama list | grep -q tinyllama; then
  echo "Pulling TinyLlama model..."
  ollama pull tinyllama
fi

# Keep the server running
wait
