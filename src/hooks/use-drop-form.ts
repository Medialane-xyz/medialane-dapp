import { create } from 'zustand';

export interface DropFormState {
    // Basic Info
    name: string;
    symbol: string;
    description: string;

    // Mint Configuration
    supply: string;
    price: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    maxPerWallet: string;

    // Visuals
    coverImage: File | null;
    previewImages: File[];

    // Advanced Mint Configuration
    enableWhitelist: boolean;
    whitelistFile: File | null;

    // Reveal Configuration
    revealType: 'instant' | 'delayed';
    placeholderImage: File | null;

    // Royalties
    royaltyPercentage: string;
    payoutAddress: string;

    // Programmable IP / Licensing
    // Licensing
    licenseType: 'personal' | 'commercial' | 'exclusive' | 'custom';
    customLicense?: string;
    geographicScope: 'worldwide' | 'custom' | 'eu' | 'other';
    territory?: string;
    licenseDuration?: string;
    fieldOfUse?: string;
    grantBack?: string;
    aiRights?: string;
    licenseTerms?: string; // Kept for backwards compatibility or display

    // Actions
    setName: (name: string) => void;
    setSymbol: (symbol: string) => void;
    setDescription: (description: string) => void;
    setCoverImage: (file: File | null) => void;
    setSupply: (supply: string) => void;
    setPrice: (price: string) => void;
    setStartDate: (date: Date | undefined) => void;
    setEndDate: (date: Date | undefined) => void;
    setMaxPerWallet: (max: string) => void;
    setEnableWhitelist: (enable: boolean) => void;
    setWhitelistFile: (file: File | null) => void;
    setRevealType: (type: 'instant' | 'delayed') => void;
    setPlaceholderImage: (file: File | null) => void;
    setRoyaltyPercentage: (percentage: string) => void;
    setPayoutAddress: (address: string) => void;

    // Licensing Actions
    setLicenseType: (type: 'personal' | 'commercial' | 'exclusive' | 'custom') => void;
    setCustomLicense: (terms: string) => void;
    setGeographicScope: (scope: 'worldwide' | 'custom' | 'eu' | 'other') => void;
    setTerritory: (territory: string) => void;
    setLicenseDuration: (duration: string) => void;
    setFieldOfUse: (fieldOfUse: string) => void;
    setGrantBack: (grantBack: string) => void;
    setAiRights: (aiRights: string) => void;
    setLicenseTerms: (terms: string) => void;

    addPreviewImage: (file: File) => void;
    removePreviewImage: (index: number) => void;
    canSubmit: () => boolean;
}

export const useDropForm = create<DropFormState>((set, get) => ({
    // Basic Info
    name: '',
    symbol: '',
    description: '',

    // Mint Config (Defaults)
    price: '50',
    supply: '1000',
    maxPerWallet: '5',
    startDate: undefined,
    endDate: undefined,
    enableWhitelist: false,
    whitelistFile: null,

    // Visuals
    coverImage: null,
    previewImages: [],
    revealType: 'instant',
    placeholderImage: null,

    // Economics
    royaltyPercentage: '5',
    payoutAddress: '',

    // Licensing (Defaults)
    licenseType: 'personal',
    geographicScope: 'worldwide',
    licenseDuration: 'Perpetual',
    fieldOfUse: 'All Media',
    aiRights: 'No AI Training',

    // Actions
    setName: (name) => set({ name }),
    setSymbol: (symbol) => set({ symbol }),
    setDescription: (description) => set({ description }),
    setCoverImage: (coverImage) => set({ coverImage }),
    setSupply: (supply) => set({ supply }),
    setPrice: (price) => set({ price }),
    setStartDate: (startDate) => set({ startDate }),
    setEndDate: (endDate) => set({ endDate }),
    setMaxPerWallet: (maxPerWallet) => set({ maxPerWallet }),
    setEnableWhitelist: (enableWhitelist) => set({ enableWhitelist }),
    setWhitelistFile: (whitelistFile) => set({ whitelistFile }),
    setRevealType: (revealType) => set({ revealType }),
    setPlaceholderImage: (placeholderImage) => set({ placeholderImage }),
    setRoyaltyPercentage: (royaltyPercentage) => set({ royaltyPercentage }),
    setPayoutAddress: (payoutAddress) => set({ payoutAddress }),

    setLicenseType: (licenseType) => set({ licenseType }),
    setCustomLicense: (customLicense) => set({ customLicense }),
    setGeographicScope: (geographicScope) => set({ geographicScope }),
    setTerritory: (territory) => set({ territory }),
    setLicenseDuration: (licenseDuration) => set({ licenseDuration }),
    setFieldOfUse: (fieldOfUse) => set({ fieldOfUse }),
    setGrantBack: (grantBack) => set({ grantBack }),
    setAiRights: (aiRights) => set({ aiRights }),
    setLicenseTerms: (licenseTerms) => set({ licenseTerms }),

    addPreviewImage: (file) => set((state) => ({
        previewImages: [...state.previewImages, file]
    })),
    removePreviewImage: (index) => set((state) => ({
        previewImages: state.previewImages.filter((_, i) => i !== index)
    })),
    canSubmit: () => {
        const s = get();
        // Strict validation for required fields
        const hasBasicInfo = !!s.name && !!s.symbol && !!s.description;
        const hasMintConfig = !!s.supply && !!s.price && !!s.startDate;
        const hasVisuals = !!s.coverImage;
        const hasRevealLogic = s.revealType === 'instant' || (s.revealType === 'delayed' && !!s.placeholderImage);

        return hasBasicInfo && hasMintConfig && hasVisuals && hasRevealLogic;
    }
}));
