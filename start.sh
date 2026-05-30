#!/bin/sh
set -e

# Start FastAPI backend in the background
uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2 &

# Start nginx in the foreground (keeps container alive)
exec nginx -g "daemon off;"
