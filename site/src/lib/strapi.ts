import { Strapi } from '@/strapi.generated';

// Use internal URL for server-side requests, public URL for client-side
const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown>;
}

class StrapiAPI {
  private baseURL: string;

  constructor(baseURL: string = STRAPI_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Strapi API request failed:', error);
      throw error;
    }
  }

  async getPages(): Promise<StrapiResponse<Strapi.ContentTypes.Page[]>> {
    return this.request('/pages?populate[seo][populate]=*&sort=createdAt:desc');
  }

  async getPageBySlug(slug: string): Promise<StrapiSingleResponse<Strapi.ContentTypes.Page>> {
    // Handle root page
    const searchSlug = slug === '/' ? '/' : slug;

    const response = await this.request<StrapiResponse<Strapi.ContentTypes.Page[]>>(
      `/pages?filters[slug][$eq]=${encodeURIComponent(searchSlug)}&populate[seo][populate]=*`
    );

    return {
      data: response.data.length > 0 ? response.data[0] : null,
      meta: {},
    };
  }

  async getAllPageSlugs(): Promise<string[]> {
    try {
      const response = await this.request<StrapiResponse<Strapi.ContentTypes.Page[]>>(
        '/pages?fields[0]=slug'
      );

      return response.data.map(page => page.slug);
    } catch (error) {
      console.warn('Failed to fetch page slugs from Strapi, returning empty array for build:', error);
      return [];
    }
  }
}

export const strapiAPI = new StrapiAPI();

// Helper function to generate metadata from Strapi page
export function generateMetadataFromPage(page: Strapi.ContentTypes.Page | null) {
  if (!page || !page.seo) {
    return {
      title: page?.name || 'Page',
      description: 'Personal website',
    };
  }

  const { seo } = page;
  const metadata: Record<string, unknown> = {
    title: seo.metaTitle,
    description: seo.metaDescription,
  };

  // Add meta image if available
  if (seo.metaImage?.url) {
    metadata.openGraph = {
      images: [
        {
          url: `${STRAPI_URL}${seo.metaImage.url}`,
          width: seo.metaImage.width || 1200,
          height: seo.metaImage.height || 630,
          alt: seo.metaImage.alternativeText || seo.metaTitle,
        },
      ],
    };
  }

  // Add Open Graph data if available
  if (seo.openGraph) {
    const existingOpenGraph = metadata.openGraph as Record<string, unknown> || {};
    metadata.openGraph = {
      ...existingOpenGraph,
      title: seo.openGraph.ogTitle,
      description: seo.openGraph.ogDescription,
      url: seo.openGraph.ogUrl,
      type: (seo.openGraph.ogType || 'website').toLowerCase(),
    };

    if (seo.openGraph.ogImage?.url) {
      (metadata.openGraph as Record<string, unknown>).images = [
        {
          url: `${STRAPI_URL}${seo.openGraph.ogImage.url}`,
          width: seo.openGraph.ogImage.width || 1200,
          height: seo.openGraph.ogImage.height || 630,
          alt: seo.openGraph.ogImage.alternativeText || seo.openGraph.ogTitle,
        },
      ];
    }
  }

  // Add additional SEO fields
  if (seo.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo.canonicalURL) {
    metadata.alternates = {
      canonical: seo.canonicalURL,
    };
  }

  if (seo.metaRobots) {
    metadata.robots = seo.metaRobots;
  }

  return metadata;
}