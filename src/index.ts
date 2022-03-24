import { readConfig } from './utils/cli-tools';
import { RouterShuttle } from './shuttles/router';
import { IconShuttle } from './shuttles/icon';

export * from './defineConfig';

async function main() {
  const config = await readConfig();

  await RouterShuttle(config.router);

  await IconShuttle(config.icon);
}

main();
