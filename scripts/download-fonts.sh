#!/bin/bash

POPPINS="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
RUBIK="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap"

echo "Fetching Poppins from $POPPINS"
curl "$POPPINS" > services/frontend/src/globals/fonts/poppins.css

echo ''
echo "Fetching Rubik from $RUBIK"
curl "$RUBIK" > services/frontend/src/globals/fonts/rubik.css
