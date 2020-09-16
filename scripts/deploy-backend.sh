npm run clean-all
lerna bootstrap --scope @logan/backend --include-dependencies -- --production --no-optional
cd services/backend
eb deploy
npm run clean-all
npm run bootstrap
