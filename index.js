#!/usr/bin/env node
import { Command } from 'commander';
import hex from './commands/hex.js';
import ascii from './commands/ascii.js';
const program = new Command();

program
    .name('devex')
    .description('A CLI tool for Devex to experiment with the terminal.')
    .version('0.1.0');

program
    .command('me')
    .description('Prints who you are in the terminal universe.')
    .action(() => {
        console.log('You are devex, bending Javascript to your will!');
    });

program
    .command('greet')
    .argument('<name>')
    .option("-u, --upper", "Convert greeting to uppercase")
    .action((name, options) => {
        let msg = `Hello, ${name}!, welcome to devex's cli.`;
        if (options.upper) {
            msg = msg.toUpperCase();
        }
        console.log(msg);
    })

hex(program);
ascii(program);

program.parse();