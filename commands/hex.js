export default function (program) {
    program
        .command("hex")
        .argument("<number>")
        .description("Convert decimal to hex, binary and octal")
        .action((num) => {
            const n = Number(num);

            console.log("Decimal:", n);
            console.log("Hex:", "0x" + n.toString(16));
            console.log("Binary:", "0b" + n.toString(2));
            console.log("Octal:", "0o" + n.toString(8));
        });
}