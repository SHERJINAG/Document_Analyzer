#!/usr/bin/env bash

echo "Updating system packages..."
apt-get update

echo "Installing system dependencies..."
apt-get install -y tesseract-ocr poppler-utils

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed successfully."
