# Build Snapshot:

```
$ make build_snapshots

$ make create_snapshots

# wait until all snapshots are created with following logs:
$ docker logs qsnapshot
{
   "head_block_id" : "000000108afb765fa579df87aef399987315b3c3f11dd44a2a98f14869e674af",
   "head_block_num" : 16,
   "head_block_time" : "2022-09-18T07:52:34.000",
   "snapshot_name" : "/app/snapshot-node/./logs/EOS/data/snapshots/snapshot-000000108afb765fa579df87aef399987315b3c3f11dd44a2a98f14869e674af.bin",
   "version" : 5
}
...
{
   "head_block_id" : "0000000d7b70ad64ac368b01f5ccfaa97481ac610877bbe9307a09e52a75e451",
   "head_block_num" : 13,
   "head_block_time" : "2022-09-18T07:52:42.000",
   "snapshot_name" : "/app/snapshot-node/./logs/WAX/data/snapshots/snapshot-0000000d7b70ad64ac368b01f5ccfaa97481ac610877bbe9307a09e52a75e451.bin",
   "version" : 5
}
...
{
   "head_block_id" : "0000000d30b1c9f92065e95037619b4ddbb20f7c9143c7863e46a7d0f3f5a103",
   "head_block_num" : 13,
   "head_block_time" : "2022-09-18T07:52:50.000",
   "snapshot_name" : "/app/snapshot-node/./logs/TLOS/data/snapshots/snapshot-0000000d30b1c9f92065e95037619b4ddbb20f7c9143c7863e46a7d0f3f5a103.bin",
   "version" : 5
}
$ make copy_snapshots
```

# Build and run docker image:

```
$ make build
$ make start

CONTAINER ID   IMAGE          COMMAND             CREATED          STATUS                    PORTS                                       NAMES
70c42a58f632   qtest:latest   "./entrypoint.sh"   12 seconds ago   Up 11 seconds (healthy)   0.0.0.0:8888->8888/tcp, :::8888->8888/tcp   qtest

```

# Interact with docker:

## Start docker
Note: SYSTEM_TOKEN_SYMBOL can be WAX, EOS, TLOS
```
docker run --name qtest  --env SYSTEM_TOKEN_SYMBOL="WAX" -d -p 8888:8888 qtest:latest
```

## Time manipulation:
```
$ docker exec qtest cleos get info
{
  ...
  "head_block_time": "2022-07-14T02:02:47.000",
  ...
}

# manipulate time
docker exec qtest /app/scripts/manipulate_time.sh "+15d"

$ docker exec qtest cleos get info
{
  ...
  "head_block_time": "2022-07-29T02:03:24.500",
  ...
}
```

# Testing key:
```
ENV EOSIO_PUB_KEY=EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH
ENV EOSIO_PRV_KEY=5JKxAqBoQuAYSh6YMcjxcougPpt1pi9L4PyJHwEQuZgYYgkWpjS
```