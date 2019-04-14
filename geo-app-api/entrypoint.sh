#!/bin/sh
#
# we use an entrypoint script here with PORT setting so that
# we can run this on heroku using containers
export SERVER_PORT="${PORT:-5000}"
export GOOGLE_TOKEN_PICKLE="${GOOGLE_TOKEN_PICKLE:-}"
echo "Arguments are $*"
echo "Working with ${SERVER_PORT}"

# generate a pickle file
# we use the environment variable GOOGLE_TOKEN_PICKLE
cat > ./token.pickle << PICKLE
${GOOGLE_TOKEN_PICKLE}
PICKLE
ls -altr ./token.pickle
echo "Starting up server"
exec python app.py
