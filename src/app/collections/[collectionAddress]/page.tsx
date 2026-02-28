import { Metadata } from "next";
import { constructMetadata } from "@/utils/seo";
import CollectionDetails from "@/components/collection-details";

interface CollectionPageProps {
  params: Promise<{
    collectionAddress: string;
  }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collectionAddress } = await params;

  // Dynamic metadata based on address
  // This will be expanded when server-side data fetching is implemented
  const title = `IP Collection ${collectionAddress.substring(0, 8)}... | Medialane`;
  const description = `Explore the IP collection deployed at ${collectionAddress} on the Medialane Integrity Web.`;
  const url = `/collections/${collectionAddress}`;

  return constructMetadata({
    title,
    description,
    url,
  });
}

export default async function Page({ params }: CollectionPageProps) {
  const { collectionAddress } = await params;

  // JSON-LD explicit schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: `IP Collection ${collectionAddress.substring(0, 8)}...`,
    description: `Explore the IP collection deployed at ${collectionAddress} on the Medialane Integrity Web.`,
    url: `https://dapp.medialane.io/collections/${collectionAddress}`,
    publisher: {
      '@type': 'Organization',
      name: 'Medialane Protocol'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CollectionDetails collectionAddress={collectionAddress} />
    </>
  );
}
