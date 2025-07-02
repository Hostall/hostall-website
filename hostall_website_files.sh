#!/bin/bash

# Create a directory to organize files
mkdir -p hostall_website

# Copy the essential files
cp complete_index.html hostall_website/index.html
cp app.js hostall_website/
cp *.png hostall_website/
cp *.jpg hostall_website/

# Create a ZIP file
cd hostall_website
zip -r ../hostall_website.zip *
cd ..

echo "ZIP file created: hostall_website.zip"
echo "Contains the complete website with index.html, app.js, and all images"