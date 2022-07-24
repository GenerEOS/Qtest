# Welcome to EOS Helper 

EOS Helper is a Javascript-based [EOS](https://eosnetwork.com/) smart-contract testing framework, created by [GenerEOS](https://genereos.io).

EOS Helper gives you the ability to dockerize an EOSIO node that can run on any system. This allows the ability for the user to host it on their system easily and automated with the ability to test for multiple EOSIO based chains i.e. EOS, WAX, TELOS.

## Overview

### Installation

[Refer](example)

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
  // transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  testEnvironment: "node",
  testTimeout: 120 * 1e3,
};

### Run
Update test command in package.json

```
"test": "jest"
```

Run

```
npm run test

> examples@1.0.0 test
> jest

 PASS  tests/test.js (22.428 s)
  example test
    ✓ push action (526 ms)
    ✓ load contract table data (233 ms)
    ✓ modify contract table data (286 ms)
    ✓ erase contract table data (74 ms)
    ✓ push action to store log and then read table data (257 ms)
    ✓ should create new item and add time to buy item (10412 ms)
```

### Usage
```
const { Chain } = require("@genereos.io/qtest");
const { expectAction } = require("@genereos.io/qtest");
```

## User documentation

* [Introduction to EOS Helper](docs/tutorials/00.IntroductionToEOSFactory.md)
* [Installing EOS Helper](docs/tutorials/01.InstallingEOSFactory.md)
* [Using EOS Helper to write contract tests](docs/tutorials/02.InteractingWithEOSContractsInEOSFactory.md)
* [Building and Deploying EOS Smart-Contracts in EOS Helper](docs/tutorials/03.BuildingAndDeployingEOSContractsInEOSFactory.md)
* [Interacting with EOS Helper in a smart contract project](docs/tutorials/04.WorkingWithEOSContractsUsingEOSFactoryInVSC.md)
* [Inegrating with CI/CD pipeline] ()

## EOS Helper API

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


