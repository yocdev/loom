#!/usr/bin/env node
import { readConfig } from './utils/cli-tools';
import { RouterShuttle } from './shuttles/router';

export * from './defineConfig';

async function main() {
  const config = await readConfig();

  await RouterShuttle(config.router);
}

main();
