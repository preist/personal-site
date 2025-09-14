import { strapiAPI, generateMetadataFromPage } from '@/lib/strapi';
import { Strapi } from '@/strapi.generated';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data: page } = await strapiAPI.getPageBySlug('/');
    return generateMetadataFromPage(page);
  } catch (error) {
    console.error('Error generating metadata for home page:', error);
    return {
      title: 'Personal Website',
      description: 'Welcome to my personal website',
    };
  }
}

function renderPageContent(page: Strapi.ContentTypes.Page) {
  return (
    <article style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
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

export default async function HomePage() {
  try {
    const { data: page } = await strapiAPI.getPageBySlug('/');

    if (!page) {
      // Fallback content if no root page exists in Strapi
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
          <h1>Welcome</h1>
          <p>Please create a page with slug &quot;/&quot; in your Strapi admin panel.</p>
          <p>
            <a href="http://localhost:1337/admin" target="_blank" rel="noopener">
              Go to Strapi Admin →
            </a>
          </p>
        </div>
      );
    }

    return renderPageContent(page);
  } catch (error) {
    console.error('Error fetching home page:', error);

    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Connection Error</h1>
        <p>Unable to connect to Strapi. Please make sure the admin service is running.</p>
        <p>
          <code>make dev</code> to start the development environment.
        </p>
      </div>
    );
  }
}
