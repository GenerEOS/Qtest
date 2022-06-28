

# Docker:

```
$ make build
$ make start
$ cleos get info
{
  "server_version": "44d454fc",
  "chain_id": "34a0a6a844988be76f130f7e0cef842795e65bdd494a2bc479d8b1adc29397c3",
  "head_block_num": 213,
  "last_irreversible_block_num": 212,
  "last_irreversible_block_id": "000000d41e58d421d0ba0dc736fe13cdb2a56e8e5210fc32a03b231785e694e6",
  "head_block_id": "000000d5f0dd3e4c1358cd9ae40e811cf769ad1dd465c83921ea89ab58b6c8c2",
  "head_block_time": "2022-06-19T13:10:30.500",
  "head_block_producer": "eosio",
  "virtual_block_cpu_limit": 247139,
  "virtual_block_net_limit": 1296213,
  "block_cpu_limit": 99900,
  "block_net_limit": 1048576,
  "server_version_string": "v3.0.5-rc1",
  "fork_db_head_block_num": 213,
  "fork_db_head_block_id": "000000d5f0dd3e4c1358cd9ae40e811cf769ad1dd465c83921ea89ab58b6c8c2",
  "server_full_version_string": "v3.0.5-rc1-44d454fc9a2ee134506bf051737a70e39ee93d91-dirty"
}
```
# Interact with docker:

## Start docker
Note: replace ENV variables with your expected ENV
```

docker run --name qtest  --env EOSIO_PUB_KEY=EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb --env EOSIO_PRV_KEY=5JLPcFr2KWnHMaXRnEc1JyRcRj8KegqsnXwRw24VYdLGhjwEQuN --env SYSTEM_TOKEN_SUPPLY="12345678.00000000 WAX" -d -p 8888:8888 qtest:latest

```
## Time manipulation:

```
$ docker exec qtest cleos get info
{
  "head_block_time": "2022-06-19T13:51:59.500",
...
}

# manipulate time
docker exec qtest /app/scripts/manipulate_time.sh "+15d"

$ docker exec qtest cleos get info
{
  "head_block_time": "2022-07-04T13:53:26.500",
...
}
```

"2022-07-26T05:15:44.500"

FAKETIME="2023-12-24 20:30:00"
LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1 FAKETIME="2023-12-24 20:30:00"

export LD_PRELOAD=/usr/local/lib/faketime/libfaketime.so.1 FAKETIME_NO_CACHE=1
export FAKETIME="2022-07-24 20:30:00"
cleos

"2022-07-24 20:30:00"