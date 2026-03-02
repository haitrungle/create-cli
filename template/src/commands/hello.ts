import { define } from "gunshi";

export const hello = define({
  name: "hello",
  description: "Say hello",
  args: {
    name: {
      type: "string",
      short: "n",
      description: "Name to greet",
      default: "World",
    },
  },
  run: (ctx) => {
    console.log(`Hello, ${ctx.values.name}!`);
  },
});
