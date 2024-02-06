# Generate fake logs for testing purposes

import random
import time
import requests

SERVER_IP = "localhost" # Change to the server's IP
SERVER_PORT = 5000 # Change to the server's port
SCHEME = "http" # Change to "https" if using HTTPS (ngrok)
POST_INTERVAL = 2 # In seconds
NB_ROBOTS = 6 # Number of robots (approximative)

def generate_logs():
    # Generate fake logs
    LOG_URL = f"{SCHEME}://{SERVER_IP}:{SERVER_PORT}/log"
    while True:
        # Generate random robotId
        _id = random.randint(0, NB_ROBOTS)
        # Randomly alternate between MESSAGE and ERROR
        is_error = random.choice([True, False])
        if is_error:
            data = {'id': _id, 'error': 'This is a test error message.'}
        else:
            data = {'id': _id, 'message': 'This is a test message.'}
        
        # Post log to server /log endpoint
        requests.post(LOG_URL, json=data, verify=False)

        time.sleep(POST_INTERVAL)

if __name__ == "__main__":
    generate_logs()