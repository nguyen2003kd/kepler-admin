#!/bin/bash
set -euo pipefail

echo "=== Building project ==="

corepack enable || true
pnpm install --frozen-lockfile
pnpm build

echo "=== Build done ==="