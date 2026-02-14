import { create } from 'zustand';
import { DROP_DATA } from '@/lib/data/drop-data';

interface MintState {
    status: 'idle' | 'loading' | 'success' | 'error';
    txHash: string | null;
    error: string | null;
    totalMinted: number;
    mint: (amount: number) => Promise<void>;
    reset: () => void;
}

export const useMint = create<MintState>((set, get) => ({
    status: 'idle',
    txHash: null,
    error: null,
    totalMinted: DROP_DATA.live.totalMinted, // Initialize with data from config
    mint: async (amount: number) => {
        const { totalMinted } = get();

        // Reset error state
        set({ status: 'loading', error: null });

        // Validation
        if (amount > DROP_DATA.mint.maxPerWallet) {
            set({ status: 'error', error: `Max ${DROP_DATA.mint.maxPerWallet} per wallet` });
            return;
        }

        if (totalMinted + amount > DROP_DATA.mint.maxSupply) {
            set({ status: 'error', error: 'Exceeds max supply' });
            return;
        }

        try {
            // Mock transaction delay
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Mock success scenarios (90% success rate for demo)
            if (Math.random() > 0.1) {
                set({
                    status: 'success',
                    txHash: '0x' + Math.random().toString(16).slice(2) + '...',
                    totalMinted: totalMinted + amount
                });
            } else {
                throw new Error('Transaction rejected slightly.');
            }
        } catch (e) {
            set({ status: 'error', error: (e as Error).message });
        }
    },
    reset: () => set({ status: 'idle', txHash: null, error: null }),
}));
