import Docker from 'dockerode';
import { config } from '../../config';

let client: Docker | null = null;

export function getDocker(): Docker {
  if (!client) {
    client = new Docker({ socketPath: config.DOCKER_SOCKET });
  }
  return client;
}

export async function isDockerAvailable(): Promise<boolean> {
  if (config.isTest) return false;
  try {
    const docker = getDocker();
    await Promise.race([
      docker.ping(),
      new Promise((_resolve, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
    ]);
    return true;
  } catch {
    return false;
  }
}

export function resetDockerClient(): void {
  client = null;
}
