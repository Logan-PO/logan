# Clean and bootstrap backend
npm run clean-all

# Copy private packages to backend node_modules
node services/backend/scripts/copy-dependencies.js

# Deploy
cd services/backend && npm run bundle
eb deploy

# Reset node_modules
npm run clean-all && npm run bootstrap
