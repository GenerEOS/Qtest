const { Chain } = require("qtest-js");
const { expectAction, expectThrow, expectBalance } = require("qtest-js");

describe('eosio.token test', () => {
  let chain;
  let contract;
  let chainName = process.env.CHAIN_NAME || 'WAX';
  let contractAccount, issuer, user1, user2, user3;

  beforeAll(async () => {
    chain = await Chain.setupChain(chainName);
    [contractAccount, issuer, user1, user2, user3] = chain.accounts;
    await contractAccount.addCode('active');
    contract = await contractAccount.setContract({
      abi: './build/eosio.token.abi',
      wasm: './build/eosio.token.wasm'
    });
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);

  describe("init account table", function () {
    it('insert account table', async () => {
      await contract.table.accounts.insert({
        'scope1': [
          {
            balance: "12345.67890 AAA",
          },
          {
            balance: "12345.67890 BBB",
          }
        ]
      });

      const balances = await contract.table.accounts.get({
        scope: 'scope1',
      });
      expect(balances.rows[0].balance).toContain('12345.67890 AAA');
      expect(balances.rows[1].balance).toContain('12345.67890 BBB');
    });

    it('modify account table', async () => {
      await contract.table.accounts.insert({
        'scope2': [
          {
            balance: "12345.67890 AAA",
          },
          {
            balance: "12345.67890 BBB",
          }
        ]
      });

      await contract.table.accounts.modify({
        'scope2': [
          {
            balance: "123.67890 AAA",
          },
          {
            balance: "1234.67890 BBB",
          }
        ]
      });
      const balances = await contract.table.accounts.get({
        scope: 'scope2',
      });
      expect(balances.rows[0].balance).toContain('123.67890 AAA');
      expect(balances.rows[1].balance).toContain('1234.67890 BBB');
    });

    it('remove account table', async () => {
      await contract.table.accounts.insert({
        'scope3': [
          {
            balance: "12345.67890 AAA",
          },
          {
            balance: "12345.67890 BBB",
          }
        ]
      });

      let balances = await contract.table.accounts.get({
        scope: 'scope3',
      });
      await contract.table.accounts.erase({
        'scope3': [
          {
            balance: "12345.67890 BBB",
          }
        ]
      });
      balances = await contract.table.accounts.get({
        scope: 'scope3',
      });
      expect(balances.rows.length).toBe(1);
      expect(balances.rows[0].balance).toContain('12345.67890 AAA');
    });
  });

  describe("create token", function () {
    it('create token test', async () => {
      await contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1000.000 TKN"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      );
      const stats = await contract.table.stat.get({
        scope: "TKN",
      });
      const stat = stats.rows[stats.rows.length - 1];
      expect(stat.supply).toBe("0.000 TKN");
      expect(stat.max_supply).toBe("1000.000 TKN");
      expect(stat.issuer).toBe(issuer.name);
    });

    it('create nagative max supply', async () => {
      await expectThrow(contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "-1000.000 TKN"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      ), "max-supply must be positive"
      );
    });

    it('symbol already exists', async () => {

      await contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1000.000 ABC"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      );

      await expectThrow(contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1234.000 ABC"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      ), "token with symbol already exists"
      );

    });

    it('create maximum supply', async () => {

      await contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "4611686018427387903 CDE"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      );

      const stats = await contract.table.stat.get({
        scope: "CDE",
      });
      const stat = stats.rows[stats.rows.length - 1];
      expect(stat.supply).toBe("0 CDE");
      expect(stat.max_supply).toBe("4611686018427387903 CDE");
      expect(stat.issuer).toBe(issuer.name);

      await expectThrow(contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "4611686018427387904 DEF"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      ), "invalid supply"
      );
    });

    it('create maximum decimal', async () => {

      await contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1.000000000000000000 FKM"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      );

      const stats = await contract.table.stat.get({
        scope: "FKM",
      });
      const stat = stats.rows[stats.rows.length - 1];
      expect(stat.supply).toBe("0.000000000000000000 FKM");
      expect(stat.max_supply).toBe("1.000000000000000000 FKM");
      expect(stat.issuer).toBe(issuer.name);

      await expectThrow(contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1.0000000000000000000 KML"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      ), "number is out of range"
      );
    });
  });

  describe("issue token", function () {
    it('create token test', async () => {
      await contract.action.create(
        {
          issuer: issuer.name,
          maximum_supply: "1234.5678 MLN"
        },
        [{ actor: contractAccount.name, permission: 'active' }]
      );
      await contract.action.issue(
        {
          to: issuer.name,
          quantity: "1000.5678 MLN",
          memo: "issue"
        },
        [{ actor: issuer.name, permission: 'active' }]
      );

      const stats = await contract.table.stat.get({
        scope: "MLN",
      });
      const stat = stats.rows[stats.rows.length - 1];
      expect(stat.supply).toBe("1000.5678 MLN");
      expect(stat.max_supply).toBe("1234.5678 MLN");
      expect(stat.issuer).toBe(issuer.name);

      const balances = await contract.table.accounts.get({
        scope: issuer.name,
      });
      expect(balances.rows[balances.rows.length - 1].balance).toBe("1000.5678 MLN");

      await expectThrow(contract.action.issue(
        {
          to: issuer.name,
          quantity: "1000.1234 MLN",
          memo: "issue"
        },
        [{ actor: issuer.name, permission: 'active' }]
      ), "quantity exceeds available supply"
      );

      await expectThrow(contract.action.issue(
        {
          to: issuer.name,
          quantity: "-1.5678 MLN",
          memo: "issue"
        },
        [{ actor: issuer.name, permission: 'active' }]
      ), "must issue positive quantity"
      );

      await expectThrow(contract.action.issue(
        {
          to: user1.name,
          quantity: "1.5678 MLN",
          memo: "issue"
        },
        [{ actor: issuer.name, permission: 'active' }]
      ), "tokens can only be issued to issuer account"
      );

      await contract.action.issue(
        {
          to: issuer.name,
          quantity: "1.5678 MLN",
          memo: "issue"
        },
        [{ actor: issuer.name, permission: 'active' }]
      );
    });
  });

});
