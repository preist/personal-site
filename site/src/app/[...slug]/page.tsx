import { strapiAPI } from '@/lib/strapi';
import { Metadata } from 'next';
import PageRenderer, { generatePageMetadata } from '@/components/PageRenderer';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const slugs = await strapiAPI.getAllPageSlugs();

      return slugs
        .filter(slug => slug !== '/')
        .map(slug => ({
          slug: slug.split('/').filter(Boolean),
        }));
    } catch (error) {

      console.warn('Error generating static params, returning empty array:', error);
      return [];
    }
  }

  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  return generatePageMetadata(slug);
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  return <PageRenderer slug={slug} />;
}