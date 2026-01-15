#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();

program
    .name('devex')
    .description('A CLI tool for Devex to experiment with the terminal.')
    .version('0.1.0');

program
    .command('whoami')
    .description('Prints who you are in the terminal universe.')
    .action(() => {
        console.log('You are devex, bending Javascript to your will!');
    });

program
    .command('greet')
    .argument('<name>')
    .option("-l, --loud", "shout it")
    .action((name, options) => {
        let msg = `Hello, ${name}!, welcome to devex.cli.`;
        if (options.loud) {
            msg = msg.toUpperCase();
        }
        console.log(msg);
    })

program.parse();