import chalk from "chalk";
import boxen from "boxen";

function pad(n) {
    return String(n).padStart(2, "0");
}

function formatRelative(unix) {
    const now = Math.floor(Date.now() / 1000);
    const delta = Math.abs(now - unix);

    if (delta < 60) return `${delta}s ago`;
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
}

function parseInput(input) {
    if (/^\d+$/.test(input)) {
        const n = Number(input);
        return n > 1e12 ? Math.floor(n / 1000) : n;
    }

    const d = new Date(input);
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    return null;
}

function renderStamp(unix) {
    const d = new Date(unix * 1000);
    const utcDate = d.toUTCString();
    const iso = d.toISOString();
    const local = d.toLocaleString();
    const ms = unix * 1000;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[d.getUTCDay()];

    const rows = [
        ["Unix (s)", chalk.white(String(unix))],
        ["Unix (ms)", chalk.white(String(ms))],
        ["ISO 8601", chalk.cyan(iso)],
        ["UTC", chalk.yellow(utcDate)],
        ["Local", chalk.green(local)],
        ["Day", chalk.white(dayOfWeek)],
    ];

    const maxKey = Math.max(...rows.map(([k]) => k.length));
    const lines = rows.map(([k, v]) => `  ${chalk.gray(k.padEnd(maxKey))}  ${v}`);

    const content = [
        chalk.bold.white("🕐 Timestamp"),
        "",
        ...lines,
    ].join("\n");

    console.log(
        boxen(content, {
            padding: { top: 1, bottom: 1, left: 2, right: 4 },
            borderStyle: "round",
            borderColor: "yellow",
        })
    );
}

export default function stamp(program) {
    program
        .command("stamp [input]")
        .description("Show current timestamp in Unix, ISO, UTC, and local — or convert any date/timestamp")
        .option("-c, --copy", "Copy Unix timestamp to clipboard")
        .action(async (input, options) => {
            let unix;

            if (!input) {
                unix = Math.floor(Date.now() / 1000);
            } else {
                unix = parseInput(input);
                if (unix === null) {
                    console.log(chalk.red(`\n  ✖ Could not parse: "${input}"`));
                    console.log(chalk.gray("  Examples:"));
                    console.log(chalk.gray("    devex stamp                          # now"));
                    console.log(chalk.gray("    devex stamp 1714000000               # unix seconds"));
                    console.log(chalk.gray("    devex stamp 1714000000000            # unix ms"));
                    console.log(chalk.gray('    devex stamp "2024-04-25"             # ISO date'));
                    console.log(chalk.gray('    devex stamp "April 25 2024 12:00"    # natural date\n'));
                    process.exit(1);
                }
            }

            console.log();
            renderStamp(unix);

            if (input) {
                const rel = formatRelative(unix);
                console.log(chalk.gray(`  ${rel}\n`));
            } else {
                console.log();
            }

            if (options.copy) {
                try {
                    const { default: clipboardy } = await import("clipboardy");
                    await clipboardy.write(String(unix));
                    console.log(chalk.green("  ✔ Unix timestamp copied to clipboard\n"));
                } catch {
                    console.log(chalk.yellow("  ⚠ Install clipboardy: npm i clipboardy\n"));
                }
            }
        });
}