CLEOSGREYMASS=cleos -u https://eos.greymass.com
get_projects: 
	mkdir -p contracts && \
	$(CLEOSGREYMASS) get code eosio -a ./contracts/eosio.system.abi
	$(CLEOSGREYMASS) get code eosio -c ./contracts/eosio.system.wasm --wasm
	$(CLEOSGREYMASS) get code eosio.msig -a ./contracts/eosio.msig.abi
	$(CLEOSGREYMASS) get code eosio.msig -c ./contracts/eosio.msig.wasm --wasm
	$(CLEOSGREYMASS) get code eosio.token -a ./contracts/eosio.token.abi
	$(CLEOSGREYMASS) get code eosio.token -c ./contracts/eosio.token.wasm --wasm

build: get_projects
	docker build -t qtest .

start: stop
	docker run --name qtest  --env EOSIO_PUB_KEY=EOS6aP916AQaTsxFmQiLyoex2jMuyewJHtK7PhF5o6LyTXeuaTFnb --env EOSIO_PRV_KEY=5JLPcFr2KWnHMaXRnEc1JyRcRj8KegqsnXwRw24VYdLGhjwEQuN --env SYSTEM_TOKEN_SUPPLY="12345678.00000000 WAX" -d -p 8888:8888 qtest:latest

stop:
	docker container rm qtest -f