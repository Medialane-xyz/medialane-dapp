import { create } from 'zustand';

export interface DropFormState {
    // Basic Info
    name: string;
    symbol: string;
    description: string;

    // Mint Config
    price: string;
    supply: string;
    maxPerWallet: string;
    startDate: Date | undefined;
    endDate: Date | undefined;

    // Visuals
    coverImage: File | null;
    previewImages: File[];

    // Utility
    roadmap: { title: string; date: string; description: string }[];
}

interface DropFormActions {
    setField: (field: keyof DropFormState, value: any) => void;
    setCoverImage: (file: File | null) => void;
    addPreviewImage: (file: File) => void;
    removePreviewImage: (index: number) => void;
    reset: () => void;
    canSubmit: () => boolean;
}

const initialState: DropFormState = {
    name: '',
    symbol: '',
    description: '',
    price: '',
    supply: '',
    maxPerWallet: '',
    startDate: undefined,
    endDate: undefined,
    coverImage: null,
    previewImages: [],
    roadmap: [],
};

export const useDropForm = create<DropFormState & DropFormActions>((set, get) => ({
    ...initialState,

    setField: (field, value) => set((state) => ({ ...state, [field]: value })),

    setCoverImage: (file) => set({ coverImage: file }),

    addPreviewImage: (file) => set((state) => ({
        previewImages: [...state.previewImages, file]
    })),

    removePreviewImage: (index) => set((state) => ({
        previewImages: state.previewImages.filter((_, i) => i !== index)
    })),

    reset: () => set(initialState),

    canSubmit: () => {
        const s = get();
        return (
            !!s.name &&
            !!s.symbol &&
            !!s.description &&
            !!s.price &&
            !!s.supply &&
            !!s.maxPerWallet &&
            !!s.startDate &&
            !!s.coverImage
        );
    }
}));
