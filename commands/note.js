import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import chalk from "chalk";
import boxen from "boxen";

const DEVEX_DIR = join(homedir(), ".devex");
const NOTES_FILE = join(DEVEX_DIR, "notes.json");

function ensureDir() {
    if (!existsSync(DEVEX_DIR)) mkdirSync(DEVEX_DIR, { recursive: true });
}

function loadNotes() {
    ensureDir();
    if (!existsSync(NOTES_FILE)) return [];
    try {
        return JSON.parse(readFileSync(NOTES_FILE, "utf8"));
    } catch {
        return [];
    }
}

function saveNotes(notes) {
    ensureDir();
    writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function tagColor(tag) {
    const colors = [chalk.cyan, chalk.yellow, chalk.magenta, chalk.green, chalk.blue];
    let hash = 0;
    for (const c of tag) hash = (hash * 31 + c.charCodeAt(0)) & 0xff;
    return colors[hash % colors.length](tag);
}

function renderNote(note, idx) {
    const tags = note.tags?.length
        ? "  " + note.tags.map((t) => tagColor(`#${t}`)).join(" ")
        : "";
    const header = `${chalk.gray(`#${String(idx + 1).padStart(2, "0")}`)}  ${chalk.white(note.text)}`;
    const footer = chalk.gray(`  ${formatDate(note.createdAt)}`) + tags;
    return `${header}\n${footer}`;
}