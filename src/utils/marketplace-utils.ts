import { type TypedData, TypedDataRevision, constants } from "starknet";

export const getOrderParametersTypedData = (
    message: any,
    chainId: constants.StarknetChainId
): TypedData => {
    return {
        domain: {
            name: "Medialane",
            version: "1",
            chainId: chainId,
            revision: TypedDataRevision.ACTIVE,
        },
        primaryType: "OrderParameters",
        types: {
            StarknetDomain: [
                { name: "name", type: "shortstring" },
                { name: "version", type: "shortstring" },
                { name: "chainId", type: "shortstring" },
                { name: "revision", type: "shortstring" },
            ],
            OrderParameters: [
                { name: "offerer", type: "ContractAddress" },
                { name: "offer", type: "OfferItem" },
                { name: "consideration", type: "ConsiderationItem" },
                { name: "start_time", type: "felt" },
                { name: "end_time", type: "felt" },
                { name: "salt", type: "felt" },
                { name: "nonce", type: "felt" },
            ],
            OfferItem: [
                { name: "item_type", type: "shortstring" },
                { name: "token", type: "ContractAddress" },
                { name: "identifier_or_criteria", type: "felt" },
                { name: "start_amount", type: "felt" },
                { name: "end_amount", type: "felt" },
            ],
            ConsiderationItem: [
                { name: "item_type", type: "shortstring" },
                { name: "token", type: "ContractAddress" },
                { name: "identifier_or_criteria", type: "felt" },
                { name: "start_amount", type: "felt" },
                { name: "end_amount", type: "felt" },
                { name: "recipient", type: "ContractAddress" },
            ],
        },
        message,
    };
};

export const getOrderCancellationTypedData = (
    message: any,
    chainId: constants.StarknetChainId
): TypedData => {
    return {
        domain: {
            name: "Medialane",
            version: "1",
            chainId: chainId,
            revision: TypedDataRevision.ACTIVE,
        },
        primaryType: "OrderCancellation",
        types: {
            StarknetDomain: [
                { name: "name", type: "shortstring" },
                { name: "version", type: "shortstring" },
                { name: "chainId", type: "shortstring" },
                { name: "revision", type: "shortstring" },
            ],
            OrderCancellation: [
                { name: "order_hash", type: "felt" },
                { name: "offerer", type: "ContractAddress" },
                { name: "nonce", type: "felt" },
            ],
        },
        message,
    };
};

export const stringifyBigInts = (obj: any): any => {
    if (typeof obj === "bigint") {
        return obj.toString();
    }
    if (Array.isArray(obj)) {
        return obj.map(stringifyBigInts);
    }
    if (obj !== null && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, stringifyBigInts(value)])
        );
    }
    return obj;
};
