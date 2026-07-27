#!/bin/bash
set -euo pipefail

echo "=== Cleaning PM2 logs on server ==="

ssh -S /tmp/ssh-mux/master $SERVER_USER@$SERVER_HOST "
  pm2 flush kepler-frontend-client &&
  find ~/.pm2/logs -name '*.log' -mtime +7 -delete 2>/dev/null || true &&
  echo 'PM2 logs flushed, old logs (>7 days) deleted'
"

echo "=== Clean done ==="