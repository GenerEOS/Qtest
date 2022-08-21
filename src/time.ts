import { Chain } from "./chain";
import { manipulateChainTime } from "./dockerClient";
import { blockTimeToMs, sleep } from "./utils";

export class Time {
  public static timeAdjustDelaySecond = 5;
  public chain: Chain;
  public timeAdded: number;

  constructor(chain: Chain) {
    this.chain = chain;
    this.timeAdded = 0;
  }

  /**
   * Increase time of chain. This function only adds time to the current block time (never reduces). Realize that it is not super accurate.You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.
   *
   * @param {Number} time Number of seconds to increase the chain time by
   * @param {String=} fromBlockTime Optional blocktime string. The `time` parameter will add to this absolute value as the target to increase. If this is missing, the `time` value just adds to the current blockchain time time to.
   * @return {Promise<Number>} The approximate number of milliseconds that the chain time has been increased by (not super reliable - it is usually more)
   * @api public
   */
  async increase(time: number, fromBlockTime: string = ""): Promise<number> {
    if (time < 0) {
      throw new Error("adding time much be greater than zero");
    }
    const { elapsedBlocks, startingBlock } = await this.chain.waitTillNextBlock(
      2
    ); // This helps resolve any pending transactions
    const startTime = blockTimeToMs(startingBlock.head_block_time);
    let addingTime;
    let fromBlockTimeMs = startTime;
    if (fromBlockTime) {
      fromBlockTimeMs = blockTimeToMs(fromBlockTime);
      addingTime = Math.floor(
        Math.max(
          0,
          time - (startTime - fromBlockTimeMs) / 1000 - elapsedBlocks * 0.5
        )
      );
    } else {
      addingTime = Math.floor(Math.max(0, time - elapsedBlocks * 0.5));
    }

    if (addingTime === 0) {
      return 0;
    }
    let tries = 0;
    const maxTries = 15;
    do {
      if (tries >= maxTries) {
        throw new Error(
          `Exceeded ${maxTries} tries to change the blockchain time. Test cannot proceed.`
        );
      }
      await manipulateChainTime(
        this.chain.port,
        `+${this.timeAdded + addingTime}`
      );
      tries++;
      await sleep(1000);
    } while (!(await this.chain.isProducingBlock()));
    await this.chain.waitTillNextBlock(2);
    this.timeAdded += addingTime;
    const endTime = blockTimeToMs((await this.chain.getInfo()).head_block_time);
    return endTime - fromBlockTimeMs;
  }

  /**
   * Increase time of chain to specific time point. This function only modify chain time to the specific time point greater than current head block time. Realize that it is not super accurate.You will definitely increase time by at least the number of seconds you indicate, but likely a few seconds more. So you should not be trying to do super precision tests with this function. Give your tests a few seconds leeway when checking behaviour that does NOT exceed some time span. It will work well for exceeding timeouts, or making large leaps in time, etc.
   *
   * @param {Number} time Epoch time in millisecond, less than current block time with be rejected
   * @param {String=} fromBlockTime Optional blocktime string. The `time` parameter will add to this absolute value as the target to increase. If this is missing, the `time` value just adds to the current blockchain time time to.
   * @return {Promise<Number>} Current head block time in milisecond after increase time
   * @api public
   */
  async increaseTo(time: number): Promise<number> {
    const currentHeadBlockTime = blockTimeToMs(
      (await this.chain.getInfo()).head_block_time
    );
    if (time < currentHeadBlockTime) {
      throw new Error(`time must be greater than current block time`);
    }
    await this.chain.waitTillNextBlock(2); // This helps resolve any pending transactions
    const headBlockTimeAfterResolvePendingTransaction = blockTimeToMs(
      (await this.chain.getInfo()).head_block_time
    );
    if (time < headBlockTimeAfterResolvePendingTransaction) {
      return headBlockTimeAfterResolvePendingTransaction;
    }

    const addingTime = Math.ceil(
      (time - headBlockTimeAfterResolvePendingTransaction) / 1000
    );
    let tries = 0;
    const maxTries = 15;
    do {
      if (tries >= maxTries) {
        throw new Error(
          `Exceeded ${maxTries} tries to change the blockchain time. Test cannot proceed.`
        );
      }
      await manipulateChainTime(
        this.chain.port,
        `+${this.timeAdded + addingTime}`
      );
      tries++;
      await sleep(1000);
    } while (!(await this.chain.isProducingBlock()));
    await this.chain.waitTillNextBlock(2);
    this.timeAdded += addingTime;
    return blockTimeToMs((await this.chain.getInfo()).head_block_time);
  }
}
