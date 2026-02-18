import { Metadata } from "next";
import OffersReceivedClientPage from "./client-page";

export const metadata: Metadata = {
    title: "Offers Received | IP Portfolio",
    description: "Manage bids and offers received for your IP assets or collections.",
};

export default function OffersReceivedPage() {
    return <OffersReceivedClientPage />;
}
