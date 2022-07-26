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

export function expectAction(
  transaction: TransactResult,
  expectedAction: {
    account: string;
    name: string;
    data?: object;
    authorization?: Authorization[];
  }
): boolean {
  const allActions = getAllActions(transaction.processed.action_traces);
  for (const action of allActions) {
    if (
      action.account === expectedAction.account &&
      action.name === expectedAction.name
    ) {
      if (expectedAction.data) {
        if (
          JSON.stringify(expectedAction.data) !== JSON.stringify(action.data)
        ) {
          throw new Error(
            `Data of action ${action.account}:${action.name} mismatch`
          );
        }
      }

      if (expectedAction.authorization) {
        if (
          JSON.stringify(expectedAction.authorization) !==
          JSON.stringify(action.authorization)
        ) {
          throw new Error(
            `Authorization of action ${action.account}:${action.name} mismatch`
          );
        }
      }

      return true;
    }
  }
  throw new Error(
    `Action ${expectedAction.account}:${expectedAction.name} not found`
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
