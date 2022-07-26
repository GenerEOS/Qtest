import { Chain } from "../src/chain";
import { expectAction, expectThrow, expectBalance } from "../src/assertion";

describe("account test", () => {
  let chain;
  let contract;
  let chainName = process.env.CHAIN_NAME || "WAX";
  let contractAccount, user1, user2, user3;

  beforeAll(async () => {
    chain = await Chain.setupChain(chainName);
    [contractAccount, user1, user2, user3] = chain.accounts;

    await contractAccount.addCode("active");
    contract = await contractAccount.setContract({
      abi: "./contracts/build/testcontract.abi",
      wasm: "./contracts/build/testcontract.wasm",
    });
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);
  describe("action test", function () {
    it("push action", async () => {
      let transaction = await contract.action.testaction(
        { user: contractAccount.name },
        [{ actor: contractAccount.name, permission: "active" }]
      );
      expect(transaction.processed.action_traces[0].console).toBe(
        " hello " + contractAccount.name
      );

      await expectThrow(
        contract.action.testaction({ user: "daniel" }, [
          { actor: contractAccount.name, permission: "active" },
        ]),
        "missing authority of daniel"
      );
    }, 100000);
  });

  describe("table test", function () {
    it("table test", async () => {
      let transaction = await contract.action.testtable(
        {
          user: user1.name,
          value1: 2291,
          value2: "98123",
        },
        [{ actor: user1.name, permission: "active" }]
      );

      const logTableRows = await contract.table.logs.get({
        scope: user1.name,
      });
      const savedLogItem = logTableRows.rows[logTableRows.rows.length - 1];
      expect(savedLogItem.value1).toBe(2291);
      expect(savedLogItem.value2).toBe("98123");
    }, 100000);
  });

  describe("inline action test", function () {
    it("inline action check the transaction matches with action", async () => {
      let transaction = await contract.action.testtable(
        {
          user: user1.name,
          value1: 123,
          value2: "456789",
        },
        [{ actor: user1.name, permission: "active" }]
      );

      const logTableRows = await contract.table.logs.get({
        scope: user1.name,
      });
      const savedLogItem = logTableRows.rows[logTableRows.rows.length - 1];
      expectAction(transaction, {
        account: contract.account.name,
        name: "testlog",
        data: {
          user: user1.name,
          id: savedLogItem.id,
          value1: 123,
          value2: "456789",
        },
        authorization: [{ actor: contract.account.name, permission: "active" }],
      });
    }, 100000);

    it("inline action check the transaction contains with action", async () => {
      let transaction = await contract.action.testtable(
        {
          user: user1.name,
          value1: 234,
          value2: "456789",
        },
        [{ actor: user1.name, permission: "active" }]
      );

      const logTableRows = await contract.table.logs.get({
        scope: user1.name,
      });
      const savedLogItem = logTableRows.rows[logTableRows.rows.length - 1];
      expectAction(transaction, {
        data: {
          user: user1.name,
          id: savedLogItem.id,
          value1: 234,
          value2: "456789",
        },
      });
    }, 100000);
  });
});
