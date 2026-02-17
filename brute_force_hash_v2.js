
const { hash, shortString, num, constants } = require("starknet");

const TARGET_HASH_HEX = "0x2273c7a462750c4bc8494bf25022eaae0c1121eba45279513f58ad3ed67addf";
const TARGET_HASH = BigInt(TARGET_HASH_HEX);

// Fixed Params
const params = {
    offerer: "0x05f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2",
    start_amount: "0x1",
    end_amount: "0x1",
    token: "0x60bb4536c3db677637eda4e2f14c1d22d01d3dfd9e592c62ba7a36e749726cc",
    recipient: "0x05f9f8d300601199297b7ecd92928e1444a2556aa84c8544b8b513d2a18a65a2",
    end_time: "0x69bb14c2",
    salt: "0x38183"
};

function getSelector(name) { return hash.getSelectorFromName(name); }

// Logic to convert u256 value (hex) into array of [low, high]
function toU256(hexVal) {
    const val = BigInt(hexVal);
    const low = val & ((1n << 128n) - 1n);
    const high = val >> 128n;
    return [low, high];
}

const TYPE_DEFS = [
    // 1. All FELT
    {
        label: "FELT",
        offer: "OfferItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:felt,end_amount:felt)",
        cons: "ConsiderationItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:felt,end_amount:felt,recipient:felt)",
        params: "OrderParameters(offerer:felt,offer:OfferItem,consideration:ConsiderationItem,start_time:felt,end_time:felt,salt:felt,nonce:felt)ConsiderationItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:felt,end_amount:felt,recipient:felt)OfferItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:felt,end_amount:felt)",
        isU256: false
    },
    // 2. TOKEN/RECIPIENT as ContractAddress (CA)
    {
        label: "CA",
        offer: "OfferItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:felt,end_amount:felt)",
        cons: "ConsiderationItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:felt,end_amount:felt,recipient:ContractAddress)",
        params: "OrderParameters(offerer:ContractAddress,offer:OfferItem,consideration:ConsiderationItem,start_time:felt,end_time:felt,salt:felt,nonce:felt)ConsiderationItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:felt,end_amount:felt,recipient:ContractAddress)OfferItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:felt,end_amount:felt)",
        isU256: false
    },
    // 3. U256 (Amounts only) + FELT types
    {
        label: "U256_FELT",
        offer: "OfferItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:u256,end_amount:u256)",
        cons: "ConsiderationItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:u256,end_amount:u256,recipient:felt)",
        params: "OrderParameters(offerer:felt,offer:OfferItem,consideration:ConsiderationItem,start_time:felt,end_time:felt,salt:felt,nonce:felt)ConsiderationItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:u256,end_amount:u256,recipient:felt)OfferItem(item_type:felt,token:felt,identifier_or_criteria:felt,start_amount:u256,end_amount:u256)",
        isU256: true
    },
    // 4. U256 + CA
    {
        label: "U256_CA",
        offer: "OfferItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:u256,end_amount:u256)",
        cons: "ConsiderationItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:u256,end_amount:u256,recipient:ContractAddress)",
        params: "OrderParameters(offerer:ContractAddress,offer:OfferItem,consideration:ConsiderationItem,start_time:felt,end_time:felt,salt:felt,nonce:felt)ConsiderationItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:u256,end_amount:u256,recipient:ContractAddress)OfferItem(item_type:felt,token:ContractAddress,identifier_or_criteria:felt,start_amount:u256,end_amount:u256)",
        isU256: true
    }
];

const NAMES = [
    "Medialane", "Mediolano", "Marketplace", "Starknet Marketplace",
    "StarkNet Domain", "Starknet Domain", "SNIP12", "Account",
    "Medialane Dapp", "medialane", "Medialane-xyz", "Starknet", "StarkNet",
    "medialane_market", "MedialaneMarket", "MarketplaceContract",
    ""
];

