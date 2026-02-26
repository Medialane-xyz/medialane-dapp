import { normalizeStarknetAddress } from "@/lib/utils";

/**
 * Returns true if the listing/asset belongs to the connected wallet.
 * Handles undefined addresses gracefully (returns false).
 */
export function isOwnListing(
    offererAddress: string | undefined,
    connectedAddress: string | undefined
): boolean {
    if (!offererAddress || !connectedAddress) return false;
    return (
        normalizeStarknetAddress(offererAddress).toLowerCase() ===
        normalizeStarknetAddress(connectedAddress).toLowerCase()
    );
}
