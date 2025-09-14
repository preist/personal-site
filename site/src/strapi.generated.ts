// This file is auto-generated. Do not edit manually.
// Generated on: 2025-09-14T09:24:45.400Z

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
    export namespace Shared {
      export interface OpenGraph {
        ogTitle: string;
        ogDescription: string;
        ogImage?: StrapiMedia | null;
        ogUrl?: string;
        ogType?: string;
      }
      export interface Seo {
        metaTitle: string;
        metaDescription: string;
        metaImage?: StrapiMedia | null;
        openGraph?: Strapi.Components.Shared.OpenGraph | null;
        keywords?: string;
        metaRobots?: string;
        metaViewport?: string;
        canonicalURL?: string;
        structuredData?: unknown;
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
    }
  }
}
