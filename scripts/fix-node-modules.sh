#!/bin/bash
npm run clean-all
find . -name 'package-lock.json' -delete
npm run bootstrap
