import { Chain } from '../src/chain';

describe('account test', () => { 
  const chain = new Chain();
  let contract;

  beforeAll(async () => {
    await chain.setupChain(false);
    const contractAccount = chain.accounts[1];
    await contractAccount.addCode('active');
    contract = await contractAccount.setContract('./testContract/build/testcontract.wasm', './testContract/build/testcontract.abi');
  }, 60000);

  it ('push action', async () => {
    let transaction = await contract.action.hello({ user: chain.accounts[2].name }, [ { actor: chain.accounts[2].name, permission: 'active'} ]);
    expect(transaction.processed.action_traces[0].console).toBe(' hello ' + chain.accounts[2].name);

    await expect(contract.action.hello({ user: 'daniel'}, [ { actor: chain.accounts[2].name, permission: 'active'} ])).rejects.toThrowError('missing authority of daniel');
  }, 100000);

  it ('load contract table data', async () => {
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

  it ('modify contract table data', async () => {
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

  it ('erase contract table data', async () => {
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

  it ('push action to store log and then read table data', async () => {
    let transaction = await contract.action.savelog(
      { 
        user: chain.accounts[2].name,
        id: 'daniel',
        value1: 2291,
        value2: 98123
      },
      [ { actor: chain.accounts[2].name, permission: 'active'} ]
    );
    expect(transaction.transaction_id.length).toBe(64);
    expect(transaction.processed.block_num).toBeGreaterThan(0);
    console.log('------ save log transaction: ', JSON.stringify(transaction, null, 2));

    const logTableRows = await contract.table.log.get({ scope: chain.accounts[2].name });
    const savedLogItem = logTableRows.rows[0];
    expect(savedLogItem.id).toBe('daniel');
    expect(savedLogItem.value1).toBe(2291);
    expect(savedLogItem.value2).toBe(98123);
  }, 100000);
});