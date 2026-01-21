#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import hex from "./commands/hex.js";
import ascii from "./commands/ascii.js";
import about from "./commands/about.js";
import clean from "./commands/clean.js";
import env from "./commands/env.js";
import react from "./commands/react.js";
import next from "./commands/next.js";
import js from "./commands/js.js";
import { showBanner } from "./utils/banner.js";


const program = new Command();

program
    .name("devex")
    .description("A developer’s second brain")
    .version("0.1.0");

program
    .command("me")
    .description("Prints who you are in the terminal universe")
    .action(() => {
        console.log("You are devex, bending JavaScript to your will!");
    });

program
    .command("greet")
    .argument("[name]")
    .option("-u, --upper", "Convert greeting to uppercase")
    .action((name = "Developer", options) => {
        let msg = `Hello, ${name}! Welcome to devex CLI.`;
        if (options.upper) msg = msg.toUpperCase();
        console.log(msg);
    });

hex(program);
ascii(program);
about(program);
clean(program);
env(program);
react(program);
next(program);
js(program);

if (process.argv.length === 2) {
    showBanner();
    console.log(chalk.hex('#DEADED').bold("A developer`s second brain\n"));
}

program.parse(process.argv);
