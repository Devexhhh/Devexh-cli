import { exec, execSync } from "child_process";
import chalk from "chalk";
import boxen from "boxen";

function getPIDOnPort(port) {
    try {
        const platform = process.platform;
        if (platform === "win32") {
            const output = execSync(
                `netstat -ano | findStr :${port}`,
                {encoding: "utf-8"}
            );
            const lines = output.trim().split("\n");
            for (const line of lines) {
                if (line.includes(`0.0.0.0.${port}`) || line.includes(`127.0.0.1:${port}`)){
                    const parts = line.trim().split(/\s+/);
                    return parts[parts.length - 1];
                }
            }
        } else {
            // for Linux/MACOS
            const output = execSync(
                `lsof -i TCP:${port} -sTCP:LISTEN -t`,
                {encoding: "utf-8"}
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
                {encoding: "utf-8"}
            );
            return output.split(",")[0].replace(/"/g,"");
        } else {
            return execSync(`ps -p ${pid} -o comm=`, {encoding: "utf-8"}).trim();
        }
    } catch {
        return "unknown";
    }
}
