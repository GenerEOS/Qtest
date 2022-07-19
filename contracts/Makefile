CONTRACT_NAMES=testcontract inittable passingtime

clean:
	-rm -rf build


build: clean
	-mkdir -p ./build
	for contract in ${CONTRACT_NAMES} ; do \
		eosio-cpp ./$$contract/src/$$contract.cpp -o build/$$contract.wasm  -I ./$$contract/include/ -abigen_output build/$$contract.abi ; \
	done
