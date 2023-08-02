#!/bin/bash

# Prompt the user to enter the values of the environmental variables
read -p "Enter the JWT_SECRET: " JWT_SECRET
read -p "Enter the ADMIN_USER: " ADMIN_USER
read -p "Enter the ADMIN_PASSWORD: " ADMIN_PASSWORD
read -p "Enter the port number to deploy daShit (e.g., 2500): " PORT

# Create the env_variables.sh file
cat << EOF > env_variables.sh
#!/bin/bash

export JWT_SECRET="$JWT_SECRET"
export ADMIN_USER="$ADMIN_USER"
export ADMIN_PASSWORD="$ADMIN_PASSWORD"
export DASHIT_PORT="$PORT"
EOF

# Make the env_variables.sh file executable
chmod +x env_variables.sh

# Prompt the user to choose whether to start daShit at boot
read -p "Do you want to start daShit at boot? (root) (y/n): " START_AT_BOOT

if [[ $START_AT_BOOT =~ ^[Yy]$ ]]; then
  # Copy the env_variables.sh file to /etc/profile.d/ directory
  sudo cp env_variables.sh /etc/profile.d/
  echo "daShit will start at boot."
else
  echo "daShit will not start at boot."
fi

# Load environmental variables from the file
source ./env_variables.sh

# Path to daShit
npm run serverStart > /dev/null 2>&1 &

echo "daShit deployed on port $PORT"