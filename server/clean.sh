#!/bin/bash

# Starting Flask server
echo "Initiating an empty git remote repository..."

# Remove folders if they exist
rm -rf ./RemotePiServer
rm -rf ./LocalPiServer

# Create Remote git folder
mkdir RemotePiServer

# Init empty git repository
cd RemotePiServer
git init --bare
cd ..

# Copy our own hook file
cp ./post-update.template > ./RemotePiServer/hooks/post-update
chmod +x ./RemotePiServer/hooks/post-update

# Remove windows EOF chars that can sometimes prevent reading the file
dos2unix ./RemotePiServer/hooks/post-update
