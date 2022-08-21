# Assertion

A library of test of helper functions specific to Antelope smart contracts

## Functions

### async function expectThrow(promise: Promise &lt;any&gt;,message: string): Promise&lt;boolean&gt;
Waits for **promise** and checks if exception is thrown and **message** matches exception error message.

**Parameters**
1. promise - Promise &lt;any&gt;: Any promise that throws an exception
2. message - string: The string to match against the execption error message

**Returns**

Promise&lt;boolean&gt;: True if message was matched

### getAllActions(actionTraces: ActionTrace[]): { account: string, name: string, data?: object, authorization?: Authorization[] }[]
Extracts a list of all actions from the **actionsTraces** parameter.

**Parameters**
1. actionTraces: ActionTrace[] - List of action traces

**Returns**

A list of actions
```
{ 
   account: string, 
   name: string, 
   data?: object, 
   authorization?: Authorization[] 
}
```

### expectAction(transaction: TransactResult,expectedAction: {account: string; name: string; data?: object; authorization?: Authorization[];}: boolean
Checks if the **transaction** parameter contains **expectedAction**

**Parameters**
1. transaction: TransactResult - Transaction result of an executed transaction
2. expectedAction: {account: string; name: string; data?: object; authorization?: Authorization[];} - The action expected to included in TransactResult

**Returns**

boolean: true if **transaction** contains **expectedTransaction**


### async function expectBalance(account: Account, expectedBalance: Asset)
Checks that **account** balance is equal to **expectedBalance**

**Parameters**
1. account: Account - Account to query balance of
2. expectedBalance: Asset - The exepcted balance of **account**


