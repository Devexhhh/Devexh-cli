import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

export default function js(program) {
    program
        .command("js")
        .argument("<name>", "project name")
        .description("Create a basic JavaScript project")
        .action((name) => {
            const projectPath = path.resolve(process.cwd(), name);

            if (fs.existsSync(projectPath)) {
                console.log(chalk.red(`Folder '${name}' already exists.`));
                process.exit(1);
            }

            console.log(chalk.cyan(`Creating JS project '${name}'...`));

            fs.mkdirSync(projectPath);
            process.chdir(projectPath);

            try {
                execSync("npm init -y", { stdio: "inherit" });
                execSync("npm install", { stdio: "inherit" });

                fs.writeFileSync(
                    "index.js",
                    'console.log("Hello from devex JS project");\n'
                );

                console.log(chalk.green("\nJS project ready!\n"));
                console.log("Next steps:");
                console.log(`  cd ${name}`);
                console.log("  node index.js");
            } catch (err) {
                console.log(chalk.red("Failed to create JS project."));
            }
        });
}
