#!/bin/bash

# Deploy Guide Launcher
# Opens the interactive deployment guide in your browser

echo ""
echo "🚀 Opening Deploy Guide..."
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "Starting dev server first..."
  echo ""
  npm run dev &
  sleep 3
fi

# Open in browser
if command -v open &> /dev/null; then
  open "http://localhost:3000/deploy"
elif command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:3000/deploy"
else
  echo "Open this URL in your browser: http://localhost:3000/deploy"
fi

echo ""
echo "Guide opened! Follow the steps to deploy your app."
echo ""

