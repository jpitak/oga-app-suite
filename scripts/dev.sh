#!/usr/bin/env bash
set -e
cleanup() {
  pkill -f "vite" >/dev/null 2>&1 || true
  pkill -f "nodemon index.js" >/dev/null 2>&1 || true
}
trap cleanup EXIT
(cd server && npm run dev) &
(cd client && npm run dev -- --host 0.0.0.0) &
wait
