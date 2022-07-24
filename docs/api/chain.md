# Chain

The Blockchain object keeps the state of all accounts and contracts.

## Methods
### static async setupChain(chainName: string): Promise&lt;Chain&gt;
Setup new testing chain, setup chain docker instance, initialize api client, create 10 test accounts

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
