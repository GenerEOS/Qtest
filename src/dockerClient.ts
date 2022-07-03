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

export const startChainContainer = async (name: string = 'qtest', tokenSupply = "12345678.0000 WAX") => {
  const coreSymbol = tokenSupply.split(' ')[1];
  execute(`docker pull songmai108/qtest:v0.0.1`);
  execute(`docker run --name ${name} --env EOSIO_PUB_KEY=EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV --env EOSIO_PRV_KEY=5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 --env SYSTEM_TOKEN_SUPPLY="${tokenSupply}" --env SYSTEM_TOKEN_SYMBOL=${coreSymbol} --env ENABLE_SYSTEM_CONTRACT=1 -d -p 8888:8888 songmai108/qtest:v0.0.1`);
}

export const manipulateChainTime = async (time: number) => {
  execute(`docker exec qtest /app/scripts/manipulate_time.sh +${time}`);
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
