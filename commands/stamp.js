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