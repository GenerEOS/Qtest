# Build Snapshot:

```
$ make build_snapshots
$ make create_snapshots
# wait until all snapshots are created with following logs:
{
   "head_block_id" : "00000012970061bb6b3aeac9d36303e9832b7363c8f7ae5db7fc0c90735cb37c",
   "head_block_num" : 18,
   "head_block_time" : "2022-07-14T01:58:07.000",
   "snapshot_name" : "/app/snapshot-node/./logs/TLOS/data/snapshots/snapshot-00000012970061bb6b3aeac9d36303e9832b7363c8f7ae5db7fc0c90735cb37c.bin",
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