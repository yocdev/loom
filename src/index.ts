import { readConfig } from './utils/cli-tools';

export * from './defineConfig';

async function main() {
  const config = await readConfig();

  console.log(config, 'config');
}

main();
