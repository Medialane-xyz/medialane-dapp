import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MarketplaceOrder } from "@/hooks/use-marketplace-events";
import { Asset } from "@/types/asset";
import { RecentAsset } from "@/hooks/use-recent-assets";

export interface CartItem {
    listing: MarketplaceOrder;
    asset: Asset | RecentAsset;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    addItem: (item: CartItem) => void;
    removeItem: (orderHash: string) => void;
    clearCart: () => void;

    setIsOpen: (isOpen: boolean) => void;
    toggleCart: () => void;
}

export const useCart = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,

            addItem: (item) =>
                set((state) => {
                    // Check if already in cart
                    if (state.items.some((i) => i.listing.orderHash === item.listing.orderHash)) {
                        return state;
                    }
                    return { items: [...state.items, item] };
                }),

            removeItem: (orderHash) =>
                set((state) => ({
                    items: state.items.filter((i) => i.listing.orderHash !== orderHash),
                })),

            clearCart: () => set({ items: [] }),

            setIsOpen: (isOpen) => set({ isOpen }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: "medialane-cart-storage", // local storage key
            // Do not persist the `isOpen` state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
