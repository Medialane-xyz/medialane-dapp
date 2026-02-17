import { constants, type TypedData } from "starknet";

// --- SNIP-12 Types (Standardized) ---
// We use 'felt' for all fields to ensure maximum compatibility with wallet JSON schemas.
// The contract interprets these felts as specific types (Address, u256, etc.) during hashing.

const types = {
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
        { name: "offer", type: "OfferItem" },
        { name: "consideration", type: "ConsiderationItem" },
        { name: "start_time", type: "felt" },
        { name: "end_time", type: "felt" },
        { name: "salt", type: "felt" },
        { name: "nonce", type: "felt" },
    ],
};

// Domain constants
// NOTE: 'revision' is restored to satisfy Braavos/SNIP-12 standard.
const DOMAIN = {
    name: "Medialane",
    version: "1",
    revision: "1",
};

// Helper: Ensure value is a 0x-prefixed hex string (felt representation)
function toHex(value: any): string {
    if (value === undefined || value === null) return "0x0";
    if (typeof value === "string") {
        if (value.startsWith("0x")) return value;
        try {
            return "0x" + BigInt(value).toString(16);
        } catch {
            // Fallback for non-numeric strings (shouldn't happen for these fields)
            return value;
        }
    }
    if (typeof value === "number" || typeof value === "bigint") {
        return "0x" + BigInt(value).toString(16);
    }
    return "0x0";
}

export const getOrderTypedData = (chainId: string): TypedData => ({
    types,
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
        offerer: toHex(order.offerer),
        offer: {
            item_type: toHex(order.offer.item_type),
            token: toHex(order.offer.token),
            identifier_or_criteria: toHex(order.offer.identifier_or_criteria),
            start_amount: toHex(order.offer.start_amount),
            end_amount: toHex(order.offer.end_amount),
        },
        consideration: {
            item_type: toHex(order.consideration.item_type),
            token: toHex(order.consideration.token),
            identifier_or_criteria: toHex(order.consideration.identifier_or_criteria),
            start_amount: toHex(order.consideration.start_amount),
            end_amount: toHex(order.consideration.end_amount),
            recipient: toHex(order.consideration.recipient),
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
    ...types,
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
            fulfiller: toHex(fulfillment.fulfiller),
            nonce: toHex(fulfillment.nonce),
        }
    };
}

// Cancellation signing types
const CANCELATION_TYPES = {
    ...types,
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
            offerer: toHex(cancelation.offerer),
            nonce: toHex(cancelation.nonce),
        }
    };
}
