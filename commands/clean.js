import { success, danger, muted } from "../utils/colors.js";
import fs from "fs";
import path from "path";
import ora from "ora";

export default function (program) {
    program
        .command("clean")
        .description("Remove build and cache folders")
        .action(() => {
            const spinner = ora(muted("Cleaning project...")).start();

            try {
                const folders = ["node_modules", "dist", "build", ".next", ".turbo"];

                folders.forEach((folder) => {
                    const fullPath = path.join(process.cwd(), folder);
                    if (fs.existsSync(fullPath)) {
                        fs.rmSync(fullPath, { recursive: true, force: true });
                    }
                });

                spinner.succeed(success("Project cleaned successfully"));
            } catch (e) {
                spinner.fail(danger("Failed to clean project"));
            }
        });
}
