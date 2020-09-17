# Clean and bootstrap backend
npm run clean-all
lerna bootstrap --scope @logan/backend --include-dependencies -- --production --no-optional

# Copy private packages to backend node_modules
node services/backend/scripts/copy-dependencies.js

# Deploy
cd services/backend
eb deploy

# Reset node_modules
npm run clean-all
npm run bootstrap
