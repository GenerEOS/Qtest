import fs from "fs";
import { SerialBuffer } from "eosjs/dist/eosjs-serialize";
import { Asset } from "./asset";
import { Chain } from "./chain";
import { Contract } from "./contract";
import { generateTapos } from "./utils";
import { TransactResult } from "eosjs/dist/eosjs-api-interfaces";
import { GetAccountResult } from "eosjs/dist/eosjs-rpc-interfaces";

export interface KeyWeight {
  key: string;
  weight: number;
}

export interface PermissionLevel {
  actor: string;
  permission: number;
}

export interface PermissionLevelWeight {
  permission: PermissionLevel;
  weight: number;
}

export interface WaitWeight {
  wait_sec: number;
  weight: number;
}

export interface ContractPath {
  abi: string;
  wasm: string;
}

export class Account {
  public name: string;
  public chain: Chain;
  public contract: Contract;
  constructor(chain: Chain, name: string) {
    this.chain = chain;
    this.name = name;
  }

  /**
   * Create or update account permission
   *
   * @param {string} permission target permission name
   * @param {string} parent parent permission
   * @param {number} threshold permission threshold
   * @param {KeyWeight[]} keys array of account keys
   * @param {WaitWeight[]} waits array of waits
   * @return {Promise<TransactResult>} Transaction
   * @api public
   */
  async updateAuth(
    permission: string,
    parent: string,
    threshold: number,
    keys: KeyWeight[],
    accounts: PermissionLevelWeight,
    waits: WaitWeight[] = []
  ): Promise<TransactResult> {
    return this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "updateauth",
            authorization: [
              {
                actor: this.name,
                permission: "owner",
              },
            ],
            data: {
              account: this.name,
              permission,
              parent,
              auth: {
                threshold,
                keys,
                accounts,
                waits,
              },
            },
          },
        ],
      },
      generateTapos()
    );
  }

  /**
   * Get account infomation
   *
   * @return {Promise<GetAccountResult>} Account information
   * @api public
   */
  async getInfo(): Promise<GetAccountResult> {
    return await this.chain.rpc.get_account(this.name);
  }

  /**
   * Get account balance
   *
   * @return {Promise<Asset>} User balance
   * @api public
   */
  async getBalance(): Promise<Asset> {
    const currencyBalance = await this.chain.rpc.get_currency_balance(
      "eosio.token",
      this.name,
      this.chain.coreSymbol.symbol
    );
    return Asset.fromString(currencyBalance[0]);
  }

  /**
   * Add new permission, use the same keys, account as current active permission
   *
   * @param {string} permission target permission name
   * @param {string} parent parent permission name
   * @return {Promise<TransactResult>} Transaction
   * @api public
   */
  async addAuth(permission: string, parent: string): Promise<TransactResult> {
    const accountInfo = await this.getInfo();
    const activePermission = accountInfo.permissions.find(
      (p) => p.perm_name === "active"
    );
    return this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "updateauth",
            authorization: [
              {
                actor: this.name,
                permission: "owner",
              },
            ],
            data: {
              account: this.name,
              permission,
              parent,
              auth: {
                threshold: activePermission.required_auth.threshold,
                keys: activePermission.required_auth.keys,
                accounts: activePermission.required_auth.accounts,
                waits: activePermission.required_auth.waits,
              },
            },
          },
        ],
      },
      generateTapos()
    );
  }

  /**
   * Link permission
   *
   * @param {string} code contract name
   * @param {string} type action name
   * @param {string} permission permission name
   * @return {Promise<TransactResult>} Transaction
   * @api public
   */
  async linkAuth(
    code: string,
    type: string,
    permission: string
  ): Promise<TransactResult> {
    return this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "linkauth",
            authorization: [
              {
                actor: this.name,
                permission: "owner",
              },
            ],
            data: {
              account: this.name,
              code,
              type,
              requirement: permission,
            },
          },
        ],
      },
      generateTapos()
    );
  }

  /**
   * Add `eosio.code` to permission
   *
   * @param {string} permission permission name to add `eosio.code`
   * @return {Promise<TransactResult>} Transaction
   * @api public
   */
  async addCode(permission: string): Promise<TransactResult> {
    const accountInfo = await this.getInfo();
    const updatingPermission = accountInfo.permissions.find(
      (p) => p.perm_name === permission
    );
    let accountPermission = [];
    if (updatingPermission) {
      const codePermission = updatingPermission.required_auth.accounts.find(
        (a) =>
          a.permission.actor === this.name &&
          a.permission.permission === "eosio.code"
      );
      if (codePermission) {
        throw new Error("Already set code for this account");
      }
      accountPermission = accountPermission.concat(
        updatingPermission.required_auth.accounts
      );
      accountPermission.push({
        permission: {
          actor: this.name,
          permission: "eosio.code",
        },
        weight: updatingPermission.required_auth.threshold,
      });
    } else {
      accountPermission.push({
        permission: {
          actor: this.name,
          permission: "eosio.code",
        },
        weight: 1,
      });
    }
    return this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "updateauth",
            authorization: [
              {
                actor: this.name,
                permission: "owner",
              },
            ],
            data: {
              account: this.name,
              permission,
              parent: updatingPermission ? updatingPermission.parent : "active",
              auth: {
                threshold: updatingPermission
                  ? updatingPermission.required_auth.threshold
                  : 1,
                keys: updatingPermission
                  ? updatingPermission.required_auth.keys
                  : [],
                accounts: accountPermission,
                waits: updatingPermission
                  ? updatingPermission.required_auth.waits
                  : [],
              },
            },
          },
        ],
      },
      generateTapos()
    );
  }

  /**
   * Transfer token from account
   *
   * @param {string} to receiver
   * @param {string} quantity Transfer amount
   * @return {Promise<TransactResult>} Transaction
   * @api public
   */
  async transfer(
    to: string,
    quantity: string,
    memo: string = ""
  ): Promise<TransactResult> {
    return this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio.token",
            name: "transfer",
            authorization: [
              {
                actor: this.name,
                permission: "active",
              },
            ],
            data: {
              from: this.name,
              to,
              quantity,
              memo,
            },
          },
        ],
      },
      generateTapos()
    );
  }

  /**
   * Set contract to this account
   *
   * @param {ContractPath} contractPath path to abi and wasm file
   * @return {Promise<Contract>} Contract instance
   * @api public
   */
  async setContract(contractPath: ContractPath) {
    if (!fs.existsSync(contractPath.abi) || !fs.existsSync(contractPath.wasm)) {
      throw new Error(
        "can not find abi or wasm file of contract " +
          JSON.stringify(contractPath, null, 2)
      );
    }
    const buffer = new SerialBuffer({
      textEncoder: this.chain.api.textEncoder,
      textDecoder: this.chain.api.textDecoder,
    });

    let abiJSON = JSON.parse(fs.readFileSync(contractPath.abi, "utf8"));
    const abiDefinitions = this.chain.api.abiTypes.get("abi_def");

    abiJSON = abiDefinitions.fields.reduce(
      (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
      abiJSON
    );
    abiDefinitions.serialize(buffer, abiJSON);
    const serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString(
      "hex"
    );
    const wasmHexString = fs.readFileSync(contractPath.wasm).toString("hex");

    const tx = await this.chain.api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "setcode",
            authorization: [
              {
                actor: this.name,
                permission: "active",
              },
            ],
            data: {
              account: this.name,
              vmtype: 0,
              vmversion: 0,
              code: wasmHexString,
            },
          },
          {
            account: "eosio",
            name: "setabi",
            authorization: [
              {
                actor: this.name,
                permission: "active",
              },
            ],
            data: {
              account: this.name,
              abi: serializedAbiHexString,
            },
          },
        ],
      },
      generateTapos()
    );

    this.contract = new Contract(this, wasmHexString, abiJSON);
    return this.contract;
  }

  /**
   * from an existing contract to this account
   *
   * @return {Promise<Contract>} Contract instance
   * @api public
   */
  async loadContract() {
    const getCodeResult = await this.chain.rpc.get_code(this.name);
    if (
      getCodeResult.code_hash ===
      "0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      throw new Error(`Account ${this.name} contract_code does not exist`);
    }
    if (!getCodeResult.abi) {
      throw new Error(`Account ${this.name} contract_abi does not exist`);
    }
    this.contract = new Contract(
      this,
      Buffer.from(getCodeResult.wasm).toString("hex"),
      getCodeResult.abi
    );
    return this.contract;
  }
}
