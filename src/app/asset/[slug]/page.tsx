import { Metadata } from "next";
import { constructMetadata } from "@/utils/seo";
import CreatorAssetPage from "@/components/creator-asset";

interface AssetPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Since we don't have SSR data fetching for the real asset content yet, 
  // we will construct a robust dynamic SEO frame using the slug.
  // In a future PR, this can be expanded with real asset title, descriptions, etc.
  const title = `Medialane IP ${slug.substring(0, 8)}... | Medialane`
  const description = `Explore the programmable IP asset ${slug} on the Medialane Integrity Web.`;
  const url = `/asset/${slug}`;

  return constructMetadata({
    title,
    description,
    url,
  });
}

export default async function page({ params }: AssetPageProps) {
  const { slug } = await params;

  // JSON-LD explicit schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `Medialane IP ${slug.substring(0, 8)}...`,
    description: `Explore the programmable IP asset ${slug} on the Medialane Integrity Web.`,
    url: `https://dapp.medialane.xyz/asset/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Medialane Protocol',
      logo: 'https://dapp.medialane.xyz/favicon.ico'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CreatorAssetPage params={params} />
    </>
  );
}
