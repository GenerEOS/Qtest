import { Chain, Contract, Account } from "../src";
import { expectAction, expectThrow, expectBalance } from "../src/assertion";

describe("account test", () => {
  let chain: Chain;
  let contract: Contract;
  let chainName = process.env.CHAIN_NAME || "WAX";
  let contractAccount, user1, user2, user3: Account;

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

      const lastRow = await contract.table.logs.getLastRow({
        scope: user1.name,
      });
      expect(lastRow.value1).toBe(2291);
      expect(lastRow.value2).toBe("98123");
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

      const lastRow = await contract.table.logs.getLastRow({
        scope: user1.name,
      });
      expectAction(
        transaction,
        contract.account.name,
        "testlog",
        {
          user: user1.name,
          id: lastRow.id,
          value1: 123,
          value2: "456789",
        },
        [{ actor: contract.account.name, permission: "active" }]
      );
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

      await expectAction(transaction, contract.account.name, "testlog");
      await expect(
        expectAction(transaction, contract.account.name, "testlog", {
          data: "fake",
        })
      ).rejects.toThrowError("Expected: ");
    }, 100000);
  });
});
