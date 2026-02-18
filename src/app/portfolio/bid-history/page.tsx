import { Metadata } from "next";
import BidHistoryClientPage from "./client-page";

export const metadata: Metadata = {
    title: "Bid History | Medialane",
    description: "View your historical buy offers and marketplace bids on Mediolano.",
};

export default function BidHistoryPage() {
    return <BidHistoryClientPage />;
}
