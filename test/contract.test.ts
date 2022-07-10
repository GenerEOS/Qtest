import { Chain } from '../src/chain';
import { expectAction } from '../src/assertion';

describe('account test', () => {
  let chain;
  let contract;

  beforeAll(async () => {
    chain = await Chain.setupChain({ systemSetup: true });
    const contractAccount = chain.accounts[1];
    await contractAccount.addCode('active');
    contract = await contractAccount.setContract('./contracts/build/testcontract.wasm', './contracts/build/testcontract.abi');
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);

  it('push action', async () => {
    let transaction = await contract.action.hello({ user: chain.accounts[2].name }, [{ actor: chain.accounts[2].name, permission: 'active' }]);
    expect(transaction.processed.action_traces[0].console).toBe(' hello ' + chain.accounts[2].name);

    await expect(contract.action.hello({ user: 'daniel' }, [{ actor: chain.accounts[2].name, permission: 'active' }])).rejects.toThrowError('missing authority of daniel');
  }, 100000);

  it('load contract table data', async () => {
    await contract.table.log.load({
      testscope1: [
        {
          id: 'name1',
          value1: 1122,
          value2: 2211,
        },
        {
          id: 'name2',
          value1: 2233,
          value2: 3322,
        },
        {
          id: 'name3',
          value1: 3344,
          value2: 4433,
        }
      ],
      testscope2: [
        {
          id: 'namescope1',
          value1: 999,
          value2: 6712,
        },
      ]
    });
    const logTableRowScope1 = await contract.table.log.get({ scope: 'testscope1' });
    expect(logTableRowScope1.rows.length).toBe(3);
    expect(logTableRowScope1.rows[0].id).toBe('name1');
    expect(logTableRowScope1.rows[1].value1).toBe(2233);
    expect(logTableRowScope1.rows[2].value2).toBe(4433);

    const logTableRowScope2 = await contract.table.log.get({ scope: 'testscope2' });
    expect(logTableRowScope2.rows.length).toBe(1);
    expect(logTableRowScope2.rows[0].id).toBe('namescope1');
    expect(logTableRowScope2.rows[0].value1).toBe(999);
  }, 100000);

  it('modify contract table data', async () => {
    await contract.table.log.load({
      testscope3: [
        {
          id: 'namescope3',
          value1: 999,
          value2: 6712,
        },
      ]
    });
    await contract.table.log.modify({
      testscope3: [
        {
          id: 'namescope3',
          value1: 765,
          value2: 12390,
        },
      ]
    });

    const logTableRowScope3 = await contract.table.log.get({ scope: 'testscope3' });
    expect(logTableRowScope3.rows.length).toBe(1);
    expect(logTableRowScope3.rows[0].id).toBe('namescope3');
    expect(logTableRowScope3.rows[0].value1).toBe(765);
    expect(logTableRowScope3.rows[0].value2).toBe(12390);
  }, 100000);

  it('erase contract table data', async () => {
    await contract.table.log.erase({
      testscope3: [
        {
          id: 'namescope3',
          value1: 999,
          value2: 6712,
        },
      ],
      testscope2: [
        {
          id: 'namescope1',
          value1: 999,
          value2: 6712,
        },
      ]
    });
    const logTableRowScope3 = await contract.table.log.get({ scope: 'testscope3', lower_boud: 'namescope3', upper_bound: 'namescope3' });
    expect(logTableRowScope3.rows.length).toBe(0);

    const logTableRowScope2 = await contract.table.log.get({ scope: 'testscope2', lower_boud: 'namescope1', upper_bound: 'namescope1' });
    expect(logTableRowScope2.rows.length).toBe(0);
  }, 100000);

  it('push action to store log and then read table data', async () => {
    let transaction = await contract.action.savelog(
      {
        user: chain.accounts[2].name,
        id: 'daniel',
        value1: 2291,
        value2: 98123
      },
      [{ actor: chain.accounts[2].name, permission: 'active' }]
    );
    expect(transaction.transaction_id.length).toBe(64);
    expect(transaction.processed.block_num).toBeGreaterThan(0);

    const logTableRows = await contract.table.log.get({ scope: chain.accounts[2].name });
    const savedLogItem = logTableRows.rows[0];
    expect(savedLogItem.id).toBe('daniel');
    expect(savedLogItem.value1).toBe(2291);
    expect(savedLogItem.value2).toBe(98123);
  }, 100000);

  it('should create new item and add time to buy item', async () => {
    const seller = chain.accounts[2];
    const buyer = chain.accounts[3];
    const expectedSellingTime = Math.floor(Date.now() / 1000) + 3600 * 3; // 3 hours from now
    const newitemTransaction = await contract.action.newitem(
      {
        seller: seller.name,
        item_name: 'testitem1111',
        price: '12.34560000 WAX',
        selling_time: expectedSellingTime
      },
      [{ actor: chain.accounts[2].name, permission: 'active' }]
    );

    expectAction(newitemTransaction, {
      account: contract.account.name,
      name: 'lognewitem',
      data: {
        seller: chain.accounts[2].name,
        item_name: 'testitem1111',
        price: '12.34560000 WAX',
        selling_time: expectedSellingTime
      },
      authorization: [{ actor: contract.account.name, permission: 'active' }]
    });

    expect(buyer.transfer(contract.account.name, '12.34560000 WAX', `${seller.name}-testitem1111`))
      .rejects
      .toThrowError('Item has not been available yet');

    await chain.addTime(2*3600); // add 2 hours, item still not available yet

    expect(buyer.transfer(contract.account.name, '12.34560000 WAX', `${seller.name}-testitem1111`))
      .rejects
      .toThrowError('Item has not been available yet');

    await chain.addTime(3600);

    const buyItemTransaction = await buyer.transfer(contract.account.name, '12.34560000 WAX', `${seller.name}-testitem1111`);
    expectAction(buyItemTransaction, {
      account: contract.account.name,
      name: 'logbuyitem',
      data: {
        seller: chain.accounts[2].name,
        item_name: 'testitem1111',
        buyer: buyer.name
      }
    });

    expectAction(buyItemTransaction, {
      account: buyer.name,
      name: 'transfer',
    });
  }, 30000);
});