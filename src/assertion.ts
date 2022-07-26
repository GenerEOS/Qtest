import { ActionTrace, TransactResult } from "eosjs/dist/eosjs-api-interfaces";
import { Authorization } from "eosjs/dist/eosjs-serialize";
import { Account } from "./account";
import { Asset } from "./asset";

export async function expectThrow(
  promise: Promise<any>,
  message: string
): Promise<boolean> {
  try {
    await promise;
  } catch (e) {
    if (e.toString().includes(message)) {
      return true;
    }
    throw new Error(`Expect to throw ${message} but got ${e.toString()}`);
  }

  throw new Error(`Expect to throw but execute successfully`);
}

export function getAllActions(actionTraces: ActionTrace[]): {
  account: string;
  name: string;
  data?: object;
  authorization?: Authorization[];
}[] {
  let actions = [];
  for (const a of actionTraces) {
    actions.push({
      account: a.receiver,
      name: a.act.name,
      data: a.act.data,
      authorization: a.act.authorization,
    });
    actions = actions.concat(getAllActions(a.inline_traces || []));
  }
  return actions;
}

const isContainedIn = (superObj, subObj) => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == "object") {
      return isContainedIn(superObj[ele], subObj[ele]);
    }
    return subObj[ele] === superObj[ele];
  });
};

export function expectAction(
  transaction: TransactResult,
  expectedAction: {}
): boolean {
  const allActions = getAllActions(transaction.processed.action_traces);

  for (const action of allActions) {
    if (isContainedIn(action, expectedAction)) {
      return true;
    }
  }
  throw new Error(
    `expectedAction: ${JSON.stringify(expectedAction)} not found`
  );
}

export async function expectBalance(account: Account, expectedBalance: Asset) {
  const accountBalance = await account.getBalance();
  if (accountBalance.toString() !== expectedBalance.toString()) {
    throw new Error(
      `Account ${account.name} balance expected ${expectedBalance} to be ${accountBalance}`
    );
  }
}
