lerna bootstrap --scope @logan/backend --include-dependencies -- --production --no-optional
cd services/backend
eb deploy
