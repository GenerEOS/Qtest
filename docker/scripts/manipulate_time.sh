#!/bin/bash

cd /app/node/ && ./stop.sh

export LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1 FAKETIME_NO_CACHE=1
export FAKETIME=$1

cd /app/node/ && ./restart.sh
LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1 FAKETIME="-15d"