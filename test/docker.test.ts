import { startChainContainer, getContainers, killExistingContainer, getChainIp } from '../src/dockerClient';

describe('app test', () => {
  it ('start chain container', async () => {
    await killExistingContainer();
    await startChainContainer();

    const containers = getContainers();
    const qTestContainer = containers.find(c => c.name = 'qtest');
    // @ts-ignore
    expect(qTestContainer.name).toBe('qtest');
  });

  it ('get chain ip', async () => {
    const ip = await getChainIp();
    console.log('-------- ip: ', ip);
  });

  it ('kill chain container', async () => {
    await killExistingContainer();
    const containers = getContainers();
    const qTestContainer = containers.find(c => c.name = 'qtest');
    expect(qTestContainer).toBe(undefined);
  });
});