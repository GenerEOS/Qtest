import { SerialBuffer } from "eosjs/dist/eosjs-serialize";
import { GetTableRowsResult } from "eosjs/dist/eosjs-rpc-interfaces";
import { Account } from "./account";

export class Table {
  public name: string;
  public account: Account;
  public serializer: any;

  constructor(name: string, account: Account, serializer: any) {
    this.name = name;
    this.account = account;
    this.serializer = serializer;
  }

  async get(option: {
    scope: string;
    lower_bound?: any;
    upper_bound?: any;
    index_position?: number;
    key_type?: string;
    limit?: number;
    reverse?: boolean;
    show_payer?: boolean;
  }): Promise<GetTableRowsResult> {
    return this.account.chain.rpc.get_table_rows({
      json: true,
      code: this.account.name,
      table: this.name,
      ...option,
    });
  }

  /**
   * load data to contract table
   *
   * @param { [ key: string] : object } scopeRowsData scope and rows data
   * @example
   * {
   *   scope: [{
   *      id: 1,
   *      name: 'daniel111111'
   *   }]
   * }
   */
  async insert(scopeRowsData: { [key: string]: object[] }) {
    if (!this.account.contract.action.eosinsert) {
      throw new Error("Contract does not allow to insert data");
    }

    const actionData = [];
    for (const scope of Object.keys(scopeRowsData)) {
      for (const rows of scopeRowsData[scope]) {
        const buffer = new SerialBuffer({
          textEncoder: new TextEncoder(),
          textDecoder: new TextDecoder(),
        });
        this.serializer.serialize(buffer, rows);
        actionData.push({
          table_name: this.name,
          scope,
          row_data: buffer.asUint8Array(),
        });
      }
    }

    return this.account.contract.action.eosinsert(
      {
        payload: actionData,
      },
      [
        {
          actor: "eosio",
          permission: "active",
        },
      ]
    );
  }

  /**
   * modify data to contract table
   *
   * @param { [ key: string] : object } scopeRowsData scope and rows data
   * @example
   * {
   *   scope: [{
   *      id: 1,
   *      name: 'daniel111111'
   *   }]
   * }
   */
  async modify(scopeRowsData: { [key: string]: object[] }) {
    if (!this.account.contract.action.eosmodify) {
      throw new Error("Contract does not allow to insert data");
    }

    const actionData = [];
    for (const scope of Object.keys(scopeRowsData)) {
      for (const rows of scopeRowsData[scope]) {
        const buffer = new SerialBuffer({
          textEncoder: new TextEncoder(),
          textDecoder: new TextDecoder(),
        });
        this.serializer.serialize(buffer, rows);
        actionData.push({
          table_name: this.name,
          scope,
          row_data: buffer.asUint8Array(),
        });
      }
    }

    return this.account.contract.action.eosmodify(
      {
        payload: actionData,
      },
      [
        {
          actor: "eosio",
          permission: "active",
        },
      ]
    );
  }

  /**
   * erase data to contract table
   *
   * @param { [ key: string] : object } scopeRowsData scope and rows data
   * @example
   * {
   *   scope: [{
   *      id: 1,
   *      name: 'daniel111111'
   *   }]
   * }
   */
  async erase(scopeRowsData: { [key: string]: object[] }) {
    if (!this.account.contract.action.eoserase) {
      throw new Error("Contract does not allow to insert data");
    }

    const actionData = [];
    for (const scope of Object.keys(scopeRowsData)) {
      for (const rows of scopeRowsData[scope]) {
        const buffer = new SerialBuffer({
          textEncoder: new TextEncoder(),
          textDecoder: new TextDecoder(),
        });
        this.serializer.serialize(buffer, rows);
        actionData.push({
          table_name: this.name,
          scope,
          row_data: buffer.asUint8Array(),
        });
      }
    }

    return this.account.contract.action.eoserase(
      {
        payload: actionData,
      },
      [
        {
          actor: "eosio",
          permission: "active",
        },
      ]
    );
  }
}
