import { execSync } from 'child_process';

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

export const startChainContainer = async (
  rpcPort: number = 8880,
  tokenSymbol = 'WAX' 
) => {
  const name = 'qtest' + rpcPort;
  execute(`docker pull genereos/qtest:v1.1.1`);
  execute(
    `docker run --name ${name} --env SYSTEM_TOKEN_SYMBOL='${tokenSymbol}' -d -p ${rpcPort}:8888 genereos/qtest:v1.1.1`
  );
};

export const manipulateChainTime = async (rpcPort: number, time: number) => {
  const name = 'qtest' + rpcPort;
  execute(`docker exec ${name} /app/scripts/manipulate_time.sh +${time}`);
};

export const getContainers = (): { name: string, id: string }[] => {
  const rawResult = execute('docker ps -a --format "{{.Names}}:{{.ID}}"');
  const rawResultSplit = rawResult.split('\n');
  rawResultSplit.pop();
  return rawResultSplit.map((line) => {
    const lineSplit = line.split(':');
    return {
      name: lineSplit[0],
      id: lineSplit[1],
    };
  });
};

export const killExistingChainContainer = async (
  rpcPort: number
): Promise<void> => {
  const name = 'qtest' + rpcPort;
  execute(`docker rm -f ${name}`);
};

export const killAllExistingChainContainer = async (): Promise<void> => {
  const containers = getContainers();
  const qTestContainer = containers.find((c) => c.name.startsWith('qtest'));
  if (qTestContainer) {
    execute(`docker rm -f ${qTestContainer.id}`);
  }
};

export const getChainIp = async (rpcPort: number): Promise<string> => {
  const name = 'qtest' + rpcPort;
  return execute(
    `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name}`
  );
};
