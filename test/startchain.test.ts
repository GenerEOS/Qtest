import { expectBalance } from "../src/assertion";
import { Chain } from "../src/chain";
import { generateTapos } from "../src/utils";
import { TESTING_PUBLIC_KEY } from "../src/wallet";

describe("setup chain  test", () => {
  let chain;
  let account;
  let chainName = process.env.CHAIN_NAME || "WAX";

  afterAll(async () => {
    await chain.clear();
  }, 10000);

  describe("setup chain", function () {
    it("setup chain test", async () => {
      chain = await Chain.setupChain(chainName);
      account = await chain.system.createAccount("testaccount1");
    }, 60000);
  });
});