const VERSIONS = [
    { val: shortString.encodeShortString("1"), label: "'1'" },
    { val: "0x1", label: "1 (number)" },
    { val: shortString.encodeShortString("0"), label: "'0'" }
];

const REVISIONS = [
    { val: shortString.encodeShortString("1"), label: "'1'" },
    { val: "0x1", label: "1 (number)" },
    { val: null, label: "NONE" }
];

const HASHERS = [
    { fn: hash.computeHashOnElements, label: "Pedersen" },
    { fn: hash.computePoseidonHashOnElements, label: "Poseidon" }
];

const STARKNET_MESSAGE = shortString.encodeShortString("StarkNet Message");
const PREFIXES = [
    STARKNET_MESSAGE,
    shortString.encodeShortString("StarkNet Transaction"),
    BigInt(STARKNET_MESSAGE)
];

const DOMAIN_TYPES = [
    { label: "Standard", hash: getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:felt,revision:shortstring)") },
    { label: "Legacy", hash: getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:felt)") },
    { label: "NoRevision", hash: getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:felt)") }, // Duplicate but explicit
    { label: "U256ChainId", hash: getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:u256,revision:shortstring)") } // Rare
];

const CHAIN_IDS = [
    BigInt("0x534e5f5345504f4c4941"), // SN_SEPOLIA
    BigInt("0x534e5f4d41494e"),       // SN_MAIN
    0n,
    1n
];

