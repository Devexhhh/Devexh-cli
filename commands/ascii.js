export default function (program) {
    program
        .command("ascii")
        .argument("<text>")
        .description("Convert text to ASCII codes")
        .action((text) => {
            console.log(
                text.split("").map(c => c.charCodeAt(0)).join(" ")
            );
        });
}