#!/usr/bin/env node
import { cli } from "gunshi";

import { app } from "./cli.js";
import { hello } from "./commands/hello.js";

await cli(process.argv.slice(2), app, {
  name: "my-cli",
  version: "0.0.1",
  description: "My little CLI app",
  subCommands: {
    hello,
  },
});
