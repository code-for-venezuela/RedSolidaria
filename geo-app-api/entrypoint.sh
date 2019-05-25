#!/bin/sh
#
fail_startup() {
  >&2 echo $1
  exit 1
}

# we use an entrypoint script here with PORT setting so that
# we can run this on heroku using containers
export SERVER_PORT="${PORT:-5000}"
echo "Arguments are $*"
echo "Working with ${SERVER_PORT}"
echo "Starting up server"
[ -z "${GOOGLE_WORKSHEET_ID}" ] && fail_startup 'This app requires GOOGLE_WORKSHEET_ID to be configured.'
[ -z "${GOOGLE_API_KEY}" ] && fail_startup 'This app requires GOOGLE_API_KEY to be configured.'
exec python app.py
