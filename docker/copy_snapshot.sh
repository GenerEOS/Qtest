#!/bin/sh
rm -rf node/logs/
docker cp qsnapshot:/app/snapshot-node/./logs/ ./node/
find . -depth -name "*.bin" -exec sh -c 'f="{}"; mv -- "$f" "$(dirname "$f")/snapshot.bin"' \;