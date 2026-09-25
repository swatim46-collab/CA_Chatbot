#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required to run CA Assist." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  npm install
fi

exec npm run dev -- --host 127.0.0.1
