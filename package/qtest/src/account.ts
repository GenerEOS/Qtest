const fs = require('fs');
import { SerialBuffer } from 'eosjs/dist/eosjs-serialize';
import { Chain } from './chain';
import { Contract } from './contract';
import { generateTapos } from './utils';

export class Account {
  public name: string;
  public chain: Chain;
  public contract: Contract;
  constructor(chain: Chain, name: string) {
    this.chain = chain;
    this.name = name;
  }

  async updateAuth(permission: string, parent: string, threshold: number, keys, accounts, waits = []) {
    return this.chain.api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'updateauth',
          authorization: [
            {
              actor: this.name,
              permission: 'owner',
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
              waits
            },
          },
        }
      ],
    },
      generateTapos()
    )
  };

  async getInfo() {
    return await this.chain.rpc.get_account(this.name);
  }

  async getBalance() {
    const currencyBalance = await this.chain.rpc.get_currency_balance('eosio.token', this.name, 'WAX');
    return Number(currencyBalance[0].split(' ')[0]);
  }

  async addAuth(permission: string, parent: string) {
    const accountInfo = await this.getInfo();
    const activePermission = accountInfo.permissions.find(p => p.perm_name === 'active');
    return this.chain.api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'updateauth',
          authorization: [
            {
              actor: this.name,
              permission: 'owner',
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
        }
      ],
    },
      generateTapos()
    )
  };

  async linkAuth(code: string, type: string, permission: string) {
    return this.chain.api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'linkauth',
          authorization: [
            {
              actor: this.name,
              permission: 'owner',
            },
          ],
          data: {
            account: this.name,
            code,
            type,
            requirement: permission
          }
        }
      ],
    },
      generateTapos()
    )
  };

  async addCode(permission: string) {
    const accountInfo = await this.getInfo();
    let updatingPermission = accountInfo.permissions.find(p => p.perm_name === permission);
    let accountPermission = [];
    if (updatingPermission) {
      const codePermission = updatingPermission.required_auth.accounts.find(a => a.permission.actor === this.name && a.permission.permission === 'eosio.code');
      if (codePermission) {
        throw new Error('Already set code for this account');
      }
      accountPermission = accountPermission.concat(updatingPermission.required_auth.accounts);
      accountPermission.push({
        permission: {
          actor: this.name,
          permission: 'eosio.code'
        },
        weight: updatingPermission.required_auth.threshold
      });
    } else {
      accountPermission.push({
        permission: {
          actor: this.name,
          permission: 'eosio.code'
        },
        weight: 1
      });
    }
    return this.chain.api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'updateauth',
          authorization: [
            {
              actor: this.name,
              permission: 'owner',
            },
          ],
          data: {
            account: this.name,
            permission,
            parent: updatingPermission ? updatingPermission.parent : 'active',
            auth: {
              threshold: updatingPermission ? updatingPermission.required_auth.threshold : 1,
              keys: updatingPermission ? updatingPermission.required_auth.keys : [],
              accounts: accountPermission,
              waits: updatingPermission ? updatingPermission.required_auth.waits : []
            },
          },
        }
      ],
    },
      generateTapos()
    )
  };

  async transfer(to: string, quantity: string, memo: string = '') {
    return this.chain.api.transact({
      actions: [
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [
            {
              actor: this.name,
              permission: 'active',
            },
          ],
          data: {
            from: this.name,
            to,
            quantity,
            memo
          }
        }
      ],
    },
      generateTapos()
    )
  };

  async setContract(wasmFile, abiFile) {
    const buffer = new SerialBuffer({
      textEncoder: this.chain.api.textEncoder,
      textDecoder: this.chain.api.textDecoder,
    });
  
    let abiJSON = JSON.parse(fs.readFileSync(abiFile, 'utf8'));
    const abiDefinitions = this.chain.api.abiTypes.get('abi_def');
  
    abiJSON = abiDefinitions.fields.reduce(
      (acc, { name: fieldName }) =>
        Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
      abiJSON
    );
    abiDefinitions.serialize(buffer, abiJSON);
    const serializedAbiHexString = Buffer.from(buffer.asUint8Array()).toString('hex');
  
    const wasmHexString = fs.readFileSync(wasmFile).toString('hex');
  
    const tx = await this.chain.api.transact(
      {
        actions: [
          {
            account: 'eosio',
            name: 'setcode',
            authorization: [
              {
                actor: this.name,
                permission: 'active',
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
            account: 'eosio',
            name: 'setabi',
            authorization: [
              {
                actor: this.name,
                permission: 'active',
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
  
    this.contract = new Contract(this, wasmFile, abiJSON);
    return this.contract;
  }
}