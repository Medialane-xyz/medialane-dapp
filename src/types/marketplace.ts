
import { type LucideIcon } from "lucide-react"

// --- Medialane Simplified Marketplace Types (Matching On-Chain ABI) ---

/**
 * ItemType denotes the type of item being transferred.
 * 0: Native (ETH/STRK)
 * 1: ERC20
 * 2: ERC721
 * 3: ERC1155
 * ...
 */
export enum ItemType {
  NATIVE = 0,
  ERC20 = 1,
  ERC721 = 2,
  ERC1155 = 3
}

export interface OfferItem {
  item_type: ItemType;
  token: string;
  identifier_or_criteria: string;
  start_amount: string;
  end_amount: string;
}

export interface ConsiderationItem extends OfferItem {
  recipient: string;
}

export interface OrderParameters {
  offerer: string;
  offer: OfferItem;          // Single item on-chain
  consideration: ConsiderationItem; // Single item on-chain
  start_time: string;
  end_time: string;
  salt: string;
  nonce: string;
}

export type Fulfillment = {
  order_hash: string;
  fulfiller: string;
  nonce: string;
}

export type Cancelation = {
  order_hash: string;
  offerer: string;
  nonce: string;
}

export interface Order {
  parameters: OrderParameters;
  signature: string[]; // Array of felts on-chain
}

// --- Medialane UI / Integration Types ---

export type Listing = {
  orderHash?: string;
  start_amount: string;
  currency: string;
  parameters?: OrderParameters;
};