import { Metadata } from 'next';
import PageRenderer from '@/components/PageRenderer';
import { strapiAPI, generateMetadataFromPage } from '@/lib/strapi';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: page } = await strapiAPI.getPageBySlug('/');
    return generateMetadataFromPage(page);
  } catch (error) {
    console.error('Error generating homepage metadata:', error);
    return {
      title: 'Personal Website',
      description: 'Welcome to my personal website',
    };
  }
}

export default async function HomePage() {
  return <PageRenderer slug="/" />;
}
