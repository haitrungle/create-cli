import { define } from "gunshi";

export const app = define({
  name: "my-cli",
  description: "My little CLI app",
  run: () => {
    console.log("Welcome to my-cli! Run with --help to see commands.");
  },
});
