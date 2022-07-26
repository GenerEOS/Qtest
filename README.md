# Welcome to Q-test 

Q-test is a Javascript-based [EOS](https://eosnetwork.com/) smart-contract testing framework, created by [GenerEOS](https://genereos.io).

Q-test gives you the ability to dockerize an EOSIO node that can run on any system. This allows the ability for the user to host it on their system easily and automated with the ability to test for multiple EOSIO based chains i.e. EOS, WAX, TELOS, UX.

## Overview

### Installation

Refer to [an example project](example)

```bash
npm install --save-dev @genereos.io/qtest
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
const { Chain } = require("@genereos.io/qtest");
const { expectAction } = require("@genereos.io/qtest");
```

## User documentation

* [Introduction to Q-test](docs/tutorials/00.IntroductionToEOSFactory.md)
* [Installing Q-test](docs/tutorials/01.InstallingEOSFactory.md)
* [Using Q-test to write contract tests](docs/tutorials/02.InteractingWithEOSContractsInEOSFactory.md)
* [Building and Deploying EOS Smart-Contracts in Q-test](docs/tutorials/03.BuildingAndDeployingEOSContractsInEOSFactory.md)
* [Interacting with Q-test in a smart contract project](docs/tutorials/04.WorkingWithEOSContractsUsingEOSFactoryInVSC.md)
* [Inegrating with CI/CD pipeline] ()

## Q-test API

* [Assertion](docs/api/assertion.md)
* [Asset - Class](docs/api/asset.md)
* [Account - Class](docs/api/account.md)
* [Chain - Class](docs/api/chain.md)
* [Contract - Class](docs/api/contract.md)
* [dockerClient](docs/api/dockerclient.md)
* [serializer](docs/api/serializer.md)
* [Symbol - Class](docs/api/symbol.md)
* [Table - Class](docs/api/table.md)
* [utils](docs/api/utils.md)
* [Wallet](docs/cases/wallet.md)


## Support

For issues not covered in the documentation, please jump into our channel and we will do our best to help you out [GenerEOS](https://t.me/generEOS) channel on Telegram.

## Licence

This code is provided as is, under [MIT Licence](LICENCE).


