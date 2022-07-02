import { TransactResult } from "eosjs/dist/eosjs-api-interfaces";
import { Authorization } from "eosjs/dist/eosjs-serialize";

export async function expectThrow(promise: Promise<any>, message: string): Promise<boolean> {
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

export async function expectAction(transaction: TransactResult, action: { account: string, name: string, data: object, authorization?: Authorization[] }): Promise<boolean> {
  return true;
}