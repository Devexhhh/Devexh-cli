import { createHash } from "crypto";
import { readFileSync, existsSync } from "fs";
import chalk from "chalk";
import Table from "cli-table3";

const ALGORITHMS = ["md5", "sha1", "sha256", "sha512"];

function hashString(input, algo) {
    return createHash(algo).update(input, "utf-8").digest("hex");
}

function hashFile(filepath, algo) {
    const buffer = readFileSync(filepath);
    return createHash(algo).update(buffer).digest("hex");
}

function colorAlgo(algo) {
    const colors = {
        md5: chalk.gray,
        sha1: chalk.yellow,
        sha256: chalk.cyan,
        sha512: chalk.magenta,
    };
    return (colors[algo] || chalk.white)(algo.toUpperCase());
}