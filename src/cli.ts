import { define } from "gunshi";

export const app = define({
  name: "create-cli",
  description: "Scaffold a modern Node.js CLI app",
  run: () => {
    console.log("Welcome to create-cli! Run with --help to see commands.");
  },
});
