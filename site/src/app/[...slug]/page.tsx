import { notFound } from 'next/navigation';
import { strapiAPI, generateMetadataFromPage } from '@/lib/strapi';
import { Strapi } from '@/strapi.generated';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  // During build time, we might not have Strapi running
  // In production, consider using ISR (Incremental Static Regeneration) or CSR (Client Side Rendering)

  if (process.env.NODE_ENV === 'development') {
    try {
      const slugs = await strapiAPI.getAllPageSlugs();

      return slugs
        .filter(slug => slug !== '/') // Exclude root page (handled by /page.tsx)
        .map(slug => ({
          slug: slug.split('/').filter(Boolean), // Convert "/about/team" to ["about", "team"]
        }));
    } catch (error) {
      console.warn('Error generating static params, returning empty array:', error);
      return [];
    }
  }

  // For build time, return empty array to avoid build failures
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const { data: page } = await strapiAPI.getPageBySlug(slug);
    return generateMetadataFromPage(page);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
}

function renderPageContent(page: Strapi.ContentTypes.Page) {
  return (
    <article>
      <header>
        <h1>{page.name}</h1>
      </header>

      <main>
        <p>This is the content for: <strong>{page.name}</strong></p>
        <p>Slug: <code>{page.slug}</code></p>

        {page.seo && (
          <details style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
            <summary>SEO Debug Info</summary>
            <pre>{JSON.stringify(page.seo, null, 2)}</pre>
          </details>
        )}
      </main>
    </article>
  );
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug ? `/${resolvedParams.slug.join('/')}` : '/';

  try {
    const { data: page } = await strapiAPI.getPageBySlug(slug);

    if (!page) {
      notFound();
    }

    return renderPageContent(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}