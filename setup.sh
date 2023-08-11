#!/bin/bash

# Prompt the user to enter the values of the environmental variables
read -p "Enter the JWT_SECRET: " JWT_SECRET
read -p "Enter the ADMIN_PASSWORD: " ADMIN_PASSWORD
read -p "Enter the port number to deploy daShit (e.g., 2500): " PORT

npm install

# Create .env file
cat << EOF > .env
JWT_SECRET="$JWT_SECRET"
ADMIN_PASSWORD="$ADMIN_PASSWORD"
DASHIT_PORT="$PORT"
EOF

# Prompt the user to choose whether to start daShit at boot
read -p "Do you want to start daShit at boot? (y/n): " START_AT_BOOT

if [ "$START_AT_BOOT" == "y" ]; then
    # Create a service file
    sudo cat << EOF > /etc/systemd/system/dashit.service
[Unit]
Description=daShit
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=$(which npm) run serverStart
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

    # Enable the service
    sudo systemctl enable dashit.service
fi

# Start daShit
npm run serverStart > /dev/null 2>&1 &

echo "daShit deployed on port $PORT"
