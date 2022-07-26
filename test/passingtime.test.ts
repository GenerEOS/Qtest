import { Chain } from "../src/index";
import { expectAction, expectThrow } from "../src/assertion";
import { blockTimeToMs } from "../src/utils";

describe("account test", () => {
  let chain;
  let passingtimeContract;
  let chainName = process.env.CHAIN_NAME || "WAX";

  beforeAll(async () => {
    chain = await Chain.setupChain(chainName);
    const contractAccount = chain.accounts[2];
    await contractAccount.addCode("active");
    passingtimeContract = await contractAccount.setContract({
      abi: "./contracts/build/passingtime.abi",
      wasm: "./contracts/build/passingtime.wasm",
    });
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);

  describe("Passing time", function () {
    it("should create new item and add time to buy item", async () => {
      let rsp = await passingtimeContract.action.newepoch(
        {
          epoch_id: 0,
          period: 24 * 60 * 60, // 1 day
        },
        [{ actor: chain.accounts[2].name, permission: "active" }]
      );

      let epochs = await passingtimeContract.table.epochs.get({
        scope: chain.accounts[2].name,
      });

      expect(epochs.rows.length).toBe(1);
      expect(epochs.rows[0].epoch_id).toBe(0);
      expect(epochs.rows[0].start_at).toBe(rsp.processed.block_time);
      expect(epochs.rows[0].period).toBe(24 * 60 * 60);

      await expectThrow(
        passingtimeContract.action.newepoch(
          {
            epoch_id: 1,
            period: 60 * 60, // 1 hour
          },
          [{ actor: chain.accounts[2].name, permission: "active" }]
        ),
        "only start next epoch once the previous epoch has done"
      );

      await chain.time.increase(2 * 60 * 60); // add 2 hours

      await expectThrow(
        passingtimeContract.action.newepoch(
          {
            epoch_id: 1,
            period: 60 * 60, // 1 hour
          },
          [{ actor: chain.accounts[2].name, permission: "active" }]
        ),
        "only start next epoch once the previous epoch has done"
      );

      await chain.time.increase(22 * 60 * 60); // add more 20 hours

      rsp = await passingtimeContract.action.newepoch(
        {
          epoch_id: 1,
          period: 60 * 60, // 1 hour
        },
        [{ actor: chain.accounts[2].name, permission: "active" }]
      );

      epochs = await passingtimeContract.table.epochs.get({
        scope: chain.accounts[2].name,
      });

      expect(epochs.rows.length).toBe(2);
      expect(epochs.rows[epochs.rows.length - 1].epoch_id).toBe(1);
      expect(epochs.rows[epochs.rows.length - 1].start_at).toBe(
        rsp.processed.block_time
      );
      expect(epochs.rows[epochs.rows.length - 1].period).toBe(60 * 60);
    }, 40000);
  });

  describe("Increase time to specific time point", function () {
    it("should increase time to able to add new epoch", async () => {
      const currentBlockTimeMilliSecond = blockTimeToMs(
        (await chain.getInfo()).head_block_time
      );
      const twoHoursAhead = new Date(
        currentBlockTimeMilliSecond + 2 * 60 * 60 * 1000
      );
      const oneDayAhead = new Date(
        currentBlockTimeMilliSecond + 1 * 24 * 60 * 60 * 1000
      );
      const twoDaysAhead = new Date(
        currentBlockTimeMilliSecond + 2 * 24 * 60 * 60 * 1000
      );
      const oneMonthAhead = new Date(
        currentBlockTimeMilliSecond + 30 * 24 * 60 * 60 * 1000
      );
      let rsp = await passingtimeContract.action.newepochdate(
        {
          epoch_id: 0,
          end_at: oneDayAhead.toISOString().slice(0, -1),
        },
        [{ actor: chain.accounts[2].name, permission: "active" }]
      );

      let epochs = await passingtimeContract.table.epochdates.get({
        scope: chain.accounts[2].name,
      });

      expect(epochs.rows.length).toBe(1);
      expect(epochs.rows[0].epoch_id).toBe(0);
      expect(epochs.rows[0].start_at).toBe(rsp.processed.block_time);
      expect(epochs.rows[0].end_at).toBe(
        oneDayAhead.toISOString().slice(0, -1)
      );

      await expectThrow(
        passingtimeContract.action.newepochdate(
          {
            epoch_id: 1,
            end_at: twoDaysAhead.toISOString().slice(0, -1),
          },
          [{ actor: chain.accounts[2].name, permission: "active" }]
        ),
        "only start next epoch once the previous epoch has done"
      );

      await chain.time.increaseTo(twoHoursAhead.getTime()); // add 2 hours

      await expectThrow(
        passingtimeContract.action.newepochdate(
          {
            epoch_id: 1,
            end_at: twoDaysAhead.toISOString().slice(0, -1),
          },
          [{ actor: chain.accounts[2].name, permission: "active" }]
        ),
        "only start next epoch once the previous epoch has done"
      );

      await chain.time.increaseTo(oneDayAhead.getTime()); // add more 20 hours

      rsp = await passingtimeContract.action.newepochdate(
        {
          epoch_id: 1,
          end_at: twoDaysAhead.toISOString().slice(0, -1),
        },
        [{ actor: chain.accounts[2].name, permission: "active" }]
      );

      epochs = await passingtimeContract.table.epochdates.get({
        scope: chain.accounts[2].name,
      });

      expect(epochs.rows.length).toBe(2);
      expect(epochs.rows[epochs.rows.length - 1].epoch_id).toBe(1);
      expect(epochs.rows[epochs.rows.length - 1].start_at).toBe(
        rsp.processed.block_time
      );
      expect(epochs.rows[epochs.rows.length - 1].end_at).toBe(
        twoDaysAhead.toISOString().slice(0, -1)
      );
    }, 50000);
  });
});
