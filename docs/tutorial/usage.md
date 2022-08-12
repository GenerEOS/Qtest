# Usage

## Quick Start

Refer to the example project and automated tests for examples on usage

* [Example](../../example/tests/test.js)
* [Tests](../../test)

## Chain configuration
```
// Setup a chain with EOS snaphot
// 10 test accounts are automtically created
chain = await Chain.setupChain('EOS');

// access test accounts
const account1 = chain.accounts[1];
const account2 = chain.accounts[2];

// create account
let newAccount = await chain.system.createAccount("newaccount");
```

## Contracts

```
// deploy contract
let contract = await newAccount.setContract({
      abi: "./contracts/build/testcontract.abi",
      wasm: "./contracts/build/testcontract.wasm",
    });
    
// push action
let transaction = await contract.action.testaction(
        { user: newAccount.name },
        [{ actor: newAccount.name, permission: "active" }]
      );
```

