#!/bin/bash
set -euo pipefail

echo "=== Cleaning dangling images on server ==="

docker container prune -f
docker image prune -f

echo "=== Clean done ==="
