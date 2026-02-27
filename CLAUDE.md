# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

No test suite is configured. TypeScript build errors are intentionally ignored (`typescript.ignoreBuildErrors: true` in `next.config.ts`).

## Architecture Overview

Medialane is a Next.js (App Router) dapp on **Starknet** with two primary features:

1. **Creator Launchpad** (`/launchpad`, `/create`) — mint and manage tokenized IP assets (IP Coins, Collection Drops, etc.)
2. **NFT Marketplace** (`/marketplace`) — list, buy, make offers, and auction IP NFTs

The app is deployed at [medialane.xyz](https://medialane.xyz) on Starknet Mainnet.

## Key Environment Variables

```
NEXT_PUBLIC_STARKNET_NETWORK          # "mainnet" or "sepolia" (defaults to mainnet)
NEXT_PUBLIC_RPC_URL                   # Alchemy/custom RPC endpoint
NEXT_PUBLIC_COLLECTION_CONTRACT_ADDRESS  # Mediolano collection registry contract
NEXT_PUBLIC_MEDIALANE_CONTRACT_ADDRESS   # Marketplace contract
NEXT_PUBLIC_GATEWAY_URL               # Pinata IPFS gateway URL
NEXT_PUBLIC_EXPLORER_URL              # Block explorer (default: voyager.online)
PINATA_JWT                            # Server-side Pinata JWT (for uploads)
NEXT_PUBLIC_COLLECTIONS_CONTRACT_START_BLOCK  # Starting block for event queries
```

## Starknet Integration Patterns

**Provider setup**: `src/components/starknet-provider.tsx` wraps the app with `StarknetConfig` (supporting Argent and Braavos wallets). Network is controlled via `NEXT_PUBLIC_STARKNET_NETWORK`.

**Contract ABIs** live in `src/abis/` (e.g., `ip_market.ts`, `ip_collection.ts`, `ip_nft.ts`). Always import via these files rather than inline JSON.

**Marketplace order flow** (in `src/hooks/use-marketplace.ts`):
- Orders use **SNIP-12 typed data signing** (`getOrderParametersTypedData`, `getOrderFulfillmentTypedData` from `src/utils/marketplace-utils.ts`)
- Listings: sign → ERC721 `approve` + `register_order` multicall
- Offers: sign → ERC20 `approve` + `register_order` multicall
- Cart checkout: approve per-currency totals + sequential `fulfill_order` signatures, then one atomic multicall
- Cancellations: sign typed cancellation data → `cancel_order`

**Event/provenance queries** (`src/hooks/use-events.ts`): queries the registry contract for `TokenMinted`/`TokenTransferred` events plus the asset contract's standard ERC721 `Transfer` events, deduplicating across sources. Block timestamps are fetched in parallel.

**Constants** (`src/lib/constants.ts`): contract addresses, supported tokens (USDC, USDT, ETH, STRK with decimals), and start blocks.

## Data Flow

1. **IPFS/Pinata**: Asset metadata and images are uploaded via server actions (`src/app/api/pinata/`, `src/app/api/forms-ipfs/`). Server-side Pinata SDK is configured in `src/services/config/server.config.ts`.
2. **On-chain reads**: Hooks in `src/hooks/` call Starknet contracts directly using `useContract`/`useProvider` from `@starknet-react/core`.
3. **Zustand stores**: Used for cart state and mint state (`src/hooks/use-mint.ts`).
4. **User profiles**: Stored/fetched via `src/services/user_settings.ts` (off-chain).

## Directory Structure

- `src/app/` — App Router pages/layouts. Key routes: `/marketplace`, `/launchpad`, `/create`, `/asset`, `/collections`, `/creator`, `/portfolio`, `/provenance`, `/licensing`
- `src/components/` — All UI components. `src/components/ui/` contains shadcn/ui base components
- `src/hooks/` — React hooks for contract interaction, data fetching, and state
  - `src/hooks/contracts/` — Low-level contract hooks
- `src/lib/` — Shared utilities, types, and constants
  - `src/lib/types.ts` — Core types: `NFT`, `Collection`, `Asset`, `DisplayAsset`, `UserProfile`, `IPType`
  - `src/lib/constants.ts` — Contract addresses, supported tokens, block numbers
- `src/abis/` — Starknet contract ABI files
- `src/services/` — Service layer: Pinata config, licensing service
- `src/utils/` — Helper functions (SEO, marketplace utils, IPFS, starknet address utils)
- `src/actions/` — Next.js Server Actions

## Conventions

- Filenames: `kebab-case`; components: `PascalCase`
- Absolute imports with `@/` prefix throughout
- Tailwind CSS for all styling; avoid custom CSS
- Starknet addresses should be normalized using `normalizeStarknetAddress` from `src/lib/utils.ts`
- Token IDs are represented as `bigint` in contract calls and decoded as `u256` (low + high << 128)
- All contract calls that modify state go through the connected `account.execute()` — never call contracts directly in server code
