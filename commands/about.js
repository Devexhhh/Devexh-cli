import chalk from "chalk";
import boxen from "boxen";

export default function (program) {
    program
        .command("about")
        .description("About devex")
        .action(() => {
            const title = chalk.bold.cyan("DEVEX CLI");
            const subtitle = chalk.gray("A developer`s second brain");

            const content = `${title}\n\n${subtitle}\n\n• Tools\n• Focus\n• Speed`;

            console.log(
                boxen(content, {
                    padding: 1,
                    borderStyle: "round",
                    borderColor: "cyan"
                })
            );
        });
}
