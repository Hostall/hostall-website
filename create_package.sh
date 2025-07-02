#!/bin/bash

# Make the script executable
chmod +x hostall_website_files.sh

# Run the script
./hostall_website_files.sh

# Check if the zip file was created
if [ -f hostall_website.zip ]; then
  echo "SUCCESS: hostall_website.zip was created successfully!"
  echo "File size: $(du -h hostall_website.zip | cut -f1)"
else
  echo "ERROR: Failed to create hostall_website.zip"
fi