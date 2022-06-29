import { execSync } from 'child_process';
import { sleep } from './utils';

function execute(command, ignoreFail = false) {
  try {
    return execSync(command, {
      encoding: 'utf8',
    });
  } catch (e) {
    if (!ignoreFail) {
      throw e;
    }
    return '';
  }
}

export const startChainContainer = async (name: string = 'qtest') => {
  execute(``);
  const start = new Date().getTime();
  while (!execute('', true)) {
    await sleep(1000);
  }
}

export const getContainers = (): { name: string, id: string }[] => {
  const rawResult = execute('docker ps -a --format "{{.Names}}:{{.ID}}"');
  const rawResultSplit = rawResult.split('\n');
  rawResultSplit.pop();
  return rawResultSplit.map(line => { 
    const lineSplit = line.split(':');
    return {
      name: lineSplit[0],
      id: lineSplit[1]
    }
  })
}

export const killExistingContainer = async (): Promise<void> => {
  const containers = getContainers();
  const qTestContainer = containers.find(c => c.name === 'qtest');
  if (qTestContainer) {
    execute(`docker rm -f ${qTestContainer.id}`);
  }
}

export const getChainIp = async (name: string = 'qtest'): Promise<string> => {
  return execute(`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name}`);
}

