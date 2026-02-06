
import { type LucideIcon } from "lucide-react"

// --- Seaport / Opensea Standard Types ---

/**
 * ItemType denotes the type of item being transferred.
 * 0: Native (ETH/STRK)
 * 1: ERC20
 * 2: ERC721
 * 3: ERC1155
 * 4: ERC721 with criteria
 * 5: ERC1155 with criteria
 */
export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3,
  ERC721_WITH_CRITERIA = 4,
  ERC1155_WITH_CRITERIA = 5
}

/**
 * OrderType denotes the type of order.
 * 0: FULL_OPEN - No partial fills, anyone can execute
 * 1: PARTIAL_OPEN - Partial fills supported
 * 2: FULL_RESTRICTED - Only specific zone/offerer can execute
 * 3: PARTIAL_RESTRICTED
 */
export enum OrderType {
  FULL_OPEN = 0,
  PARTIAL_OPEN = 1,
  FULL_RESTRICTED = 2,
  PARTIAL_RESTRICTED = 3
}

export interface OfferItem {
  itemType: ItemType;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
}

export interface ConsiderationItem extends OfferItem {
  recipient: string;
}

export interface OrderParameters {
  offerer: string;
  zone: string;
  offer: OfferItem[];
  consideration: ConsiderationItem[];
  orderType: OrderType;
  startTime: string; // unix timestamp
  endTime: string; // unix timestamp
  zoneHash: string;
  salt: string;
  conduitKey: string;
  totalOriginalConsiderationItems: number;
}

/**
 * The full order structure including signature
 */
export interface Order {
  parameters: OrderParameters;
  signature: string;
}

// --- Medialane Specific Extensions ---

export type IPUsageRights = {
  commercial_use: boolean;
  modifications_allowed: boolean;
  attribution_required: boolean;
  geographic_restrictions: string;
  usage_duration: number;
  sublicensing_allowed: boolean;
  industry_restrictions: string;
};

export type DerivativeRights = {
  allowed: boolean;
  royalty_share: number;
  requires_approval: boolean;
  max_derivatives: number;
};

// Legacy/Simple listing type for backward compatibility or simple UI views
export type Listing = {
  assetContract: string;
  tokenId: string;
  startTime: string;
  secondsUntilEndTime: string;
  quantityToList: string;
  currencyToAccept: string;
  buyoutPricePerToken: string;
  tokenTypeOfListing: string;
  endTime: string;
  // New: link to the underlying Seaport Order hash if available
  orderHash?: string;
};