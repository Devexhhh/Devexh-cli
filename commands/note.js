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

export default function note(program) {
    const cmd = program
        .command("note [text]")
        .description("Persistent scratchpad — add, list, search, delete notes")
        .option("-l, --list", "List all notes")
        .option("-d, --delete <id>", "Delete note by ID number")
        .option("-c, --clear", "Delete ALL notes (with confirmation)")
        .option("-s, --search <term>", "Search notes by text or tag")
        .option("-t, --tag <tags>", "Comma-separated tags when adding a note")
        .action(async (text, options) => {

            if (options.list || (!text && !options.delete && !options.clear && !options.search)) {
                const notes = loadNotes();

                if (notes.length === 0) {
                    console.log(chalk.gray("\n  No notes yet. Add one:\n"));
                    console.log(chalk.gray('    devex note "your note here"\n'));
                    return;
                }

                const lines = notes.map((n, i) => renderNote(n, i)).join("\n\n");
                console.log(
                    boxen(
                        `${chalk.bold.white("📝 Notes")}  ${chalk.gray(`(${notes.length})`)}\n\n${lines}`,
                        { padding: { top: 1, bottom: 1, left: 2, right: 4 }, borderStyle: "round", borderColor: "green" }
                    )
                );
                return;
            }
        });
}