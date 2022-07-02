import { TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';
import { Chain } from '../src/chain';

describe('chain test', () => { 
  const chain = new Chain();

  it ('test setup chain', async () => {
    await chain.setupChain(false);

    const chainInfo = await chain.rpc.get_info();
    expect(chainInfo.head_block_num).toBeGreaterThan(0);
    expect(chainInfo.last_irreversible_block_num).toBeGreaterThan(0);

    const testAccount1 = await chain.rpc.get_account('acc11.test');
    const testAccount10 = await chain.rpc.get_account('acc25.test');
    expect(testAccount1.total_resources.net_weight).toBe('10.00000000 WAX');
    expect(testAccount10.total_resources.net_weight).toBe('10.00000000 WAX');
  }, 100000);

  it ('create account', async () => {
    const newAccountName = 'newaccount11';
    await chain.createAccount(newAccountName, '11.11000000 WAX', 99998);
    const newAccountInfo = await chain.rpc.get_account(newAccountName);

    expect(newAccountInfo.total_resources.net_weight).toBe('10.00000000 WAX');
    expect(newAccountInfo.total_resources.cpu_weight).toBe('10.00000000 WAX');

    const newAccountBalance = await chain.rpc.get_currency_balance('eosio.token', newAccountName, 'WAX');
    expect(newAccountBalance[0]).toBe('11.11000000 WAX');
  });

  it ('push action', async () => {
    const testingAccountName = 'newaccount11';
    // @ts-ignore
    const transaction: TransactResult = await chain.pushAction({
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: testingAccountName,
        permission: 'active'
      }],
      data: {
        from: testingAccountName,
        to: chain.accounts[0].name,
        quantity: '1.00000000 WAX',
        memo: 'test'
      }
    });
    expect(transaction.transaction_id.length).toBe(64);
    expect(transaction.processed.block_num).toBeGreaterThan(0);
  });

  it ('push multiple action', async () => {
    const testingAccountName = 'newaccount11';
    // @ts-ignore
    const transaction: TransactResult = await chain.pushActions([
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: testingAccountName,
          permission: 'active'
        }],
        data: {
          from: testingAccountName,
          to: chain.accounts[0].name,
          quantity: '1.00000000 WAX',
          memo: 'test'
        }
      },
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: testingAccountName,
          permission: 'active'
        }],
        data: {
          from: testingAccountName,
          to: chain.accounts[1].name,
          quantity: '1.00000000 WAX',
          memo: 'test'
        }
      }
    ]);
    expect(transaction.transaction_id.length).toBe(64);
    expect(transaction.processed.block_num).toBeGreaterThan(0);
  });

  it ('should sign transaction only without broadcast', async () => {
    const testingAccountName = 'newaccount11';
    // @ts-ignore
    const transaction: PushTransactionArgs = await chain.pushActions([
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: testingAccountName,
          permission: 'active'
        }],
        data: {
          from: testingAccountName,
          to: chain.accounts[0].name,
          quantity: '1.00000000 WAX',
          memo: 'test'
        }
      },
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
          actor: testingAccountName,
          permission: 'active'
        }],
        data: {
          from: testingAccountName,
          to: chain.accounts[1].name,
          quantity: '1.00000000 WAX',
          memo: 'test'
        }
      }
    ], false, true);
    expect(transaction.signatures.length).toBe(1);
    expect(transaction.signatures[0].startsWith('SIG_K1_')).toBe(true);
    expect(transaction.serializedTransaction.length).toBeGreaterThan(0);
  });
});