import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReactElement } from 'react';

import LinksSection from '@/components/sections/linksSection/LinksSection';
import TextSection from '@/components/sections/textSection/TextSection';
import ImageSection from '@/components/sections/imageSection/ImageSection';
import TwoColumnLayout from '@/components/layout/TwoColumnLayout';
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

function renderDynamicContent(
  content: Strapi.ContentTypes.Page['content'],
  aside: Strapi.ContentTypes.Page['aside']
) {
  const contentComponents: ReactElement[] = [];
  const asideComponents: ReactElement[] = [];

  // Render content sections
  if (content && content.length > 0) {
    content.forEach((component, index) => {
      let renderedComponent: ReactElement | null = null;

      switch (component.__component) {
        case 'sections.text-section':
          renderedComponent = <TextSection key={`content-${index}`} data={component} />;
          break;
        case 'sections.links-section':
          renderedComponent = <LinksSection key={`content-${index}`} data={component} />;
          break;
        case 'sections.image-section':
          renderedComponent = <ImageSection key={`content-${index}`} data={component} />;
          break;
        default:
          console.warn(
            `Unknown component type: ${(component as { __component: string }).__component}`
          );
          break;
      }

      if (renderedComponent) {
        contentComponents.push(renderedComponent);
      }
    });
  }

  // Render aside sections
  if (aside && aside.length > 0) {
    aside.forEach((component, index) => {
      let renderedComponent: ReactElement | null = null;

      switch (component.__component) {
        case 'sections.text-section':
          renderedComponent = <TextSection key={`aside-${index}`} data={component} />;
          break;
        case 'sections.links-section':
          renderedComponent = <LinksSection key={`aside-${index}`} data={component} />;
          break;
        case 'sections.image-section':
          renderedComponent = <ImageSection key={`aside-${index}`} data={component} />;
          break;
        default:
          console.warn(
            `Unknown component type: ${(component as { __component: string }).__component}`
          );
          break;
      }

      if (renderedComponent) {
        asideComponents.push(renderedComponent);
      }
    });
  }

  return { content: contentComponents, aside: asideComponents };
}

function renderPageContent(page: Strapi.ContentTypes.Page) {
  const { content, aside } = renderDynamicContent(page.content, page.aside);
  console.log({ content, aside });

  // If no content, show fallback in content column
  const contentSection = content.length > 0 ? content : (
    <>
      <h1>{page.name}</h1>
      <p>
        This is the content for: <strong>{page.name}</strong>
      </p>
      <p>
        Slug: <code>{page.slug}</code>
      </p>
    </>
  );

  return (
    <TwoColumnLayout
      content={contentSection}
      aside={aside}
    />
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
