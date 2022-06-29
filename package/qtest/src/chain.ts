import fetch from 'node-fetch';
import { Api, JsonRpc } from 'eosjs';
import { Action } from 'eosjs/dist/eosjs-serialize';
import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { ReadOnlyTransactResult, PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';
import { Account } from './account';
import { killExistingContainer, startChainContainer, getChainIp } from './dockerClient';
import { generateTapos, toAssetQuantity } from './utils';
import { signatureProvider, initializedChain } from './wallet';

export class Chain {
  public coreToken = {
    symbol: 'WAX',
    decimal: 8
  };
  public api;
  public rpc;
  public accounts: Account[];
  constructor() { }

  async setupChain(systemSetup: boolean) {
    await killExistingContainer();
    await startChainContainer();
    // const chainIp = await getChainIp();
    // this.rpc = new JsonRpc(`http://${chainIp}:8888`, { fetch });
    this.rpc = new JsonRpc(`http://127.0.0.1:8888`, { fetch });
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });
    this.accounts = await this.createTestAccounts(10);
    initializedChain.push(this);
  }

  async createTestAccounts(length: number) {
    let testAccountNames: string[] = [];
    for (let i = 0; i < length; i++) {
      testAccountNames.push(`acc${Math.floor(i/5) + 1}${Math.floor(i%5) + 1}.test`);
    }
    return this.createAccounts(testAccountNames);
  }

  async createAccounts(accounts, supplyAmount = toAssetQuantity(100, this.coreToken)): Promise<Account[]> {
    let accountInstances: Account[] = [];
    for (const account of accounts) {
      accountInstances.push(await this.createAccount(account, supplyAmount));
    }

    return accountInstances;
  }

  async createAccount(account: string, supplyAmount = toAssetQuantity(100, this.coreToken), bytes: number = 1024 * 1024): Promise<Account> {
    await this.api.transact({
      actions: [
        {
          account: 'eosio',
          name: 'newaccount',
          authorization: [
            {
              actor: 'eosio',
              permission: 'active',
            },
          ],
          data: {
            creator: 'eosio',
            name: account,
            owner: {
              threshold: 1,
              keys: [
                {
                  key: signatureProvider.availableKeys[0],
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
            active: {
              threshold: 1,
              keys: [
                {
                  key: signatureProvider.availableKeys[0],
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
          },
        },
        {
          account: 'eosio',
          name: 'buyrambytes',
          authorization: [
            {
              actor: 'eosio',
              permission: 'active',
            },
          ],
          data: {
            payer: 'eosio',
            receiver: account,
            bytes,
          },
        },
        {
          account: 'eosio',
          name: 'delegatebw',
          authorization: [
            {
              actor: 'eosio',
              permission: 'active',
            },
          ],
          data: {
            from: 'eosio',
            receiver: account,
            stake_net_quantity: toAssetQuantity(10, this.coreToken),
            stake_cpu_quantity: toAssetQuantity(10, this.coreToken),
            transfer: 1,
          },
        },
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [
            {
              actor: 'eosio',
              permission: 'active',
            },
          ],
          data: {
            from: 'eosio',
            to: account,
            quantity: supplyAmount,
            memo: 'supply to test account',
          },
        },
      ],
    },
      generateTapos()
    )
    return new Account(this, account);
  }

  async pushAction(action: Action, broadcast: boolean = true, sign: boolean = true, expireSeconds: number = 120): Promise<TransactResult|ReadOnlyTransactResult|PushTransactionArgs> {
    return this.api.transact({ actions: [action] }, { broadcast, sign, expireSeconds, blocksBehind: 3 });
  }

  async pushActions(actions: Action[], broadcast: boolean = true, sign: boolean = true, expireSeconds: number = 120): Promise<TransactResult|ReadOnlyTransactResult|PushTransactionArgs> {
    return this.api.transact({ actions }, { broadcast, sign, expireSeconds, blocksBehind: 3 });
  }
}