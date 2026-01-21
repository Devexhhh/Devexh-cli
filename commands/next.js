import { execSync } from "child_process";
import chalk from "chalk";

export default function next(program) {
    program
        .command("next")
        .argument("<name>", "project name")
        .option("--ts", "Use TypeScript")
        .option("--js", "Use JavaScript")
        .description("Create a Next.js project using create-next-app")
        .action((name, options) => {
            if (options.ts && options.js) {
                console.log(
                    chalk.red("Choose either --ts or --js, not both.")
                );
                process.exit(1);
            }

            const useTS = options.ts ? "--typescript" : "";
            const useJS = options.js ? "--javascript" : "";

            console.log(
                chalk.cyan(`Creating Next.js project '${name}'...`)
            );

            try {
                execSync(
                    `npx create-next-app@latest ${name} ${useTS} ${useJS}`,
                    { stdio: "inherit" }
                );

                console.log(chalk.green("\nNext.js project created successfully!\n"));
                console.log("Next steps:");
                console.log(`  cd ${name}`);
                console.log("  npm run dev");
            } catch (err) {
                console.log(chalk.red("Failed to create Next.js project."));
            }
        });
}
