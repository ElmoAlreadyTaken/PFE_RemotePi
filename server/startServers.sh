#!/bin/bash

# Starting Flask server
echo "Starting Flask server..."
python server.py &
FLASK_PID=$!

# Give Flask a moment to start
sleep 1

# Starting ngrok tunnel
echo "Starting ngrok tunnels..."
ngrok start --config ../nrogk/ngrok.conf --all
NGROK_PID=$!

# Wait for any process to exit
wait -n

# Kill the other process
kill -TERM $FLASK_PID
kill -TERM $NGROK_PID