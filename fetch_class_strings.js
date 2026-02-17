
const { RpcProvider } = require("starknet");
const fs = require("fs");

const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS" });
const MARKETPLACE_ADDRESS = "0x059deafbbafbf7051c315cf75a94b03c5547892bc0c6dfa36d7ac7290d4cc33a";

async function run() {
    console.log("Fetching class hash...");
    const classHash = await provider.getClassHashAt(MARKETPLACE_ADDRESS);
    console.log("Class Hash:", classHash);

    console.log("Fetching class definition...");
    const classDef = await provider.getClass(classHash);

    // Convert to string and search for readable strings
    const jsonStr = JSON.stringify(classDef);

    // Regex for potential shortstrings (hex that decodes to readable ASCII)
    // Actually, string literals in Sierra/CASM are often stored as hex or hardcoded felts.
    // e.g. "StarkNet Domain" -> 0x537461726b4e657420446f6d61696e

    console.log("Searching for strings...");

    // Helper to decode hex to string
    function hexToString(hex) {
        if (!hex.startsWith("0x")) return "";
        try {
            let str = "";
            for (let i = 2; i < hex.length; i += 2) {
                const code = parseInt(hex.substr(i, 2), 16);
                if (code >= 32 && code <= 126) {
                    str += String.fromCharCode(code);
                } else {
                    return ""; // non-printable, likely not a text string
                }
            }
            return str;
        } catch (e) { return ""; }
    }

    // Search for generic patterns or dumped strings in ABI/structure
    // Note: Constants in Sierra are often not obvious.
    // But sometimes they appear in debug info or just as data.

    // Let's just dump the ABI to verify what we saw.
    console.log("ABI:", JSON.stringify(classDef.abi, null, 2));

    // Also write to file for manual inspection if needed
    fs.writeFileSync("dapp_class.json", jsonStr);
    console.log("Saved to dapp_class.json");
}

run();
