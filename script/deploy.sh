#!/usr/bin/env bash
set -e

# We can generate a token with these instructions: https://devcenter.heroku.com/articles/authentication
# heroku auth:token
#
function generate_netrc() {
    echo $HOME
    cat > $HOME/.netrc << NETRC
machine api.heroku.com
  login ${HEROKU_USERNAME}
    password ${HEROKU_TOKEN}
NETRC

}

echo "Starting deploy for ${TARGET_DIR}"
_PWD="$(pwd)"
cd "${TARGET_DIR}"
heroku --version
pwd
generate_netrc
cat $HOME/.netrc
echo "lets try login"
heroku container:login
