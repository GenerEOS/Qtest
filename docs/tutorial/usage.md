# Usage

## Quick Start

Refer to the example project and automated tests for examples on usage

* [Example](../../example/tests/test.js)
* [Tests](../../test)

## Chain
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

## Tables

Before you can use the Qtest table seeding functions you will need to perform the following to configure the Qtest contract utility.

- download [qtest.hpp](../../macro/qtest.hpp)
- copy qtest.hpp to your contract include file
- add the following line to contract header file
  ```
  #include "qtest.hpp"`
  ```



### Inserting data
```
 await contract.table.testtable.insert({
        scope1: [
          {
            user: "name1",
            value1: 1122,
            value2: "test1",
          },
          {
            user: "name2",
            value1: 2233,
            value2: "test2",
          },
        ],
        scope2: [
          {
            user: "name3",
            value1: 999,
            value2: "test3",
          },
        ],
      });
```
### Updating data
```
 await contract.table.testtable.modify({
        scope2: [
          {
            user: "name3",
            value1: 999,
            value2: "new value",
          },
        ],
      });
```
### Deleting data
```
await inittableContract.table.tablename1.erase({
        scope2: [
          {
            user: "name3",
            value1: 999,
            value2: "new value",
          },
        ],
      });
```
## Time

The Qtest libraries provides a mechanism to skip forward in time.  Moving backward in time is not possible.  Block number is not affected by this action.

### Increment time

```
// skip ahead 2 hours
await chain.time.increase(2 * 60 * 60);
```

### Skip to time

```
// Create Date 1 month in future
const oneMonthAhead = new Date(
      currentBlockTimeMilliSecond + 30 * 24 * 60 * 60 * 1000
);

// Set chain date
await chain.time.increaseTo(oneMonthAhead.getTime());
```
