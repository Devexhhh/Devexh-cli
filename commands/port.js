import { execSync } from "child_process";
import chalk from "chalk";
import boxen from "boxen";

function getPIDOnPort(port) {
    try {
        const platform = process.platform;
        if (platform === "win32") {
            const output = execSync(
                `netstat -ano | findStr :${port}`,
                { encoding: "utf-8" }
            );
            const lines = output.trim().split("\n");
            for (const line of lines) {
                if (line.includes(`0.0.0.0.${port}`) || line.includes(`127.0.0.1:${port}`)) {
                    const parts = line.trim().split(/\s+/);
                    return parts[parts.length - 1];
                }
            }
        } else {
            // for Linux/MACOS
            const output = execSync(
                `lsof -i TCP:${port} -sTCP:LISTEN -t`,
                { encoding: "utf-8" }
            );
            return output.trim().split("\n")[0];
        }
    } catch {
        return null;
    }
}

function getProcessName(pid) {
    try {
        const platform = process.platform;
        if (platform === "win32") {
            const output = execSync(
                `tasklist /FI "PID eq ${pid} /FO /CSV /NH`,
                { encoding: "utf-8" }
            );
            return output.split(",")[0].replace(/"/g, "");
        } else {
            return execSync(`ps -p ${pid} -o comm=`, { encoding: "utf-8" }).trim();
        }
    } catch {
        return "unknown";
    }
}

function killPID(pid) {
    try {
        if (process.platform === "win32") {
            execSync(`taskkill /PID ${pid} /F`, { encoding: "utf-8" });
        } else {
            execSync(`kill -9 ${pid}`, { encoding: "utf-8" });
        }
        return true;
    } catch {
        return false;
    }
}


export default function port(program) {
    program
        .command("port <number>")
        .description("Kill the process running on a given port")
        .option("-f, --force", "Skip confirmation prompt")
        .action(async (number, options) => {
            const portNum = parseInt(number, 10);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                console.log(chalk.red(`✖ Invalid port number: ${number}`));
                process.exit(1);
            }
            console.log(chalk.gray(`\nScanning port ${portNum}...\n`));
            const pid = getPIDOnPort(portNum);
            if (!pid) {
                console.log(
                    boxen(
                        `${chalk.yellow("●")} Nothing is running on port ${chalk.bold(portNum)}`,
                        { adding: { left: 2, right: 2, top: 0, bottom: 0 }, borderStyle: "round", borderColor: "gray" }
                    )
                );
                return;
            }
            const name = getProcessName(pid);
            console.log(
                boxen(
                    `${chalk.red("●")} Port ${chalk.bold.white(portNum)} is in use\n\n` +
                    `  ${chalk.gray("Process:")} ${chalk.cyan(name)}\n` +
                    `  ${chalk.gray("PID    :")} ${chalk.cyan(pid)}`,
                    { padding: { left: 2, right: 4, top: 1, bottom: 1 }, borderStyle: "round", borderColor: "red" }
                )
            );
            if (!options.force) {
                const { default: readline } = await import("readline");
                const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
                const answer = await new Promise((resolve) =>
                    rl.question(chalk.yellow(`\n  Kill process "${name}" (PID ${pid})? [y/N] `), resolve)
                );
                rl.close();

                if (answer.toLowerCase() !== "y") {
                    console.log(chalk.gray("\n  Aborted.\n"));
                    return;
                }
            }

            const success = killPID(pid);

            if (success) {
                console.log(chalk.green(`\n  ✔ Killed ${name} (PID ${pid}) on port ${portNum}\n`));
            } else {
                console.log(chalk.red(`\n  ✖ Failed to kill PID ${pid}. Try running with sudo.\n`));
            }
        })
}