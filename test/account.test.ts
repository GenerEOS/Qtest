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

  describe("account functions", function () {
    it("test update auth", async () => {
      await account.updateAuth(
        "testauth",
        "active",
        2,
        [
          {
            key: "EOS7Gk5QTRcKsK5grAuZkLyPTSw5AcQpCz2VDWGi5DPBvfZAG7H9b",
            weight: 1,
          },
          {
            key: "EOS8cFt6PzBL79kp9vPwWoX8V6cjwgShbfUsyisiZ1M8QaFgZtep6",
            weight: 1,
          },
        ],
        [
          {
            permission: {
              actor: "acc11.test",
              permission: "eosio.code",
            },
            weight: 2,
          },
        ]
      );
      const accountInfo = await chain.rpc.get_account(account.name);
      expect(accountInfo.permissions[2].perm_name).toBe("testauth");
      expect(accountInfo.permissions[2].required_auth.threshold).toBe(2);
      expect(accountInfo.permissions[2].required_auth.keys[0].key).toBe(
        "EOS7Gk5QTRcKsK5grAuZkLyPTSw5AcQpCz2VDWGi5DPBvfZAG7H9b"
      );
      expect(accountInfo.permissions[2].required_auth.keys[0].weight).toBe(1);
      expect(accountInfo.permissions[2].required_auth.keys[1].key).toBe(
        "EOS8cFt6PzBL79kp9vPwWoX8V6cjwgShbfUsyisiZ1M8QaFgZtep6"
      );
      expect(accountInfo.permissions[2].required_auth.keys[1].weight).toBe(1);
      expect(
        accountInfo.permissions[2].required_auth.accounts[0].permission.actor
      ).toBe("acc11.test");
      expect(
        accountInfo.permissions[2].required_auth.accounts[0].permission
          .permission
      ).toBe("eosio.code");
      expect(accountInfo.permissions[2].required_auth.accounts[0].weight).toBe(
        2
      );
    }, 100000);

    it("test add auth", async () => {
      await account.addAuth("addauth11111", "testauth");
      const accountInfo = await chain.rpc.get_account(account.name);
      const activePermission = accountInfo.permissions.find(
        (p) => p.perm_name === "addauth11111"
      );
      expect(activePermission.perm_name).toBe("addauth11111");
      expect(activePermission.required_auth.threshold).toBe(1);
      expect(activePermission.required_auth.keys[0].key).toBe(
        TESTING_PUBLIC_KEY
      );
      expect(activePermission.required_auth.keys[0].weight).toBe(1);
      expect(activePermission.required_auth.accounts).toEqual([]);
    }, 100000);

    it("test add code", async () => {
      await account.addCode("newcodeauth"); // add code for not exist permission
      let accountInfo = await chain.rpc.get_account(account.name);
      const newlyAddedPermission = accountInfo.permissions.find(
        (p) => p.perm_name === "newcodeauth"
      );

      expect(newlyAddedPermission.perm_name).toBe("newcodeauth");
      expect(newlyAddedPermission.required_auth.threshold).toBe(1);
      expect(
        newlyAddedPermission.required_auth.accounts[0].permission.actor
      ).toBe(account.name);
      expect(
        newlyAddedPermission.required_auth.accounts[0].permission.permission
      ).toBe("eosio.code");
      expect(newlyAddedPermission.required_auth.accounts[0].weight).toEqual(1);

      await chain.accounts[0].addCode("active"); // add code for active permssion
      accountInfo = await chain.rpc.get_account(chain.accounts[0].name);
      const activePermission = accountInfo.permissions.find(
        (p) => p.perm_name === "active"
      );
      expect(activePermission.perm_name).toBe("active");
      expect(activePermission.required_auth.threshold).toBe(1);
      expect(activePermission.required_auth.keys[0].key).toBe(
        TESTING_PUBLIC_KEY
      );
      expect(activePermission.required_auth.keys[0].weight).toBe(1);
      expect(activePermission.required_auth.accounts[0].permission.actor).toBe(
        chain.accounts[0].name
      );
      expect(
        activePermission.required_auth.accounts[0].permission.permission
      ).toBe("eosio.code");
      expect(activePermission.required_auth.accounts[0].weight).toEqual(1);

      await expect(chain.accounts[0].addCode("active")).rejects.toThrowError(
        "Already set code for this account"
      ); // add code for active permssion again
    }, 100000);

    it("test link auth", async () => {
      const transaction = await account.linkAuth(
        "eosio.token",
        "transfer",
        "addauth11111"
      );

      expect(transaction.processed.action_traces[0].act.account).toBe("eosio");
      expect(transaction.processed.action_traces[0].act.name).toBe("linkauth");

      const transferTransaction = await chain.api.transact(
        {
          // should able to transfer with addauth11111 permission
          actions: [
            {
              account: "eosio.token",
              name: "transfer",
              authorization: [
                {
                  actor: account.name,
                  permission: "addauth11111",
                },
              ],
              data: {
                from: account.name,
                to: "acc11.test",
                quantity: chain.coreSymbol.convertAssetString(0.1),
                memo: "test",
              },
            },
          ],
        },
        generateTapos()
      );

      expect(transferTransaction.processed.action_traces[0].act.account).toBe(
        "eosio.token"
      );
      expect(transferTransaction.processed.action_traces[0].act.name).toBe(
        "transfer"
      );
    }, 100000);

    it("test transfer core token", async () => {
      const senderBalanceBefore = await account.getBalance();
      const transaction = await account.transfer(
        "acc11.test",
        chain.coreSymbol.convertAssetString(1),
        "abc test"
      );
      expect(transaction.processed.block_num).toBeGreaterThan(0);
      await expectBalance(account, senderBalanceBefore.sub(1));
    }, 100000);

    it("set contract", async () => {
      const contractAccount = chain.accounts[1];
      const contract = await contractAccount.setContract({
        abi: "./contracts/build/testcontract.abi",
        wasm: "./contracts/build/testcontract.wasm",
      });
      let transaction = await chain.pushAction(
        {
          account: contractAccount.name,
          name: "testaction",
          authorization: [
            {
              actor: contractAccount.name,
              permission: "active",
            },
          ],
          data: {
            user: contractAccount.name,
          },
        },
        true,
        true,
        {
          blocksBehind: 1,
          expireSeconds: 366,
        }
      );
      // @ts-ignore
      expect(transaction.processed.action_traces[0].console).toBe(
        " hello " + contractAccount.name
      );

      transaction = await contract.action.testaction({
        user: contractAccount.name,
      }); // push action with contract instance
      expect(transaction.processed.action_traces[0].console).toBe(
        " hello " + contractAccount.name
      );
    }, 100000);
  });

  describe("load contract", function () {
    it("test load the existing contract", async () => {
      const eosioAccount = new Account(chain, "eosio");
      expect(await eosioAccount.loadContract()).toBeCalled;
      expect(eosioAccount.contract).toBeInstanceOf(Contract);
      expect(
        await eosioAccount.contract.table.global.get({
          scope: eosioAccount.name,
        })
      ).toBeCalled;
    }, 100000);

    it("should not load contract for non existing account", async () => {
      const test123Account = new Account(chain, "test123");
      await expect(test123Account.loadContract()).rejects.toThrowError(
        "unknown key (eosio::chain::name): test123"
      );
    }, 100000);

    it("should not load contract for an account which does not have contract", async () => {
      const test1234Account = await chain.system.createAccount("test1234");
      await expect(test1234Account.loadContract()).rejects.toThrowError(
        "Account test1234 contract_code does not exist"
      );
    }, 100000);
  });
});
