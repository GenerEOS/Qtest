import { Chain } from "./chain";
import { Account } from "./account";
import { signatureProvider } from "./wallet";
import { generateTapos } from "./utils";

export class System {
  public chain: Chain;

  constructor(chain: Chain) {
    this.chain = chain;
  }

  /**
   * create blockchain acounts
   *
   * @param {string[]} accounts array of account names
   * @param {Asset} supplyAmount Optional. Amount of token supply to each account, 100 token if it missing
   * @return {Promise<Account[]>} list of account instances
   *
   * @api public
   */
  async createAccounts(
    accounts: string[],
    supplyAmount = this.chain.coreSymbol.convertAssetString(100)
  ): Promise<Account[]> {

    const requests = accounts.map(account => this.createAccount(account, supplyAmount));
    return Promise.all(requests);
  }

  /**
   * create blockchain acount
   *
   * @param {string} account account name
   * @param {Asset} supplyAmount Optional. Amount of token supply to each account, 100 token if it missing
   * @return {Promise<Account>} account instances
   *
   * @api public
   */
  async createAccount(
    account: string,
    supplyAmount = this.chain.coreSymbol.convertAssetString(100),
    bytes: number = 1024 * 1024
  ): Promise<Account> {
    let createAccountActions = [
      {
        account: "eosio",
        name: "newaccount",
        authorization: [
          {
            actor: "eosio",
            permission: "active",
          },
        ],
        data: {
          creator: "eosio",
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
    ];

    if (this.chain.systemContractEnable) {
      // @ts-ignore
      createAccountActions = createAccountActions.concat([
        {
          account: "eosio",
          name: "buyrambytes",
          authorization: [
            {
              actor: "eosio",
              permission: "active",
            },
          ],
          data: {
            payer: "eosio",
            receiver: account,
            bytes,
          },
        },
        {
          account: "eosio",
          name: "delegatebw",
          authorization: [
            {
              actor: "eosio",
              permission: "active",
            },
          ],
          data: {
            from: "eosio",
            receiver: account,
            stake_net_quantity: this.chain.coreSymbol.convertAssetString(10),
            stake_cpu_quantity: this.chain.coreSymbol.convertAssetString(10),
            transfer: 1,
          },
        },
      ]);
    }

    createAccountActions.push({
      account: "eosio.token",
      name: "transfer",
      authorization: [
        {
          actor: "eosio",
          permission: "active",
        },
      ],
      data: {
        // @ts-ignore
        from: "eosio",
        to: account,
        quantity: supplyAmount,
        memo: "supply to test account",
      },
    });
    await this.chain.api.transact(
      {
        actions: createAccountActions,
      },
      generateTapos()
    );
    return new Account(this.chain, account);
  }
}
