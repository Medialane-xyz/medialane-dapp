const { RpcProvider } = require('starknet');
async function run() {
  const provider = new RpcProvider({ nodeUrl: "https://free-rpc.nethermind.io/mainnet-juno" });
  try {
     const res = await provider.callContract({
         contractAddress: "0x522fccc569e9bf2226ba1e155500df7939c321bb824d9a1b1a3d52835f95d69",
         entrypoint: "get_approved",
         calldata: ["1", "0"]
     });
     console.log("Token 1 approved strictly to:", res[0]);
  } catch(e) { console.log(e); }
  
  try {
      const isApprovedForAll = await provider.callContract({
          contractAddress: "0x522fccc569e9bf2226ba1e155500df7939c321bb824d9a1b1a3d52835f95d69",
          entrypoint: "is_approved_for_all",
          calldata: ["0x5f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2", "0x4299b51289aa700de4ce19cc77bcea8430bfd1aef04193efab09d60a3a7ee0f"]
      });
      console.log("Is approved for all collection:", isApprovedForAll[0]);
  } catch(e) { console.log(e); }
}
run();
