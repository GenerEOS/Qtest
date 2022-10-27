import fetch from "node-fetch";
import { Api, JsonRpc } from "eosjs";
import { Action } from "eosjs/dist/eosjs-serialize";
import { TransactResult } from "eosjs/dist/eosjs-api-interfaces";
import {
  ReadOnlyTransactResult,
  PushTransactionArgs,
  GetInfoResult,
} from "eosjs/dist/eosjs-rpc-interfaces";
import { Account } from "./account";
import {
  killExistingChainContainer,
  startChainContainer,
  getChainIp,
  manipulateChainTime,
  checkContainerHealthStatus,
} from "./dockerClient";
import { sleep } from "./utils";
import { signatureProvider } from "./wallet";
import { Asset, Symbol as TokenSymbol } from "./asset";
import { Time } from "./time";
import { System } from "./system";
import { generateTapos } from "./utils";

export class Chain {
  public coreSymbol: TokenSymbol;
  public tokenSupply: Asset;
  public api;
  public rpc: JsonRpc;
  public accounts: Account[];
  public port: number;
  public systemContractEnable: boolean;
  public time: Time;
  public system: System;

  constructor(rpc: JsonRpc, api: Api, port: number, tokenSymbol: string) {
    this.port = port;
    this.rpc = rpc;
    this.api = api;
    const tokenDecimal = this.getChainTokenDecimal(tokenSymbol);
    this.coreSymbol = new TokenSymbol(tokenDecimal, tokenSymbol);
    this.systemContractEnable = true;
    this.time = new Time(this);
    this.system = new System(this);
  }

  static validateChainName(chainName: string): void {
    const validChainNames = ["WAX", "EOS", "TLOS"];
    if (!validChainNames.includes(chainName)) {
      throw new Error(
        "Chain name is not valid: " +
          chainName +
          ". Should be one of " +
          JSON.stringify(validChainNames)
      );
    }
  }

  /**
   * Setup new testing chain, setup chain docker instance, initialize api client, create 10 test accounts
   *
   * @param {string} chainName type of chain, should be one of either WAX, EOS or TLOS
   * @return {Promise<Chain>} new instance of Chain
   * @api public
   */
  static async setupChain(chainName: string) {
    Chain.validateChainName(chainName);
    const port = Math.floor(Math.random() * 9900 + 100);
    await startChainContainer(port, chainName);

    const rpc = new JsonRpc(`http://127.0.0.1:${port}`, { fetch });
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder(),
    });

    const newChain = new Chain(rpc, api, port, chainName);
    // waiting for chain start produce block
    await newChain.waitForChainStart();
    // initialize 10 test accounts
    await newChain.initializeTestAccounts();

    return newChain;
  }

  /**
   * Clear chain after test, remove chain docker instance, relase docker port
   *
   * @return {Promise<void>} new instance of Chain
   * @api public
   */
  async clear() {
    await killExistingChainContainer(this.port);
  }

  /**
   * get chain info
   *
   * @return {Promise<GetInfoResult>} infomation testing chain
   * @api public
   */
  async getInfo(): Promise<GetInfoResult> {
    return await this.rpc.get_info();
  }

  /**
   * get head block number of chain
   *
   * @return {Promise<number>} head block number
   * @api public
   */
  async headBlockNum(): Promise<number> {
    return +(await this.getInfo()).head_block_num;
  }

  /**
   * check node status
   *
   * @return {Promise<boolean>} true if node is started
   * @api public
   */
  async isNodeStartUp(): Promise<boolean> {
    try {
      await this.getInfo();
      return true;
    } catch (e) {
      await sleep(100);
      return false;
    }
  }

  /**
   * check chain produce block
   *
   * @return {Promise<boolean>} true if chain produce block properly
   * @api public
   */
  async isProducingBlock(): Promise<boolean> {
    try {
      const currentHeadBlock = await this.headBlockNum();
      await sleep(500);
      return Number(await this.headBlockNum()) - Number(currentHeadBlock) > 0;
    } catch (e) {
      return false;
    }
  }

  /**
   * push action to chain
   *
   * @param {Action} action detail of action to push
   * @param {boolean} broadcast Optional. Should broadcast this transaction to blockchain or not
   * @param {boolean} sign Optional. should sign transaction or not
   * @param {Object} tapos Optional. {blocksBehind: reference block number, expireSeconds: number of second transaction will expired}
   * @return {Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs>} transaction result
   *
   * @api public
   */

  async pushAction(
    action: Action,
    broadcast: boolean = true,
    sign: boolean = true,
    tapos: Object = {}
  ): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> {
    tapos =
      JSON.stringify(tapos) === JSON.stringify({}) ? generateTapos() : tapos;
    return this.api.transact(
      { actions: [action] },
      { broadcast, sign, ...tapos }
    );
  }

  /**
   * push multiple action to chain
   *
   * @param {Action[]} actions detail of actions to push
   * @param {boolean} broadcast Optional. Should broadcast this transaction to blockchain or not
   * @param {boolean} sign Optional. should sign transaction or not
   * @param {Object} tapos Optional. {blocksBehind: reference block number, expireSeconds: number of second transaction will expired}
   * @return {Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs>} transaction result
   *
   * @api public
   */
  async pushActions(
    actions: Action[],
    broadcast: boolean = true,
    sign: boolean = true,
    tapos: Object = {}
  ): Promise<TransactResult | ReadOnlyTransactResult | PushTransactionArgs> {
    tapos =
      JSON.stringify(tapos) === JSON.stringify({}) ? generateTapos() : tapos;
    return this.api.transact({ actions }, { broadcast, sign, ...tapos });
  }

  /**
   * wait til `numBlocks` pass
   *
   * @param {number} numBlocks number of block
   * @return {void}
   *
   * @api public
   */
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

  /**
   * wait until chain produce `target` block number
   *
   * @param {number} target target block number
   * @return {void}
   *
   * @api public
   */
  async waitTillBlock(target: number) {
    let currentBlockHeight = await this.headBlockNum();
    while (currentBlockHeight < target) {
      await sleep(500);
      currentBlockHeight = await this.headBlockNum();
    }
    return currentBlockHeight;
  }

  private async initializeTestAccounts() {
    this.accounts = await this.createTestAccounts(10);
  }

  private async createTestAccounts(length: number) {
    const testAccountNames: string[] = [];
    for (let i = 0; i < length; i++) {
      testAccountNames.push(
        `acc${Math.floor(i / 5) + 1}${Math.floor(i % 5) + 1}.test`
      );
    }
    return this.system.createAccounts(testAccountNames);
  }

  private async waitForChainStart() {
    let retryCount = 0;
    while (!(await checkContainerHealthStatus(this.port))) {
      await sleep(100);
      if (retryCount === 100) {
        throw new Error("Docker container is not healthy");
      }
      retryCount++;
    }

    retryCount = 0;
    while (!(await this.isProducingBlock())) {
      if (retryCount === 20) {
        throw new Error("Cannot get chain status");
      }
      retryCount++;
    }
  }

  private getChainTokenDecimal(chainName: string): number {
    switch (chainName) {
      case "WAX":
        return 8;
      case "EOS":
      case "TLOS":
        return 4;
      default:
        throw new Error(
          "can not find token decimal for chain name " + chainName
        );
    }
  }
}
