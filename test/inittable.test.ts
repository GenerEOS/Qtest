import { Chain } from '../src/index';
import { expectAction, expectThrow } from '../src/assertion';

describe('account test', () => {
  let chain;
  let inittableContract;

  beforeAll(async () => {
    chain = await Chain.setupChain();
    const contractAccount = chain.accounts[1];
    await contractAccount.addCode('active');
    inittableContract = await contractAccount.setContract('inittable');
  }, 60000);

  afterAll(async () => {
    await chain.clear();
  }, 10000);
  
  describe('Load table', function () {
    it('load contract table data', async () => {
      await inittableContract.table.tablename1.load({
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
          },
        ],
        testscope2: [
          {
            id: 'namescope1',
            value1: 999,
            value2: 6712,
          },
        ],
      });

      const tablename1RowScope1 = await inittableContract.table.tablename1.get({
        scope: 'testscope1',
      });
      expect(tablename1RowScope1.rows.length).toBe(3);
      expect(tablename1RowScope1.rows[0].id).toBe('name1');
      expect(tablename1RowScope1.rows[1].value1).toBe(2233);
      expect(tablename1RowScope1.rows[2].value2).toBe(4433);

      const logTableRowScope2 = await inittableContract.table.tablename1.get({
        scope: 'testscope2',
      });
      expect(logTableRowScope2.rows.length).toBe(1);
      expect(logTableRowScope2.rows[0].id).toBe('namescope1');
      expect(logTableRowScope2.rows[0].value1).toBe(999);
    });

    it('should throw if contract does not have eosload action', async () => {
      await expectThrow(
        inittableContract.table.tablename3.load({
          testscope1: [
            {
              id: 'namescope1',
              value1: 999,
              value2: 6712,
            },
          ]
        }),
        'assertion failure with message: Unknown table to load fixture');
    });
  });
  describe('Modify table', function () {
    it('modify contract table data', async () => {
      await inittableContract.table.tablename2.load({
        testscope3: [
          {
            id: 'namescope3',
            value1: 999,
            value2: 6712,
          },
        ],
      });
      await inittableContract.table.tablename2.modify({
        testscope3: [
          {
            id: 'namescope3',
            value1: 765,
            value2: 12390,
          },
        ],
      });

      const logTableRowScope3 = await inittableContract.table.tablename2.get({
        scope: 'testscope3',
      });
      expect(logTableRowScope3.rows.length).toBe(1);
      expect(logTableRowScope3.rows[0].id).toBe('namescope3');
      expect(logTableRowScope3.rows[0].value1).toBe(765);
      expect(logTableRowScope3.rows[0].value2).toBe(12390);
    });

    it('should throw if contract does not have eosmodify action', async () => {
      await expectThrow(
        inittableContract.table.tablename3.modify({
          testscope3: [
            {
              id: 'namescope3',
              value1: 765,
              value2: 12390,
            },
          ],
        }),
        'assertion failure with message: Unknown table to load fixture');
    });
  });
  describe('Erase table', function () {
    it('erase contract table data', async () => {
      await inittableContract.table.tablename1.load({
        testscope1: [
          {
            id: 'id1',
            value1: 999,
            value2: 6712,
          },
        ],
        testscope2: [
          {
            id: 'id2',
            value1: 999,
            value2: 6712,
          },
        ],
      });
      await inittableContract.table.tablename1.erase({
        testscope1: [
          {
            id: 'id1',
            value1: 999,
            value2: 6712,
          },
        ],
        testscope2: [
          {
            id: 'id2',
            value1: 999,
            value2: 6712,
          },
        ],
      });
      const logTableRowScope3 = await inittableContract.table.tablename1.get({
        scope: 'testscope1',
        lower_boud: 'id1',
        upper_bound: 'id1',
      });
      expect(logTableRowScope3.rows.length).toBe(0);

      const logTableRowScope2 = await inittableContract.table.tablename1.get({
        scope: 'testscope2',
        lower_boud: 'id2',
        upper_bound: 'id2',
      });
      expect(logTableRowScope2.rows.length).toBe(0);
    });

    it('should throw if contract does not have eoserase action', async () => {
      await expectThrow(
        inittableContract.table.tablename3.erase({
          testscope1: [
            {
              id: 'id1',
              value1: 999,
              value2: 6712,
            },
          ]
        }),
        'assertion failure with message: Unknown table to load fixture');
    });
  });
});
