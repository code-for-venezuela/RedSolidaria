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
cat > ./token.pickle2 << PICKLE
${GOOGLE_TOKEN_PICKLE}
PICKLE
iconv -f ISO-8859-1 -t UTF-8  ./token.pickle2 > ./token.pickle
rm ./token.pickle2
ls -altr ./token.pickle
cat ./token.pickle
echo "Starting up server"
exec python app.py
