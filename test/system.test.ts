import { Account } from "../src/account";
import { expectBalance } from "../src/assertion";
import { Chain } from "../src/chain";
import { Contract } from "../src/contract";
import { generateTapos } from "../src/utils";
import { TESTING_PUBLIC_KEY } from "../src/wallet";

describe("account test", () => {
  let chain: Chain;
  let account: Account;
  let chainName = process.env.CHAIN_NAME || "WAX";

  beforeAll(async () => {
    chain = await Chain.setupChain(chainName);
    account = await chain.system.createAccount("testaccount1");
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);

  describe("test createAccount", function () {
    it("should created 10 test accounts", async () => {
      const test12 = await chain.system.createAccount("test12");
      expect(test12).toHaveProperty("name");
    });
  });

  describe("test createAccounts", function () {
    it("should created 10 test accounts", async () => {
      for (let i = 0; i < 10; i++) {
        let testAccount = chain.accounts[i];
        expect(testAccount).toHaveProperty("name");
      }

      for (let i = 10; i < 20; i++) {
        let testAccount = chain.accounts[i];
        expect(testAccount).toBeUndefined;
      }
    });
  });

  describe("test loadAccount", function () {
    it("test load an existing contract", async () => {
      const eosio = await chain.system.fromAccount("eosio");
      expect(eosio).toHaveProperty("name");
      expect(eosio).toHaveProperty("contract");
    }, 100000);

    it("should not load non existing account", async () => {
      await expect(chain.system.fromAccount("eosio123")).rejects.toThrowError(
        "unknown key"
      );
    }, 100000);
  });
});
