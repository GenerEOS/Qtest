# Account
The Account class models EOSIO accounts and is the primary entity used to interact with the blockchain. A contract can be deployed on an account and used to send transactions and read table data.

Accounts are created using the createAccount method of the Chain object.
(Note: This is very similar to Hydra)

## Constructor
**constructor(chain: Chain, name: string): Account**

Note: The recommended method of creating a new account is to call Chain.createAccount()

## Methods
**updateAuth(
    permission: string,
    parent: string,
    threshold: number,
    keys,
    accounts,
    waits = []
  )**
  
  Updates the permission for an account.
  
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
  
