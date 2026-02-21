import { RpcProvider } from 'starknet';

async function main() {
    const provider = new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://free-rpc.nethermind.io/mainnet-juno" });
    const marketContract = "0x4299b51289aa700de4ce19cc77bcea8430bfd1aef04193efab09d60a3a7ee0f";
    
    console.log("Checking Token 1 (0x522fccc569e9bf2226ba1e155500df7939c321bb824d9a1b1a3d52835f95d69)");
    try {
        const res = await provider.callContract({
            contractAddress: "0x522fccc569e9bf2226ba1e155500df7939c321bb824d9a1b1a3d52835f95d69",
            entrypoint: "get_approved",
            calldata: ["1", "0"]
        });
        console.log("Token 1 approved to:", res.result[0]);
    } catch (e) {
        console.log("Error checking Token 1:", e.message);
    }
}
main();
