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
