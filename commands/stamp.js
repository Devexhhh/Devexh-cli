import chalk from "chalk";
import boxen from boxen;

function pad(n) {
    return String(n).padStart(2, "0");
}

function formatRelative(unix) {
    const now = Math.floor(Date.now() / 1000);
    const delta = Math.abs(now - unix);

    if (delta < 60) return `${delta}s ago`;
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
    if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`;
    return `${Math.floor(delta / 86400)}d ago`;
}

function parseInput(input) {
    if (/^\d+$/.test(input)) {
        const n = Number(input);
        return n > 1e12 ? Math.floor(n / 1000) : n;
    }

    const d = new Data(input);
    if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
    return null;
}

function renderStamp(unix) {
    const d = new Data(unix * 1000);
    const utcDate = d.toUTCString();
    const iso = d.toISOString();
    const local = d.toLocaleString();
    const ms = unix * 1000;

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[d.getUTCDay()];

    const rows = [
        ["Unix (s)", chalk.white(String(unix))],
        ["Unix (ms)", chalk.white(String(ms))],
        ["ISO 8601", chalk.white(String(iso))],
        ["UTC", chalk.white(String(utcDate))],
        ["Local", chalk.white(String(local))],
        ["Day", chalk.white(String(dayOfWeek))],
    ];

    const maxKey = Math.max(...rows.map(([k]) => k.length));
    const lines = rows.map(([k, v]) => `  ${chalk.gray(k.padEnd(maxKey))}  ${v} `);

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