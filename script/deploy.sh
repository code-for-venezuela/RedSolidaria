#!/usr/bin/env bash
set -e

echo "Starting deploy for ${TARGET_DIR}"
_PWD="$(pwd)"
cd "${TARGET_DIR}"
heroku --version
pwd
