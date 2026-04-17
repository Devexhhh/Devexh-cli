import { createHash } from "crypto";
import { readFileSync, existsSync } from "fs";
import chalk from "chalk";
import Table from "cli-table3";

const ALGORITHMS = ["md5", "sha1", "sha256", "sha512"];

function hashString(input, algo) {
    return createHash(algo).update(input, "utf8").digest("hex");
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

export default function hash(program) {
    program
        .command("hash <input>")
        .description("Hash a string or file (md5, sha1, sha256, sha512)")
        .option("-a, --algo <algo>", "Specific algorithm: md5 | sha1 | sha256 | sha512")
        .option("-c, --copy", "Copy the result to clipboard (single algo only)")
        .action(async (input, options) => {
            const isFile = existsSync(input);
            const algo = options.algo?.toLowerCase();

            // Validate algo if provided
            if (algo && !ALGORITHMS.includes(algo)) {
                console.log(chalk.red(`\n  ✖ Unknown algorithm: "${algo}"`));
                console.log(chalk.gray(`  Available: ${ALGORITHMS.join(", ")}\n`));
                process.exit(1);
            }

            const label = isFile
                ? `${chalk.gray("File:")} ${chalk.cyan(input)}`
                : `${chalk.gray("Input:")} ${chalk.cyan(`"${input}"`)}`;

            console.log(`\n  ${label}\n`);

            const algosToRun = algo ? [algo] : ALGORITHMS;
            const results = {};

            for (const a of algosToRun) {
                try {
                    results[a] = isFile ? hashFile(input, a) : hashString(input, a);
                } catch (err) {
                    console.log(chalk.red(`  ✖ Failed to hash with ${a}: ${err.message}\n`));
                    process.exit(1);
                }
            }

            if (algosToRun.length === 1) {
                // Single algo — clean output
                const result = results[algosToRun[0]];
                console.log(`  ${colorAlgo(algosToRun[0])}  ${chalk.white(result)}\n`);

                if (options.copy) {
                    try {
                        const { default: clipboardy } = await import("clipboardy");
                        await clipboardy.write(result);
                        console.log(chalk.green("  ✔ Copied to clipboard\n"));
                    } catch {
                        console.log(chalk.yellow("  ⚠ Install 'clipboardy' to enable clipboard support\n"));
                    }
                }
            } else {
                // All algos — table output
                const table = new Table({
                    head: [chalk.gray("Algorithm"), chalk.gray("Hash")],
                    style: { border: ["gray"], head: [] },
                    colWidths: [12, 70],
                });

                for (const a of algosToRun) {
                    table.push([colorAlgo(a), chalk.white(results[a])]);
                }

                console.log(table.toString());
                console.log();
                console.log(chalk.gray("  Tip: Use --algo sha256 --copy to copy a specific hash\n"));
            }
        });
}