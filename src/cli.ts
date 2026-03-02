import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { define } from "gunshi";
import { red, green, bold, cyan } from "kolorist";
import prompts from "prompts";

export const app = define({
  name: "create-cli",
  description: "Scaffold a modern Node.js CLI app",
  run: async (ctx) => {
    const cwd = process.cwd();
    let targetDir = ctx.positionals[2];

    const defaultProjectName = "my-cli-app";

    if (!targetDir) {
      const response = await prompts({
        type: "text",
        name: "projectName",
        message: "Project name:",
        initial: defaultProjectName,
      });

      if (!response.projectName) {
        console.log(red("✖ Operation cancelled"));
        return;
      }
      targetDir = response.projectName as string;
    }

    const root = path.join(cwd, targetDir);
    console.log(`\nScaffolding project in ${bold(root)}...`);

    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    } else {
      const existing = fs.readdirSync(root);
      if (existing.length) {
        const response = await prompts({
          type: "confirm",
          name: "overwrite",
          message: `Target directory ${targetDir} is not empty. Remove existing files and continue?`,
        });
        if (!response.overwrite) {
          console.log(red("✖ Operation cancelled"));
          return;
        }
        fs.rmSync(root, { recursive: true, force: true });
        fs.mkdirSync(root, { recursive: true });
      }
    }

    // Determine template directory
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    let templateDir = path.resolve(__dirname, "template");

    if (!fs.existsSync(templateDir)) {
      // Checking a few common locations.
      const candidates = [
        path.resolve(__dirname, "../template"), // dist/template
        path.resolve(process.cwd(), "template"), // fallback for local dev
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          templateDir = candidate;
          break;
        }
      }
    }

    if (!fs.existsSync(templateDir)) {
      console.error(red(`✖ Template directory not found. Expected at: ${templateDir}`));
      return;
    }

    // Copy template files
    const files = fs.readdirSync(templateDir);
    for (const file of files) {
      if (file === "package.json") {
        const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, file), "utf-8"));
        pkg.name = path.basename(root);
        fs.writeFileSync(path.join(root, file), JSON.stringify(pkg, null, 2));
        continue;
      }

      if (file === "_gitignore") {
        fs.copyFileSync(path.join(templateDir, file), path.join(root, ".gitignore"));
        continue;
      }

      // Recursive copy for directories
      const srcFile = path.join(templateDir, file);
      const destFile = path.join(root, file);

      fs.cpSync(srcFile, destFile, { recursive: true });
    }

    console.log(`\n${green("✔")} Done. Now run:\n`);
    console.log(`  ${cyan(`cd ${targetDir}`)}`);
    console.log(`  ${cyan("npm install")}`);
    console.log(`  ${cyan("npm run dev")}`);
    console.log();
  },
});
