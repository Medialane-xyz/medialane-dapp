import { constants, type TypedData, hash, CallData, shortString } from "starknet";
import { ItemType, OrderType } from "@/types/marketplace";

// --- Types needed for Hashing ---

// Must match the Cairo struct names for SNIP-12
const TYPES = {
    StarkNetDomain: [
        { name: "name", type: "shortstring" },
        { name: "version", type: "shortstring" },
        { name: "chainId", type: "shortstring" },
        { name: "revision", type: "shortstring" },
    ],
    OfferItem: [
        { name: "item_type", type: "u128" }, // Enum as u128
        { name: "token", type: "ContractAddress" },
        { name: "identifier_or_criteria", type: "u256" },
        { name: "start_amount", type: "u256" },
        { name: "end_amount", type: "u256" },
    ],
    ConsiderationItem: [
        { name: "item_type", type: "u128" },
        { name: "token", type: "ContractAddress" },
        { name: "identifier_or_criteria", type: "u256" },
        { name: "start_amount", type: "u256" },
        { name: "end_amount", type: "u256" },
        { name: "recipient", type: "ContractAddress" },
    ],
    OrderParameters: [
        { name: "offerer", type: "ContractAddress" },
        { name: "zone", type: "ContractAddress" },
        { name: "offer", type: "OfferItem*" }, // Array
        { name: "consideration", type: "ConsiderationItem*" }, // Array
        { name: "order_type", type: "u128" },
        { name: "start_time", type: "u64" },
        { name: "end_time", type: "u64" },
        { name: "zone_hash", type: "felt" },
        { name: "salt", type: "felt" },
        { name: "conduit_key", type: "felt" },
        { name: "total_original_consideration_items", type: "u32" },
        { name: "nonce", type: "felt" }, // Should match valid order params if included in hash
    ],
    // The top-level struct we sign is NOT Order (which includes signature), but the parameters + offerer
    // Wait, looking at Cairo: 
    // order_hash = order_parameters.get_message_hash(offerer);
    // Implementation likely: hash(OrderParameters)
    // Let's check `get_message_hash` implementation in Cairo... 
    // It usually takes the data struct.

    // Actually, for SNIP-12, we define the Type we are signing.
    // The contract says: `get_message_hash` on `OrderParameters`.
    // So we sign `OrderParameters`.
};

// Domain constants
const DOMAIN = {
    name: "Medialane",
    version: "1",
    chainId: constants.StarknetChainId.SN_SEPOLIA, // Matches deployment on Sepolia testnet
    revision: "1",
};

export const getOrderTypedData = (chainId: string): TypedData => ({
    types: TYPES,
    primaryType: "OrderParameters",
    domain: {
        ...DOMAIN,
        chainId: chainId,
    },
    message: {}, // Will be populated
});

// Helper to format item type enum
export function toCairoEnum(value: number): any {
    // In Cairo, enums are often represented by index or custom serialization
    // But SNIP-12 hashes struct members.
    // If ItemType is enum: Native, ERC20...
    // In hashing, it might be the index.
    return value;
}

// Function to prepare order parameters for signing
export function prepareOrderForSigning(
    order: any,
    chainId: string
): TypedData {
    const typedData = getOrderTypedData(chainId);
    typedData.message = {
        offerer: order.offerer,
        zone: order.zone,
        offer: order.offer,
        consideration: order.consideration,
        order_type: order.orderType,
        start_time: order.startTime,
        end_time: order.endTime,
        zone_hash: order.zoneHash,
        salt: order.salt,
        conduit_key: order.conduitKey,
        total_original_consideration_items: order.totalOriginalConsiderationItems,
        nonce: order.nonce,
    };
    return typedData;
}

// Structs for Fulfillment and Cancelation
const FULFILLMENT_TYPES = {
    ...TYPES,
    Fulfillment: [
        { name: "fulfiller", type: "ContractAddress" },
        { name: "order_hash", type: "felt" },
        { name: "nonce", type: "felt" },
    ]
};

export function prepareFulfillmentForSigning(
    fulfillment: any,
    chainId: string
): TypedData {
    return {
        types: FULFILLMENT_TYPES,
        primaryType: "Fulfillment",
        domain: { ...DOMAIN, chainId },
        message: fulfillment
    };
}

const CANCELATION_TYPES = {
    ...TYPES,
    Cancelation: [
        { name: "offerer", type: "ContractAddress" },
        { name: "order_hash", type: "felt" },
        { name: "nonce", type: "felt" },
    ]
};

export function prepareCancelationForSigning(
    cancelation: any,
    chainId: string
): TypedData {
    return {
        types: CANCELATION_TYPES,
        primaryType: "Cancelation",
        domain: { ...DOMAIN, chainId },
        message: cancelation
    };
}
