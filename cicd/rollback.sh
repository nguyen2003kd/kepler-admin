#!/bin/bash
set -euo pipefail

echo "=== Rolling back on server ==="

ssh -S /tmp/ssh-mux/master $SERVER_USER@$SERVER_HOST "
  cd $SERVER_APP_PATH &&
  PREV_COMMIT=\$(cat .last-deploy-commit) &&
  echo \"Rolling back to commit \$PREV_COMMIT\" &&
  git checkout \$PREV_COMMIT &&
  pnpm install --frozen-lockfile &&
  pnpm build &&
  pm2 reload ecosystem.config.js --update-env
"

echo "=== Rollback done ==="
