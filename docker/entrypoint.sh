#!/bin/sh

if [ -z "${SYSTEM_TOKEN_SYMBOL}" ]; then
  export SYSTEM_TOKEN_SYMBOL="EOS"
fi

cd /app/node/ && ./start_snapshot.sh

tail -f /dev/null
exec "$@"
