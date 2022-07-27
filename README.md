# Welcome to Qtest 

Qtest is an open-source Javascript-based [Antelope](https://antelope.io/) smart-contract testing framework, created by [GenerEOS](https://genereos.io) with funding from the [EOS Network Foundation](https://eosnetwork.com/).

Qtest gives you the ability to dockerize a Leap node. This allows a developer to host it on any system that supports [Docker](https://docs.docker.com). Using Qtest, developers can simplify testing of smart contracts and automate things like table seeding, account creation, and other initialisation tasks that are required before running complex test scenarios. Qtest already can be used to streamline testing for multiple Antelope based chains including EOS, WAX, and TELOS, with the ability to add additional chain support easily.

#### Noteworthy Features

- Ability to run tests in parallel
- Supports the snapshot for EOS/WAX/TLOS with lastest system contracts out of the box
- Supports testing on ARM/AMD architectures
- Ability to insert/modify/erase data for each table
- Update the chain time to fast-forward the chain and allow testing future states

## Quick start

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
Config `jest`: Create jest.config.js and add the following:

```
module.exports = {
  // transform: { "^.+\\.(ts|tsx)$": "ts-jest" },
  testEnvironment: "node",
  testTimeout: 120 * 1e3,
};
```

#### Docker

To install docker please refer [here](https://docs.docker.com/engine/install/)

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
**Api** and **JsonRpc** from **eosjs** are available through the **[Chain](docs/api/chain.md)** class 


* [Using Qtest to write contract tests](docs/tutorial/usage.md)

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

## Support

For issues not covered in the documentation, please jump into our channel and we will do our best to help you out [GenerEOS](https://t.me/generEOS) channel on Telegram.

## Licence

This code is provided as is, under [MIT Licence](LICENCE).


