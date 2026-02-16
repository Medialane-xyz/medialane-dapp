import { constants, type TypedData, cairo } from "starknet";

// --- SNIP-12 Types (must match on-chain Cairo structs) ---
// On-chain contract has simplified types: all felt252, no u256, no enums
// offer/consideration are SINGLE items, not arrays

const TYPES = {
    StarknetDomain: [
        { name: "name", type: "shortstring" },
        { name: "version", type: "shortstring" },
        { name: "chainId", type: "felt" },
        { name: "revision", type: "shortstring" },
    ],
    OfferItem: [
        { name: "item_type", type: "felt" },
        { name: "token", type: "felt" },
        { name: "identifier_or_criteria", type: "felt" },
        { name: "start_amount", type: "felt" },
        { name: "end_amount", type: "felt" },
    ],
    ConsiderationItem: [
        { name: "item_type", type: "felt" },
        { name: "token", type: "felt" },
        { name: "identifier_or_criteria", type: "felt" },
        { name: "start_amount", type: "felt" },
        { name: "end_amount", type: "felt" },
        { name: "recipient", type: "felt" },
    ],
    OrderParameters: [
        { name: "offerer", type: "felt" },
        { name: "offer", type: "OfferItem" },          // Single struct, NOT array
        { name: "consideration", type: "ConsiderationItem" }, // Single struct, NOT array
        { name: "start_time", type: "felt" },
        { name: "end_time", type: "felt" },
        { name: "salt", type: "felt" },
        { name: "nonce", type: "felt" },
    ],
};

// Domain constants
const DOMAIN = {
    name: "Medialane",
    version: "1",
    chainId: constants.StarknetChainId.SN_SEPOLIA,
    revision: "1",
};

// Helper to ensure values are 0x-prefixed hex strings
function toHex(value: any): string {
    if (!value && value !== 0) return "0x0";
    if (typeof value === "string") {
        return value.startsWith("0x") ? value : "0x" + BigInt(value).toString(16);
    }
    if (typeof value === "number" || typeof value === "bigint") {
        return "0x" + BigInt(value).toString(16);
    }
    return "0x0";
}

export const getOrderTypedData = (chainId: string): TypedData => ({
    types: TYPES,
    primaryType: "OrderParameters",
    domain: {
        ...DOMAIN,
        chainId: toHex(chainId),
    },
    message: {},
});

// Prepare order parameters for SNIP-12 signing
export function prepareOrderForSigning(
    order: any,
    chainId: string
): TypedData {
    const typedData = getOrderTypedData(chainId);

    typedData.message = {
        offerer: order.offerer,
        offer: {
            item_type: toHex(order.offer.item_type),
            token: order.offer.token,
            identifier_or_criteria: toHex(order.offer.identifier_or_criteria),
            start_amount: toHex(order.offer.start_amount),
            end_amount: toHex(order.offer.end_amount),
        },
        consideration: {
            item_type: toHex(order.consideration.item_type),
            token: order.consideration.token,
            identifier_or_criteria: toHex(order.consideration.identifier_or_criteria),
            start_amount: toHex(order.consideration.start_amount),
            end_amount: toHex(order.consideration.end_amount),
            recipient: order.consideration.recipient,
        },
        start_time: toHex(order.start_time),
        end_time: toHex(order.end_time),
        salt: toHex(order.salt),
        nonce: toHex(order.nonce),
    };

    return typedData;
}

// Fulfillment signing types
const FULFILLMENT_TYPES = {
    ...TYPES,
    OrderFulfillment: [
        { name: "order_hash", type: "felt" },
        { name: "fulfiller", type: "felt" },
        { name: "nonce", type: "felt" },
    ]
};

export function prepareFulfillmentForSigning(
    fulfillment: any,
    chainId: string
): TypedData {
    return {
        types: FULFILLMENT_TYPES,
        primaryType: "OrderFulfillment",
        domain: { ...DOMAIN, chainId: toHex(chainId) },
        message: {
            order_hash: toHex(fulfillment.order_hash),
            fulfiller: fulfillment.fulfiller,
            nonce: toHex(fulfillment.nonce),
        }
    };
}

// Cancellation signing types
const CANCELATION_TYPES = {
    ...TYPES,
    OrderCancellation: [
        { name: "order_hash", type: "felt" },
        { name: "offerer", type: "felt" },
        { name: "nonce", type: "felt" },
    ]
};

export function prepareCancelationForSigning(
    cancelation: any,
    chainId: string
): TypedData {
    return {
        types: CANCELATION_TYPES,
        primaryType: "OrderCancellation",
        domain: { ...DOMAIN, chainId: toHex(chainId) },
        message: {
            order_hash: toHex(cancelation.order_hash),
            offerer: cancelation.offerer,
            nonce: toHex(cancelation.nonce),
        }
    };
}
