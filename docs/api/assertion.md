# Assertion

A library of test of helper functions specific to EOSIO smart contracts

## Functions

**async function expectThrow(
  promise: Promise &lt;any&gt;,
  message: string
): Promise&lt;boolean&gt;**

**getAllActions(actionTraces: ActionTrace[])**

**expectAction(
  transaction: TransactResult,
  expectedAction: {
    account: string;
    name: string;
    data?: object;
    authorization?: Authorization[];
  }
): boolean**

**async function expectBalance(account: Account, expectedBalance: Asset)**
