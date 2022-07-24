
clean:
	-rm -rf build


build: clean
	-mkdir -p ./build
	eosio-cpp ./src/example.cpp -o build/example.wasm  -I ./include/ -abigen_output build/example.abi
