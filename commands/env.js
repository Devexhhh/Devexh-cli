import Table from "cli-table3";
import { muted, warning } from "../utils/colors.js";

export default function (program) {
    program
        .command("env")
        .description("Show environment info")
        .action(() => {
            const table = new Table({
                head: [warning("Key"), warning("Value")],
            });

            table.push(
                ["NODE_ENV", muted(process.env.NODE_ENV || "undefined")],
                ["NODE_VERSION", muted(process.version)],
                ["PLATFORM", muted(process.platform)],
                ["ARCH", muted(process.arch)]
            );

            console.log(table.toString());
        });
}
