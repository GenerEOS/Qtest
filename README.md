# Welcome to Qtest 

Qtest is an open-source Javascript-based [EOSIO](https://eosnetwork.com/) smart-contract testing framework, created by [GenerEOS](https://genereos.io).

Qtest gives you the ability to dockerize an EOSIO node. This allows a developer to host it on their system that supports [Docker](https://docs.docker.com). Using Qtest, developers can simplify testing of smart contracts and automate things like table seeding, account creation, and other initialisation tasks that are required before running complex test scenarios. Qtest already can be used to streamline testing for multiple EOSIO based chains including EOS, WAX, TELOS, and UX, with the ability to add additional chain support easily.

## Overview

### Installation

Refer to [an example project](example)

```bash
npm install --save-dev qtest-js
```

#### Jest
Install `jest`
```
npm install --save-dev jest@^28.1.3
```
Config `jest`: Create jest.config.js and add following:

```
module.exports = {
  // transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  testEnvironment: "node",
  testTimeout: 120 * 1e3,
};
```

#### Docker

To install docker pls refer at [here](https://docs.docker.com/engine/install/)

### Run
Update test command in package.json

```
"test": "jest"
```

Run

```
npm run test
```

### Usage
```
const { Chain } = require("qtest-js");
const { expectAction } = require("qtest-js");
```

## User documentation

* [Installing Qtest](docs/tutorials/01.InstallingEOSFactory.md)
* [Using Qtest to write contract tests](docs/tutorials/02.InteractingWithEOSContractsInEOSFactory.md)
* [Inegrating with CI/CD pipeline] ()

## Qtest API
### Classes

**Public**

* [Account](docs/api/account.md)
* [Chain](docs/api/chain.md)
* [Contract](docs/api/contract.md)
* [Table](docs/api/table.md)
* [Time](docs/api/time.md)
* [Wallet](docs/api/wallet.md)

**Core**

* [Asset](docs/api/asset.md)
* [Symbol](docs/api/symbol.md)
* [System](docs/api/system.md)


### Functions
* [Assertion](docs/api/assertion.md)
* [dockerClient](docs/api/dockerclient.md)
* [serializer](docs/api/serializer.md)
* [utils](docs/api/utils.md)
* [Wallet](docs/cases/wallet.md)



## Support

For issues not covered in the documentation, please jump into our channel and we will do our best to help you out [GenerEOS](https://t.me/generEOS) channel on Telegram.

## Licence

This code is provided as is, under [MIT Licence](LICENCE).


