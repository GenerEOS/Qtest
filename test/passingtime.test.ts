import { Chain } from '../src/index';
import { expectAction, expectThrow } from '../src/assertion';

describe('account test', () => {
    let chain;
    let passingtimeContract;

    beforeAll(async () => {
        chain = await Chain.setupChain();
        const contractAccount = chain.accounts[2];
        await contractAccount.addCode('active');
        passingtimeContract = await contractAccount.setContract('passingtime');
    }, 60000);

    afterAll(async () => {
        await chain.clear();
    }, 10000);

    describe('Passing time', function () {

        it('should create new item and add time to buy item', async () => {
            let rsp = await passingtimeContract.action.newepoch({
                epoch_id: 0,
                period: 24 * 60 * 60 // 1 day
            },
                [{ actor: chain.accounts[2].name, permission: 'active' }]
            );

            let epochs = await passingtimeContract.table.epochs.get({
                scope: chain.accounts[2].name,
            });

            expect(epochs.rows.length).toBe(1);
            expect(epochs.rows[0].epoch_id).toBe(0);
            expect(epochs.rows[0].start_at).toBe(rsp.processed.block_time);
            expect(epochs.rows[0].period).toBe(24 * 60 * 60);
            console.log("epoch0.rows[0].start_at", epochs.rows[0].start_at)

            await expectThrow(
                passingtimeContract.action.newepoch({
                    epoch_id: 1,
                    period: 60 * 60 // 1 hour
                }, [{ actor: chain.accounts[2].name, permission: 'active' }]),
                'only start next epoch once the previous epoch has done');

            await chain.addTime(2 * 60 * 60); // add 2 hours

            await expectThrow(
                passingtimeContract.action.newepoch({
                    epoch_id: 1,
                    period: 60 * 60 // 1 hour
                }, [{ actor: chain.accounts[2].name, permission: 'active' }]),
                'only start next epoch once the previous epoch has done');

            await chain.addTime(22 * 60 * 60); // add more 20 hours

            rsp = await passingtimeContract.action.newepoch({
                epoch_id: 1,
                period: 60 * 60 // 1 hour
            }, [{ actor: chain.accounts[2].name, permission: 'active' }]);

            epochs = await passingtimeContract.table.epochs.get({
                scope: chain.accounts[2].name,
            });

            expect(epochs.rows.length).toBe(2);
            expect(epochs.rows[epochs.rows.length - 1].epoch_id).toBe(1);
            expect(epochs.rows[epochs.rows.length - 1].start_at).toBe(rsp.processed.block_time);
            expect(epochs.rows[epochs.rows.length - 1].period).toBe(60 * 60);

        }, 40000);
    });
});
