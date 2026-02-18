import { Metadata } from "next";
import OffersClientPage from "./client-page";

export const metadata: Metadata = {
    title: "My Offers | Medialane IP",
    description: "Manage your active marketplace buy offers and bids.",
};

export default function OffersPage() {
    return <OffersClientPage />;
}
