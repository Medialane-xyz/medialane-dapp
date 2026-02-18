import { Metadata } from "next";
import ListingsClientPage from "./client-page";

export const metadata: Metadata = {
    title: "My Listings | IP Portfolio",
    description: "Manage your active IP marketplace listings on Mediolano.",
};

export default function ListingsPage() {
    return <ListingsClientPage />;
}
