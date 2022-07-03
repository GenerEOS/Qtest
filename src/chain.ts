import fetch from 'node-fetch';
import { Api, JsonRpc } from 'eosjs';
import { Action } from 'eosjs/dist/eosjs-serialize';
import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { ReadOnlyTransactResult, PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';
import { Account } from './account';
import { killExistingContainer, startChainContainer, getChainIp, manipulateChainTime } from './dockerClient';
import { generateTapos, toAssetQuantity, sleep } from './utils';
import { signatureProvider } from './wallet';

export class Chain {
  public coreToken = {
    symbol: 'WAX',
    decimal: 4
  };
  public api;
  public rpc;
  public accounts: Account[];
  public timeAdded: number;
  constructor() { }

  async setupChain(systemSetup: boolean = true) {
    await killExistingContainer();
    await startChainContainer();

    const chainIp = await getChainIp();
    this.rpc = new JsonRpc(`http://${chainIp}:8888`, { fetch });
    // this.rpc = new JsonRpc(`http://127.0.0.1:8888`, { fetch });
    this.api = new Api({
      rpc: this.rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    await this.waitForChainStart();
    if (systemSetup) {
      await this.waitForSystemContractInitialized();
    }

    this.accounts = await this.createTestAccounts(10);
    this.timeAdded = 0;
  }

  async getInfo() {
    return await this.rpc.get_info();
  }

  async headBlockNum(): Promise<number> {
    return +((await this.getInfo()).head_block_num);
  }

  async isProducingBlock(): Promise<boolean> {
    try {
      const currentHeadBlock = await this.headBlockNum();
      await sleep(600);
      return Number(await this.headBlockNum()) - Number(currentHeadBlock) > 0;
    } catch (e) {
      return false;
    }
  }

  async isSystemContractInitialized(): Promise<boolean> {
    try {
      const rammarketTables = await this.rpc.get_table_rows({
        json: true,
        code: 'eosio',
        table: 'rammarket',
        scope: 'eosio'
      });
      if (rammarketTables.rows && rammarketTables.rows.length) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
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

  /**
   * Increase time of chain. This function only adds time to the current block time (never reduces). Realize that it is not super accurate.You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.
   *
   * @param {Number} time Number of seconds to increase the chain time by
   * @param {String=} fromBlockTime Optional blocktime string. The `time` parameter will add to this absolute value as the target to increase. If this is missing, the `time` value just adds to the current blockchain time time to.
   * @return {Promise<Number>} The approximate number of milliseconds that the chain time has been increased by (not super reliable - it is usually more)
   * @api public
   */
  async addTime(time: number, fromBlockTime: string = ''): Promise<number> {
    if (time < 0 ) {
      throw new Error('adding time much be greater than zero');
    }
    const { elapsedBlocks, startingBlock } = await this.waitTillNextBlock(2); // This helps resolve any pending transactions
    let startTime = this.blockTimeToMs(startingBlock.head_block_time);
    let addingTime;
    let fromBlockTimeMs = startTime;
    if (fromBlockTime) {
      fromBlockTimeMs = this.blockTimeToMs(fromBlockTime);
      addingTime = Math.floor(
        Math.max(0, time - (startTime - fromBlockTimeMs) / 1000 - elapsedBlocks * 0.5)
      );
    } else {
      addingTime = Math.floor(
        Math.max(0, time - elapsedBlocks * 0.5)
      );
    };

    if (addingTime === 0) {
      return 0;
    }
    let tries = 0;
    const maxTries = 10;
    do {
      if (tries >= maxTries) {
        throw new Error(
          `Exceeded ${maxTries} tries to change the blockchain time. Test cannot proceed.`
        );
      }
      await manipulateChainTime(this.timeAdded + addingTime);
      tries++;
      await sleep(1000);
    } while (!(await this.isProducingBlock()));
    this.timeAdded += addingTime;
    await this.waitTillNextBlock(2);
    const endTime = this.blockTimeToMs((await this.getInfo()).head_block_time);
    return endTime - fromBlockTimeMs;
  }

  private async waitForChainStart() {
    let retryCount = 0;
    while (!(await this.isProducingBlock())) {
      await sleep(1000);
      if (retryCount === 10) {
        throw new Error('can not get chain status');
      }
      retryCount++;
    }
  }

  async waitTillNextBlock(numBlocks: number = 1) {
    const startingBlock = await this.getInfo();
    const currentBlockHeight = await this.waitTillBlock(
      startingBlock.head_block_num + numBlocks
    );
    return {
      startingBlock,
      elapsedBlocks: currentBlockHeight - Number(startingBlock.head_block_num),
    };
  }

  async waitTillBlock(target) {
    let currentBlockHeight = await this.headBlockNum();
    while (currentBlockHeight < target) {
      await sleep(500);
      currentBlockHeight = await this.headBlockNum();
    }
    return currentBlockHeight;
  }

  blockTimeToMs(blockTime: string): number {
    const blockTimeDate = new Date(blockTime);
    return blockTimeDate.getTime();
  }

  private async waitForSystemContractInitialized() {
    // let retryCount = 0;
    // while (!(await this.isSystemContractInitialized())) {
    //   await sleep(1000);
    //   if (retryCount === 15) {
    //     throw new Error('can not initilize system contract');
    //   }
    //   retryCount++;
    // }
    await sleep(15000);
    await this.pushAction({
      account: 'eosio',
      name: 'init',
      authorization: [{
        actor: 'eosio',
        permission: 'active'
      }],
      data: {
        version: 0,
        core: '4,WAX'
      }
    });
  }
}