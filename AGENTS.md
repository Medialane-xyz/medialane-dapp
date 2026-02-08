# Medialane Dapp Agent Instructions

This file is designed to help AI agents understand and navigate the Medialane Dapp codebase efficiently.

## Project Overview

Medialane is the monetization hub financial infrastructure for the Creators Capital Markets, built on the Starknet blockchain. It includes a Creator Launchpad and an NFT Marketplace.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Radix UI
- **Language**: TypeScript
- **Blockchain**: Starknet (via `@starknet-react/core`)
- **State Management**: Zustand
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React

## Directory Structure

- `src/app`: Application routes and layouts using Next.js App Router.
- `src/components`: Reusable UI components.
    - `ui`: Base UI components (buttons, inputs, etc.), often shadcn/ui inspired.
- `src/lib`: Utility functions and libraries.
- `src/hooks`: Custom React hooks.
- `src/services`: API services and data fetching logic.
- `src/types`: TypeScript type definitions.
- `src/utils`: Helper functions.
- `src/actions`: Server actions.
- `src/abis`: ABI files for interacting with Starknet contracts.

## Key Files

- `package.json`: Project dependencies and scripts.
- `README.md`: General project documentation for developers.
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.

## Development Commands

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run lint`: Run linting checks.

## Conventions

- **File Naming**: Use `kebab-case` for file and directory names (e.g., `my-component.tsx`, `utils/helper-function.ts`).
- **Component Naming**: Use `PascalCase` for component names (e.g., `MyComponent`).
- **Imports**: Use absolute imports (e.g., `import { Button } from '@/components/ui/button'`).
- **Styling**: Use utility classes with Tailwind CSS. Avoid custom CSS files unless necessary.

## Documentation

- Check `README.md` for more detailed setup instructions.
- Refer to `package.json` for specific dependency versions.
