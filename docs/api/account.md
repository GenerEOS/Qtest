# Account
The Account class models EOSIO accounts and is the primary entity used to interact with the blockchain. A contract can be deployed on an account and used to send transactions and read table data.

Accounts are created using the createAccount method of the Chain object.
(Note: This is very similar to Hydra)

## Constructor
**constructor(chain: Chain, name: string): Account**

Note: The recommended method of creating a new account is to call Chain.createAccount()

## Methods
### updateAuth(permission: string, parent: string, threshold: number, keys, accounts, waits = [])
  
Updates the permission for an account.

**Example**

Add the permission testauth as a child of the active permission.  The testauth permission will have a threshold of 2 and two keys each with a weight of 1.  The permission acc11.test@eosio.code will have a weight of 2.
```javascript
    await account.updateAuth(
      'testauth',
      'active',
      2,
      [
        {
          key: 'EOS7Gk5QTRcKsK5grAuZkLyPTSw5AcQpCz2VDWGi5DPBvfZAG7H9b',
          weight: 1,
        },
        {
          key: 'EOS8cFt6PzBL79kp9vPwWoX8V6cjwgShbfUsyisiZ1M8QaFgZtep6',
          weight: 1,
        },
      ],
      [
        {
          permission: {
            actor: 'acc11.test',
            permission: 'eosio.code',
          },
          weight: 2,
        },
      ]
    );
```
**Result**
```
cleos -u http://localhost:708 get account testaccount1
created: 2022-07-24T19:46:54.000
permissions: 
     owner     1:    1 EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH
        active     1:    1 EOS5dUsCQCAyHVjnqr6BFqVEE7w8XksnkRtz22wd9eFrSq4NHoKEH
           testauth     2:    1 EOS7Gk5QTRcKsK5grAuZkLyPTSw5AcQpCz2VDWGi5DPBvfZAG7H9b, 1 EOS8cFt6PzBL79kp9vPwWoX8V6cjwgShbfUsyisiZ1M8QaFgZtep6, 2 acc11.test@eosio.code
```

  
  
  **getInfo()**
  
  A wrapper around the **get_account** RPC method.
  
  **getBalance()**
  
  A wrapper around the **get_currency_balance** RPC method.
  
  **addAuth(permission: string, parent: string)**
  
  Adds a permission to an account.  The new permission will inherit the **active** authorization.
  
  **linkAuth(code: string, type: string, permission: string)**
  
  A wrapper around the **eosio:linkauth** contract action.
  
  **addCode(permission: string)**
  
  A helper function to set the **eosio.code** permission on a given account.
  
  **transfer(to: string, quantity: string, memo: string = '')**
  
  A wrapper around **eosio:token** action.  Assumes the chain has been started with system contracts installed.
  
  **setContract(contractName: string): Contract**
  
  A wrapper around the **eosio:setcode** and **eosio:setabi** actions.
  
  **Note:** The contract abi and wasm must be available and configured in **qtest.json**
  
