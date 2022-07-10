import { execSync } from 'child_process';
import { Asset } from './asset';

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

export const startChainContainer = async (enableSystemContract: boolean, rpcPort: number = 8880, tokenSupply = Asset.fromString('12345678.00000000 WAX')) => {
  const name = 'qtest' + rpcPort;
  execute(`docker pull songmai108/qtest:v0.0.1`);
  execute(`docker run --name ${name} --env EOSIO_PUB_KEY=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV --env EOSIO_PRV_KEY=5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 --env SYSTEM_TOKEN_AMOUNT="${tokenSupply.amountFixed()}" --env SYSTEM_TOKEN_SYMBOL=${tokenSupply.symbol.symbol} --env ENABLE_SYSTEM_CONTRACT=${Number(enableSystemContract)} -d -p ${rpcPort}:8888 songmai108/qtest:v1.0.2`);
}

export const manipulateChainTime = async (rpcPort: number, time: number) => {
  const name = 'qtest' + rpcPort;
  execute(`docker exec ${name} /app/scripts/manipulate_time.sh +${time}`);
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

export const killExistingChainContainer = async (rpcPort: number): Promise<void> => {
  const name = 'qtest' + rpcPort;
  execute(`docker rm -f ${name}`);
}

export const killAllExistingChainContainer = async (): Promise<void> => {
  const containers = getContainers();
  const qTestContainer = containers.find(c => c.name.startsWith('qtest'));
  if (qTestContainer) {
    execute(`docker rm -f ${qTestContainer.id}`);
  }
}

export const getChainIp = async (rpcPort: number): Promise<string> => {
  const name = 'qtest' + rpcPort;
  return execute(`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name}`);
}

