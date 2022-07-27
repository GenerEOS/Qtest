# Contract

The Contract object models an Antelope contract.

## Properties
### wasm: string
WASM of the contract
### abi: any
ABI of the contract
### account: Account
The host account of the contract
### abiSerializer: any
The ABI serializer for the contract
### action: { [ key: string]: ( data: object, authorization?: [{ actor: string, permission: string }] ) => Promise&lt;TransactResult&gt; }
A dictionary of actions defined in the contract
### table: { [ key: string]: Table }
A dictionary of tables defined in the contract

