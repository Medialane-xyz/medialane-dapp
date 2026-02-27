import { useActivities } from "@/hooks/use-activities";

export function useUserActivities(walletAddress: string, pageSize?: number) {
    return useActivities(walletAddress, pageSize);
}
