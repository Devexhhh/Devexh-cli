import gradient from "gradient-string";
const myGradient = gradient(["#d678ba", "#55bcca"]);

export function showBanner() {
    const banner = `
██████╗ ███████╗██╗   ██╗███████╗██╗  ██╗
██╔══██╗██╔════╝██║   ██║██╔════╝╚██╗██╔╝
██║  ██║█████╗  ██║   ██║█████╗   ╚███╔╝ 
██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝   ██╔██╗ 
██████╔╝███████╗ ╚████╔╝ ███████╗██╔╝ ██╗
╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
`;

    console.log(myGradient.multiline(banner));
}