async function run() {
    console.log(`Target: ${TARGET_HASH_HEX}`);
    let count = 0;

    for (const prefix of PREFIXES) {
        for (const hasher of HASHERS) {
            for (const typeDef of TYPE_DEFS) {
                // ... (Preparation of Message Hash components)
                // Note: need to move messageHash calc inside loop if we suspect typeDef variations? 
                // typeDef is outer loop. messageHash depends on typeDef. Correct.

                const h = hasher.fn;

                // ... (Offer/Cons/Message Hash calculation using typeDef and hasher)
                // (Paste the existing logic here but adapted for loops)
                // To save context size, I will assume the structure is preserved but I add ChainID loop.

                // RE-IMPLEMENTING HASH CALCULATION TO BE SAFE:
                const offerTypeHash = getSelector(typeDef.offer);

                let offerDataBase = [offerTypeHash, 2n, BigInt(params.token), 1n];

                // Function to run the inner loops
                const checkVariant = (messageHash, variantLabel) => {
                    for (const name of NAMES) {
                        let nameEncoded;
                        try { nameEncoded = name ? shortString.encodeShortString(name) : 0n; } catch (e) { continue; }

                        for (const ver of VERSIONS) {
                            for (const chainId of CHAIN_IDS) {
                                for (const rev of REVISIONS) {
                                    count++;
                                    let domainHash;
                                    if (rev.val !== null) {
                                        const dth = getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:felt,revision:shortstring)");
                                        domainHash = h([dth, nameEncoded, ver.val, chainId, rev.val]);
                                    } else {
                                        const dth = getSelector("StarknetDomain(name:shortstring,version:shortstring,chainId:felt)");
                                        domainHash = h([dth, nameEncoded, ver.val, chainId]);
                                    }

                                    const finalHash = h([STARKNET_MESSAGE, domainHash, 0n, messageHash]);

                                    if (finalHash === TARGET_HASH || BigInt(finalHash) === TARGET_HASH) {
                                        console.log("\n✅ MATCH FOUND!!!");
                                        console.log(`Hasher: ${hasher.label}`);
                                        console.log(`Types: ${typeDef.label}`);
                                        console.log(`Variant: ${variantLabel}`);
                                        console.log(`Name: '${name}'`);
                                        console.log(`Version: ${ver.label}`);
                                        console.log(`ChainID: 0x${chainId.toString(16)}`);
                                        console.log(`Revision: ${rev.label}`);
                                        process.exit(0);
                                    }
                                }
                            }
                        }
                    }
                };

                // Offer/Cons/Message Build Logic
                if (typeDef.isU256) {
                    const start = toU256(params.start_amount);
                    const end = toU256(params.end_amount);

                    // Option 1: Standard [low, high]
                    const offerData1 = [...offerDataBase, start[0], start[1], end[0], end[1]];
                    const offerHash1 = h(offerData1);
                    const consData1 = [getSelector(typeDef.cons), 1n, BigInt(params.token), 0n, start[0], start[1], end[0], end[1], BigInt(params.recipient)];
                    const consHash1 = h(consData1);
                    const msgHash1 = h([getSelector(typeDef.params), BigInt(params.offerer), offerHash1, consHash1, 0n, BigInt(params.end_time), BigInt(params.salt), 0n]);
                    checkVariant(msgHash1, "U256=[low,high]");

                    // Option 2: [high, low]
                    const offerData2 = [...offerDataBase, start[1], start[0], end[1], end[0]];
                    const offerHash2 = h(offerData2);
                    const consData2 = [getSelector(typeDef.cons), 1n, BigInt(params.token), 0n, start[1], start[0], end[1], end[0], BigInt(params.recipient)];
                    const consHash2 = h(consData2);
                    const msgHash2 = h([getSelector(typeDef.params), BigInt(params.offerer), offerHash2, consHash2, 0n, BigInt(params.end_time), BigInt(params.salt), 0n]);
                    checkVariant(msgHash2, "U256=[high,low]");

                    // Option 3: Struct Hash (Recursive)
                    const startHash = h([start[0], start[1]]);
                    const endHash = h([end[0], end[1]]);
                    const offerData3 = [...offerDataBase, startHash, endHash];
                    const offerHash3 = h(offerData3);
                    const consData3 = [getSelector(typeDef.cons), 1n, BigInt(params.token), 0n, startHash, endHash, BigInt(params.recipient)];
                    const consHash3 = h(consData3);
                    const msgHash3 = h([getSelector(typeDef.params), BigInt(params.offerer), offerHash3, consHash3, 0n, BigInt(params.end_time), BigInt(params.salt), 0n]);
                    checkVariant(msgHash3, "U256=Hash(low,high)");

                    const U256_STRUCT_HASH = getSelector("u256(low:felt,high:felt)");

                    // Option 4: Full Struct Hash (Standard SNIP-12 if u256 is defined as struct)
                    const startHashFull = hasher.fn([U256_STRUCT_HASH, start[0], start[1]]);
                    const endHashFull = hasher.fn([U256_STRUCT_HASH, end[0], end[1]]);
                    const offerData4 = [...offerDataBase, startHashFull, endHashFull];
                    const offerHash4 = h(offerData4);
                    const consData4 = [getSelector(typeDef.cons), 1n, BigInt(params.token), 0n, startHashFull, endHashFull, BigInt(params.recipient)];
                    const consHash4 = h(consData4);
                    const msgHash4 = h([getSelector(typeDef.params), BigInt(params.offerer), offerHash4, consHash4, 0n, BigInt(params.end_time), BigInt(params.salt), 0n]);
                    checkVariant(msgHash4, "U256=Struct(low,high)");

                } else {
                    // FELT
                    const offerData = [...offerDataBase, BigInt(params.start_amount), BigInt(params.end_amount)];
                    const offerHash = h(offerData);
                    const consData = [getSelector(typeDef.cons), 1n, BigInt(params.token), 0n, BigInt(params.start_amount), BigInt(params.end_amount), BigInt(params.recipient)];
                    const consHash = h(consData);
                    const msgHash = h([getSelector(typeDef.params), BigInt(params.offerer), offerHash, consHash, 0n, BigInt(params.end_time), BigInt(params.salt), 0n]);
                    checkVariant(msgHash, "FELT");
                }
            }
        }
        console.log(`Checked ${count} combos. No match.`);
    }
}


run();
