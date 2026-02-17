
const { RpcProvider, CallData } = require("starknet");

const provider = new RpcProvider({ nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/tOTwt1ug3YNOsaPjinDvS" });
const MARKETPLACE_ADDRESS = "0x059deafbbafbf7051c315cf75a94b03c5547892bc0c6dfa36d7ac7290d4cc33a";

// Base Params (known to produce 0x227... with signer 0)
const params = {
    offerer: "0x05f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2",
    offer: {
        item_type: "0x2",
        token: "0x60bb4536c3db677637eda4e2f14c1d22d01d3dfd9e592c62ba7a36e749726cc",
        identifier_or_criteria: "0x1",
        start_amount: "0x1",
        end_amount: "0x1"
    },
    consideration: {
        item_type: "0x1",
        token: "0x033068F6539f8e6e6b131e6B2B814e6c34A5224bC66947c47DaB9dFeE93b35fb",
        identifier_or_criteria: "0x0",
        start_amount: "0xa7d8c0",
        end_amount: "0xa7d8c0",
        recipient: "0x05f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2"
    },
    start_time: "0x0",
    end_time: "0x69bb14c2",
    salt: "0x38183",
    nonce: "0x0"
};

// Raw Params Array Construction
// 16 params + 1 (signer)
function buildCalldata(p, signer) {
    return [
        p.offerer,
        p.offer.item_type,
        p.offer.token,
        p.offer.identifier_or_criteria,
        p.offer.start_amount,
        p.offer.end_amount,
        p.consideration.item_type,
        p.consideration.token,
        p.consideration.identifier_or_criteria,
        p.consideration.start_amount,
        p.consideration.end_amount,
        p.consideration.recipient,
        p.start_time,
        p.end_time,
        p.salt,
        p.nonce,
        signer
    ];
}

async function run() {
    console.log("Probing on-chain get_order_hash...");

    // 1. Baseline (Signer 0)
    const baseCalldata = buildCalldata(params, "0x0");
    const baseHash = await call(baseCalldata);
    console.log(`Baseline (Signer 0): ${baseHash}`);

    // 2. Change Signer to Offerer
    const signerHash = await call(buildCalldata(params, params.offerer));
    console.log(`With Signer=Offerer: ${signerHash}`);

    // 3. Change Salt
    const paramsSalt = { ...params, salt: "0x1" };
    const saltHash = await call(buildCalldata(paramsSalt, "0x0"));
    console.log(`Salt=1 (Signer 0):   ${saltHash}`);

    // 4. Change Nonce
    const paramsNonce = { ...params, nonce: "0x1" };
    const nonceHash = await call(buildCalldata(paramsNonce, "0x0"));
    console.log(`Nonce=1 (Signer 0):  ${nonceHash}`);
}

async function call(calldata) {
    try {
        const res = await provider.callContract({
            contractAddress: MARKETPLACE_ADDRESS,
            entrypoint: "get_order_hash",
            calldata: calldata
        });
        return res[0];
    } catch (e) {
        return "ERROR";
    }
}

run();
