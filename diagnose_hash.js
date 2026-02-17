const { RpcProvider, Contract } = require("starknet");

const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS" });
const marketplaceAddress = "0x059deafbbafbf7051c315cf75a94b03c5547892bc0c6dfa36d7ac7290d4cc33a";

const minimalAbi = [
    {
        "type": "interface",
        "name": "INonces",
        "items": [
            {
                "type": "function",
                "name": "nonces",
                "inputs": [{ "name": "owner", "type": "core::starknet::contract_address::ContractAddress" }],
                "outputs": [{ "type": "core::felt252" }],
                "state_mutability": "view"
            }
        ]
    }
];

async function check() {
    try {
        const user = "0x5f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2";
        const contract = new Contract(minimalAbi, marketplaceAddress, provider);

        console.log("Checking nonce for user:", user);
        const nonce = await contract.nonces(user);
        console.log("Current Nonce:", nonce.toString());
    } catch (err) {
        console.error("Error:", err.message);
    }
}

check();
