import { Chain } from '../src/chain';
import { generateTapos } from '../src/utils';
import { importKey, signatureProvider, createKey } from '../src/wallet';

describe('test wallet', () => {
  const chain = new Chain();
  let account;

  beforeAll(async () => {
    await chain.setupChain(true);
    account = await chain.createAccount('testaccount1');
  }, 60000);

  it ('import key', async () => {
    importKey('5JLA28jodzEmhdgGsdC6s8zkWNBTKmNtxB9RywHoKUQ6FpAmRMG');

    const availablePubKeys = await signatureProvider.getAvailableKeys();
    expect(availablePubKeys.length).toBe(2);

    await account.updateAuth('testauth', 'active', 1, 
      [{
        key: 'EOS8cExDTKMmr8Drk6iMiB35D4SrEmRupvxXYwdjqqrhN58JjiXBf',
        weight: 1
      }],
      []
    );
    await account.linkAuth('eosio.token', 'transfer', 'testauth');

    const transferTransaction = await chain.api.transact({ // should able to push transaction with new added key
      actions: [
        {
          account: 'eosio.token',
          name: 'transfer',
          authorization: [
            {
              actor: account.name,
              permission: 'testauth',
            },
          ],
          data: {
            from: account.name,
            to: 'acc11.test',
            quantity: '0.1000 WAX',
            memo: 'test'
          },
        }
      ],
    },
      generateTapos()
    );
    expect(transferTransaction.processed.action_traces[0].act.account).toBe('eosio.token');
    expect(transferTransaction.processed.action_traces[0].act.name).toBe('transfer');
  });

  it ('create new key', async () => {
    const newKey = createKey();

    const newPublicKey = newKey.publicKey.toString();
    expect(newPublicKey.startsWith('PUB_K1_')).toBeTruthy();

    const availablePubKeys = await signatureProvider.getAvailableKeys();
    expect(availablePubKeys.includes(newPublicKey)).toBe(true);
  });
});