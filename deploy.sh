#!/bin/bash

# Install pm2 globally
npm i
npm install -g pm2

# Start the proxy-site application using pm2
pm2 start proxy-site/start.js --name proxy

# Start the discord-bot application using pm2
pm2 start discord-bot/start.js --name discord

# Check if config.json exists, and create it if not
if [ ! -f config.json ]; then
    touch config.json
    echo "Config.json created. Please edit it with the necessary configurations."
else
    echo "Config.json already exists. Please edit it with the necessary configurations."
fi

# Display a message indicating the tasks have been completed
echo "Script execution completed."
