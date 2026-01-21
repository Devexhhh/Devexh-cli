import { execSync } from "child_process";
import chalk from "chalk";

export default function react(program) {
    program
        .command("react")
        .argument("<name>", "project name")
        .option("--ts", "Use TypeScript")
        .option("--js", "Use JavaScript")
        .description("Create a React project using Vite")
        .action((name, options) => {
            let template = "react";

            if (options.ts) template = "react-ts";
            if (options.js) template = "react";

            console.log(
                chalk.cyan(`Creating React project '${name}' using ${template}...`)
            );

            try {
                execSync(
                    `npm create vite@latest ${name} -- --template ${template}`,
                    { stdio: "inherit" }
                );

                console.log(chalk.green("\nProject created successfully!\n"));
                console.log("Next steps:");
                console.log(`  cd ${name}`);
                console.log("  npm install");
                console.log("  npm run dev");
            } catch (err) {
                console.log(chalk.red("Failed to create project."));
            }
        });
}
