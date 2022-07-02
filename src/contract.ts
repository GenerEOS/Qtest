const fs = require('fs');
import { Account } from './account';
import { createAbiSerializer } from './serializer';
import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { Table } from './table';

export class Contract {
  public wasm: string;
  public abi: any;
  public account: Account;
  public abiSerializer: any;
  public action: { [ key: string]: ( data: object, authorization?: [{ actor: string, permission: string }] ) => Promise<TransactResult> };
  public table: { [ key: string]: Table };

  constructor(account, wasm, abi) {
    this.wasm = wasm;
    this.abi = abi;
    this.account = account;
    this.abiSerializer = createAbiSerializer(abi);
    this.action = {};
    for (const act of this.abi.actions) {
      this.action[act.name] = 
        async (
          data = {},
          authorization = [{ actor: this.account.name, permission: `active` }]
        ): Promise<TransactResult> => {
          const action = {
              account: this.account.name,
              name: act.name,
              authorization: authorization,
              data: data,
          };

          // @ts-ignore
          return this.account.chain.pushAction(action) as TransactResult;
      };
    }

    this.table = {};
    for (const table of this.abi.tables) {
      const abiSerializer = this.abiSerializer.tables.get(table.name);
      this.table[table.name] = new Table(table.name, account, abiSerializer);
    }
  }
}