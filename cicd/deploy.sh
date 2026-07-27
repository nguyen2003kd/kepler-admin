#!/bin/bash
set -euo pipefail

BRANCH="${CI_COMMIT_REF_NAME:-release/staging}"

echo "=== Deploying branch $BRANCH to server ==="

ssh -S /tmp/ssh-mux/master $SERVER_USER@$SERVER_HOST "
  cd $SERVER_APP_PATH &&
  git fetch origin &&
  git checkout $BRANCH &&
  git rev-parse HEAD > .last-deploy-commit &&
  git pull origin $BRANCH &&
  pnpm install --frozen-lockfile &&
  pnpm build &&
  pm2 reload ecosystem.config.js --update-env
"

echo "=== Deploy done ==="
