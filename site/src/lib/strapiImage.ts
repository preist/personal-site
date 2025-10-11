import { Strapi } from '@/strapi.generated';

/**
 * Get the full URL for a Strapi media file
 * Always uses the public URL (NEXT_PUBLIC_STRAPI_URL) so images work in the browser
 * @param media - The Strapi media object
 * @param baseUrl - Optional base URL (defaults to NEXT_PUBLIC_STRAPI_URL or localhost)
 * @returns The full URL to the media file, or null if media is invalid
 */
export function getStrapiImageUrl(
  media: Strapi.StrapiMedia | null | undefined,
  baseUrl?: string
): string | null {
  if (!media?.url) {
    return null;
  }

  // If URL is already absolute, return it
  if (media.url.startsWith('http')) {
    return media.url;
  }

  // Always use public URL for images (they're accessed by the browser)
  const strapiUrl = baseUrl || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  return `${strapiUrl}${media.url}`;
}

/**
 * Get image props for Next.js Image component from Strapi media
 * @param media - The Strapi media object
 * @param alt - Optional alt text (falls back to media.alternativeText or media.caption)
 * @returns Object with src, alt, width, height ready for Next.js Image component
 */
export function getStrapiImageProps(
  media: Strapi.StrapiMedia | null | undefined,
  alt?: string | null
) {
  const src = getStrapiImageUrl(media);

  if (!src) {
    return null;
  }

  // Ensure alt is always a non-empty string for Next.js Image component
  const altText = alt || media?.alternativeText || media?.caption || 'Image';

  return {
    src,
    alt: altText,
    width: media?.width || 800,
    height: media?.height || 600,
  };
}

/**
 * Check if Strapi media is a valid image
 * @param media - The Strapi media object
 * @returns true if media exists and is an image type
 */
export function isStrapiImage(
  media: Strapi.StrapiMedia | null | undefined
): media is Strapi.StrapiMedia {
  if (!media?.mime) {
    return false;
  }

  return media.mime.startsWith('image/');
}
