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
  receiver: string;
  name: string;
  data?: object;
  authorization?: Authorization[];
}[] {
  let actions = [];
  for (const a of actionTraces) {
    actions.push({
      receiver: a.receiver,
      name: a.act.name,
      data: a.act.data,
      authorization: a.act.authorization,
    });
    actions = actions.concat(getAllActions(a.inline_traces || []));
  }
  return actions;
}

export async function expectAction(
  transaction: TransactResult,
  code: string,
  actionName: string,
  data?: object,
  authorization?: Authorization[]
): boolean {
  const expectedAction = {
    receiver: code,
    name: actionName,
    data,
    authorization,
  };
  const traces = getAllActions(transaction.processed.action_traces);

  for (const action of traces) {
    if (action.receiver === code && action.name === actionName) {
      if (!(data || authorization)) {
        return true;
      } else if (data) {
        if (JSON.stringify(action.data) === JSON.stringify(data)) return true;
      } else if (authorization) {
        if (
          JSON.stringify(action.authorization) === JSON.stringify(authorization)
        )
          return true;
      }
    }
  }
  throw new Error(
    `Expected: ${JSON.stringify(expectedAction)} \nReceived: ${JSON.stringify(
      traces
    )}`
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
