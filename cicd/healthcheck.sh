#!/bin/bash
set -euo pipefail

FE_HEALTH_URL="${FE_HEALTH_URL:-https://kepler-dev.meucorp.com/admin/login}"
MAX_RETRIES=12
RETRY_INTERVAL=5

echo "=== Health check: $FE_HEALTH_URL ==="

HEALTHY=0
for i in $(seq 1 $MAX_RETRIES); do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$FE_HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "Health check passed (attempt $i) — HTTP $HTTP_CODE"
    HEALTHY=1
    break
  else
    echo "Lần $i chưa sẵn sàng (HTTP $HTTP_CODE), chờ ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
  fi
done

if [ $HEALTHY -eq 0 ]; then
  echo "=== Health check thất bại! Đang rollback... ==="
  bash cicd/rollback.sh
  echo "=== Đã rollback xong ==="
  exit 1
fi

echo "=== Health check thành công ==="
