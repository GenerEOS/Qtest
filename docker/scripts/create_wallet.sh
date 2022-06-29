#!/bin/sh

# create wallet
echo ${EOSIO_PRV_KEY}

if [ -f "_user_password" ]
then
    echo "=====opening wallet====="
    cat _user_password | cleos wallet unlock
else
    echo "=====creating wallet====="
    cleos wallet create --file _user_password
    cleos wallet open
    cat _user_password | cleos wallet unlock
    # import private key generated
    echo ${EOSIO_PRV_KEY} | cleos wallet import
fi
exec "$@"
