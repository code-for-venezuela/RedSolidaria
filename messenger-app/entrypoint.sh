#!/bin/sh
#
# we use an entrypoint script here with PORT setting so that
# we can run this on heroku using containers
export SERVER_PORT="${PORT:-5000}"
echo "Arguments are $*"
echo "Working with ${SERVER_PORT}"


echo "Starting up server"
exec npm start
