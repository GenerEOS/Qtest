#!/bin/sh

if [ -z "${SYSTEM_TOKEN_SYMBOL}" ]; then
  export SYSTEM_TOKEN_SYMBOL="EOS"
fi

export EOSIO_PUB_KEY=EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH && export EOSIO_PRV_KEY=5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS

cd /app/node/ && ./start_snapshot.sh

tail -f /dev/null
exec "$@"
