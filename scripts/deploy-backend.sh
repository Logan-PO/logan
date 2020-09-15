npm run clean-all
lerna bootstrap --scope @logan/backend --include-dependencies -- --production --no-optional
node services/backend/scripts/copy-dependencies.js
cd services/backend
eb deploy
