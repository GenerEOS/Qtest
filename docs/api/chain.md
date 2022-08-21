# Chain

The Blockchain object keeps the state of all accounts and contracts.

## Properties
### coreSymbol: Symbol
Core symbol of the chain object (EOS, TLOS, WAX ...)
### tokenSupply: Asset
Token supply of **coreSymbol**
### api
Reference to eosjs api interface
### rpc
Reference to eosjs rpc interface
### accounts: Account[]
List of accounts created
### timeAdded: number
Amount of time skipped
### port: number
Local port number the RPC api is bound to



## Methods
### static async setupChain(chainName: string): Promise&lt;Chain&gt;
Setup new testing chain, setup chain docker instance, initialize api client, creates the following 10 test accounts:
- acc11.test
- acc12.test
- acc13.test
- acc14.test
- acc15.test
- acc21.test
- acc22.test
- acc23.test
- acc24.test
- acc25.test

Valid chainName values: WAX, EOS and TLOS

### clear()
Clear chain after test, remove chain docker instance, relase docker port

### getInfo(): Promise&lt;GetInfoResult&gt;
  
A wrapper around the **get_info** RPC call. 

### headBlockNum(): Promise&lt;number&gt;

Returns the head block number of the chain.

### isProducingBlock(): Promise&lt;boolean&gt;

Checks if the chain is active and producing new blocks.

###   pushAction(action: Action, broadcast: boolean = true, sign: boolean = true, expireSeconds: number = 120): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> 

push action to chain.

###   pushActions(action: Action, broadcast: boolean = true, sign: boolean = true, expireSeconds: number = 120): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> 

push multiple actions to the chain in a single transaction.

### waitTillNextBlock(numBlocks: number = 1)

Wait numblocks from the current block and returns a composite containing the startblock and the number of blocks that have elapsed.

**Returns**
```json
   {
      startingBlock: Block
      elapsedBlocks: 1
    }
```
### waitTillBlock(target: number)

wait until chain produce `target` block number
