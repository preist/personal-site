import Image from 'next/image';

import { Strapi } from '@/strapi.generated';
import { getStrapiImageUrl } from '@/lib/strapiImage';

interface StrapiImageProps {
  media: Strapi.StrapiMedia | null | undefined;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Reusable component for rendering Strapi media as Next.js Image
 * Uses unoptimized mode to serve images directly from Strapi
 *
 * @example
 * ```tsx
 * <StrapiImage
 *   media={page.seo?.metaImage}
 *   alt="Hero image"
 *   className={styles.hero}
 *   priority
 * />
 * ```
 */
export default function StrapiImage({
  media,
  alt,
  className,
  sizes,
  priority = false,
  fallback = null,
}: StrapiImageProps) {
  const imageUrl = getStrapiImageUrl(media);

  if (!imageUrl) {
    return <>{fallback}</>;
  }

  const altText = alt || media?.alternativeText || media?.caption || 'Image';
  const width = media?.width || 1200;
  const height = media?.height || 800;

  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
    />
  );
}
