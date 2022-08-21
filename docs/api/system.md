# System

The System class provides methods to assist with account creation.  The system class will almost always be used indirectly via the Chain class.

## Properties
### chain: Chain
Reference to the Chain instance

## Constructor

### constructor(rpc: JsonRpc, api: Api, port: number, tokenSymbol: string)

## Methods

### createAccounts(accounts: string[], supplyAmount = this.chain.coreSymbol.convertAssetString(100)): Promise&lt;Account[]&gt;

Create multiple blockchain acounts.

### createAccount(account: string, supplyAmount = this.chain.coreSymbol.convertAssetString(100), bytes: number = 1024 * 1024): Promise&lt;Account&gt;

Create a single blockchain account.
