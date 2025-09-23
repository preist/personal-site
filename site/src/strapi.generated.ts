// This file is auto-generated. Do not edit manually.
// Generated on: 2025-09-23T19:07:41.370Z
/* eslint-disable @typescript-eslint/no-namespace */

// Import types from @strapi/blocks-react-renderer for blocks content
import type { BlocksContent } from '@strapi/blocks-react-renderer';

export namespace Strapi {
  // Base Strapi media type
  export interface StrapiMedia {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
    formats?: unknown;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: unknown;
    createdAt: string;
    updatedAt: string;
  }

  export namespace Components {
    export namespace Elements {
      export interface Link {
        __component: 'elements.link';
        text: string;
        url?: string;
        page?: Strapi.ContentTypes.Page | null;
      }
    }

    export namespace Sections {
      export interface ImageSection {
        __component: 'sections.image-section';
        title?: string;
        image: StrapiMedia | null;
        caption?: string;
      }
      export interface LinksSection {
        __component: 'sections.links-section';
        title?: string;
        links: Strapi.Components.Elements.Link[];
      }
      export interface TextSection {
        __component: 'sections.text-section';
        title?: string;
        text?: BlocksContent;
      }
    }

    export namespace Shared {
      export interface OpenGraph {
        __component: 'shared.open-graph';
        ogTitle: string;
        ogDescription: string;
        ogImage?: StrapiMedia | null;
        ogUrl?: string;
        ogType?: string;
      }
      export interface Seo {
        __component: 'shared.seo';
        metaTitle: string;
        metaDescription: string;
        metaImage?: StrapiMedia | null;
        openGraph?: Strapi.Components.Shared.OpenGraph | null;
        keywords?: string;
        metaRobots?: string;
        metaViewport?: string;
        canonicalURL?: string;
        structuredData?: Record<string, unknown> | null;
      }
    }
  }

  export namespace ContentTypes {
    export interface Page {
      id: number;
      documentId: string;
      createdAt: string;
      updatedAt: string;
      publishedAt?: string;
      locale?: string;
      name: string;
      slug: string;
      seo?: Strapi.Components.Shared.Seo | null;
      content?: (
        | Strapi.Components.Sections.TextSection
        | Strapi.Components.Sections.LinksSection
        | Strapi.Components.Sections.ImageSection
      )[];
      aside?: (
        | Strapi.Components.Sections.TextSection
        | Strapi.Components.Sections.LinksSection
        | Strapi.Components.Sections.ImageSection
      )[];
    }
  }
}
