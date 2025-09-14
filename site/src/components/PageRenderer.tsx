import { strapiAPI, generateMetadataFromPage } from '@/lib/strapi';
import { Strapi } from '@/strapi.generated';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TextSection from '@/components/sections/TextSection';
import LinksSection from '@/components/sections/LinksSection';

export async function generatePageMetadata(slug: string): Promise<Metadata> {
  try {
    const { data: page } = await strapiAPI.getPageBySlug(slug);
    return generateMetadataFromPage(page);
  } catch (error) {
    console.error('Error generating metadata:', error);

    return slug === '/'
      ? {
          title: 'Igor Putina',
          description: 'Welcome to my personal website',
        }
      : {
          title: 'Page Not Found',
          description: 'The requested page could not be found.',
        };
  }
}

function renderDynamicContent(content: Strapi.ContentTypes.Page['content']) {
  if (!content || content.length === 0) return null;

  return content.map((component, index) => {
    switch (component.__component) {
      case 'sections.text-section':
        return <TextSection key={index} data={component} />;
      case 'sections.links-section':
        return <LinksSection key={index} data={component} />;
      default:
        console.warn(`Unknown component type: ${(component as { __component: string }).__component}`);

        return null;
    }
  });
}

function renderPageContent(page: Strapi.ContentTypes.Page, isHomePage: boolean = false) {
  return (
    <article style={isHomePage ? { padding: '2rem', fontFamily: 'system-ui, sans-serif' } : undefined}>
      <header>
        <h1 style={isHomePage ? { marginBottom: '3rem' } : undefined}>{page.name}</h1>
      </header>

      <main style={isHomePage ? { display: 'flex', flexDirection: 'column', gap: '3rem' } : undefined}>
        {page.content ? renderDynamicContent(page.content) : (
          !isHomePage && (
            <>
              <p>This is the content for: <strong>{page.name}</strong></p>
              <p>Slug: <code>{page.slug}</code></p>
            </>
          )
        )}
      </main>
    </article>
  );
}

export default async function PageRenderer({ slug }: { slug: string }) {
  const isHomePage = slug === '/';

  try {
    const { data: page } = await strapiAPI.getPageBySlug(slug);

    if (!page) {
      if (isHomePage) {
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
      notFound();
    }

    return renderPageContent(page, isHomePage);
  } catch (error) {
    console.error('Error fetching page:', error);

    if (isHomePage) {
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

    notFound();
  }
}