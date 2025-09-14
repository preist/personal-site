import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import LinksSection from '@/components/sections/LinksSection';
import TextSection from '@/components/sections/TextSection';
import { generateMetadataFromPage, strapiAPI } from '@/lib/strapi';
import { Strapi } from '@/strapi.generated';

export async function generatePageMetadata(slug: string): Promise<Metadata> {
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

function renderDynamicContent(content: Strapi.ContentTypes.Page['content']) {
  if (!content || content.length === 0) return null;

  return content.map((component, index) => {
    switch (component.__component) {
      case 'sections.text-section':
        return <TextSection key={index} data={component} />;
      case 'sections.links-section':
        return <LinksSection key={index} data={component} />;
      default:
        console.warn(
          `Unknown component type: ${(component as { __component: string }).__component}`
        );

        return null;
    }
  });
}

function renderPageContent(page: Strapi.ContentTypes.Page) {
  return (
    <article>
      <header>
        <h1>{page.name}</h1>
      </header>

      <main>
        {page.content ? (
          renderDynamicContent(page.content)
        ) : (
          <>
            <p>
              This is the content for: <strong>{page.name}</strong>
            </p>
            <p>
              Slug: <code>{page.slug}</code>
            </p>
          </>
        )}
      </main>
    </article>
  );
}

export default async function PageRenderer({ slug }: { slug: string }) {
  try {
    const { data: page } = await strapiAPI.getPageBySlug(slug);

    if (!page) {
      if (slug === '/') {
        return (
          <div>
            <h1>This website is under construction</h1>
          </div>
        );
      }
      notFound();
    }

    return renderPageContent(page);
  } catch (error) {
    console.error('Error fetching page:', error);

    if (slug === '/') {
      return (
        <div>
          <h1>This website is under construction</h1>
        </div>
      );
    }

    notFound();
  }
}
