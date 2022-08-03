# Welcome to Qtest 

Qtest is an open-source Javascript-based [EOSIO](https://eosnetwork.com/) smart-contract testing framework, created by [GenerEOS](https://genereos.io).

Qtest gives you the ability to dockerize an EOSIO node. This allows a developer to host it on their system that supports [Docker](https://docs.docker.com). Using Qtest, developers can simplify testing of smart contracts and automate things like table seeding, account creation, and other initialisation tasks that are required before running complex test scenarios. Qtest already can be used to streamline testing for multiple EOSIO based chains including EOS, WAX, and TELOS, with the ability to add additional chain support easily.

## Overview 

* [Installing Qtest](docs/tutorial/installation.md)
* [Using Qtest to write contract tests](docs/tutorials/02.InteractingWithEOSContractsInEOSFactory.md)

## Qtest API
### Classes

**Public**

* [Account](docs/api/account.md)
* [Chain](docs/api/chain.md)
* [Contract](docs/api/contract.md)
* [Table](docs/api/table.md)
* [Time](docs/api/time.md)

**Internal**

* [Asset](docs/api/asset.md)
* [Symbol](docs/api/symbol.md)
* [System](docs/api/system.md)


### Functions

**Public**

* [Assertion](docs/api/assertion.md)
* [Wallet](docs/api/wallet.md)

**Internal**
* [dockerClient](docs/api/dockerclient.md)
* [serializer](docs/api/serializer.md)
* [utils](docs/api/utils.md)

## Support

For issues not covered in the documentation, please jump into our channel and we will do our best to help you out [GenerEOS](https://t.me/generEOS) channel on Telegram.

## Licence

This code is provided as is, under [MIT Licence](LICENCE).


