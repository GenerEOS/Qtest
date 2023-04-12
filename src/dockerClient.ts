import { execSync } from "child_process";
const dockerImageName = "genereos/qtest:v1.2.0";

function execute(command, ignoreFail = false) {
  try {
    return execSync(command, {
      encoding: "utf8",
    });
  } catch (e) {
    if (!ignoreFail) {
      throw e;
    }
    return "";
  }
}

const pullDockerImage = async () => {
  try {
    execute(`docker inspect --type=image ${dockerImageName}`);
  } catch (e) {
    if (e.toString().includes(`Error: No such image: ${dockerImageName}`)) {
      process.stdout.write(
        `Pulling docker image ${dockerImageName}. This process will take few mintutes ...\n`
      );
      process.stdout.write(
        `\x1b[93mWarning: Your tests might be failed for the first time while downloading the ${dockerImageName} because of the test timeout\x1b[39m\n`
      );
      execute(`docker pull ${dockerImageName}`);
    } else {
      throw e;
    }
  }
};

export const startChainContainer = async (
  rpcPort: number = 8880,
  tokenSymbol = "EOS"
) => {
  const name = "qtest" + rpcPort;
  await pullDockerImage();
  execute(
    `docker run --name ${name} --env SYSTEM_TOKEN_SYMBOL='${tokenSymbol}' -d -p ${rpcPort}:8888 ${dockerImageName}`
  );
};

export const manipulateChainTime = async (
  rpcPort: number,
  timeFormat: string
) => {
  const name = "qtest" + rpcPort;
  execute(
    `docker exec ${name} /app/scripts/manipulate_time.sh "${timeFormat}"`
  );
};

export const getContainers = (): { name: string; id: string }[] => {
  const rawResult = execute('docker ps -a --format "{{.Names}}:{{.ID}}"');
  const rawResultSplit = rawResult.split("\n");
  rawResultSplit.pop();
  return rawResultSplit.map((line) => {
    const lineSplit = line.split(":");
    return {
      name: lineSplit[0],
      id: lineSplit[1],
    };
  });
};

export const checkContainerHealthStatus = async (
  rpcPort: number
): Promise<boolean> => {
  const name = "qtest" + rpcPort;
  const rawResult = execute(
    `docker inspect --format='{{json .State.Health}}' ${name}`
  );
  const jsonResult = JSON.parse(rawResult);
  if (jsonResult.Status === "healthy") {
    return true;
  } else {
    return false;
  }
};

export const killExistingChainContainer = async (
  rpcPort: number
): Promise<void> => {
  const name = "qtest" + rpcPort;
  execute(`docker rm -f ${name}`);
};

export const killAllExistingChainContainer = async (): Promise<void> => {
  const containers = getContainers();
  const qTestContainer = containers.find((c) => c.name.startsWith("qtest"));
  if (qTestContainer) {
    execute(`docker rm -f ${qTestContainer.id}`);
  }
};

export const getChainIp = async (rpcPort: number): Promise<string> => {
  const name = "qtest" + rpcPort;
  return execute(
    `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${name}`
  );
};
