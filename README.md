# create-cli

Scaffold a modern and minimal Node.js CLI app.

This is the template I use whenever I have to write a Node.js script. I prioritize modern libraries for their focus on performance, good typing support, and sane default configuration. The catch is that this template is only compatible with Node.js >=20 and uses the preview version of TypeScript, but for internal and personal tools, those requirements are acceptable to me.

This template is heavily inspired by the post [My JS CLI Stack 2025
](https://ryoppippi.com/blog/2025-08-12-my-js-cli-stack-2025-en) by [ryoppippi](https://github.com/ryoppippi). Thank you for sharing!

## Usage

```bash
npx @haitrungle/create-cli <project-name>

# Or follow the prompts
npx @haitrungle/create-cli 
```

Then, refer to [gunshi docs](https://gunshi.dev/guide/essentials/getting-started):

```ts
import { define, cli } from "gunshi";

// Define a subcommand
const hello = define({
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

// Define the entry point
const main = define({
  name: "my-nice-cli",
  description: "My little CLI app",
  run: () => {
    console.log("Welcome to my-nice-cli! Run with --help to see commands.");
  },
});

// Wire up and start the CLI
await cli(process.argv.slice(2), main, {
  name: "my-nice-cli",
  version: "0.0.1",
  description: "My little CLI app",
  subCommands: {
    hello,
  },
});
```

## Dependencies

- `gunshi`: declarative CLI definition with type information out of the box
- `oxfmt` and `oxlint`: formatting and linting
- `vitest`: standard choice for testing
- `@typescript/native-preview`: TypeScript 7.0 preview, fast and stable in my usage
- `@types/node`: type declarations for Node.js
- `tsdown`: fast bundler that is both configurable and extensible

The heaviest library here is `tsdown` at 26 MB. It is possible to omit `tsdown` if you use Node.js >=24 with type stripping, but you have to annotate all type imports with the `type` keyword and set `allowImportingTsExtensions` to true in "tsconfig.json". Then, remove `tsdown` and the `build` script from "package.json" and delete "tsdown.config.ts", and you are good to go.

The second heaviest library here is `vitest` at 21 MB. I hear you: I don't like testing something that feels like an one-off script either. Still, most CLI tools I write are ran more than once anyways, and since they are the easiest kind of program to test, I bit the bullet and include it to make myself feel good. The fact that coding agents work best with tests to keep them in track is the cherry on top. However, you can also delete it just as easily as with `tsdown`, should you prefer.
