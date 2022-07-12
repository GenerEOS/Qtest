#!/bin/sh

# Load default env
./env.sh

# Build EOS snapshot
export SYSTEM_TOKEN_SYMBOL="EOS"
./create_snapshot.sh

# Build WAX snapshot
export SYSTEM_TOKEN_SYMBOL="WAX"
./create_snapshot.sh

# Build TLOS snapshot
export SYSTEM_TOKEN_SYMBOL="TLOS"
./create_snapshot.sh

tail -f /dev/null
exec "$@"
