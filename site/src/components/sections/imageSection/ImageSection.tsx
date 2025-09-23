import Image from 'next/image';

import { Strapi } from '@/strapi.generated';

import styles from './ImageSection.module.scss';

interface ImageSectionProps {
  data: Strapi.Components.Sections.ImageSection;
}

export default function ImageSection({ data }: ImageSectionProps) {
  if (!data.image?.url) {
    console.error("Did not find any image url");
    return null;
  }

  // Construct full URL for Strapi images
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const imageUrl = data.image.url.startsWith('http')
    ? data.image.url
    : `${strapiUrl}${data.image.url}`;
  const altText = data.image.alternativeText || data.title || 'Image';

  return (
    <section className={styles.section}>
      {data.title && (
        <h2 className={styles.title}>
          {data.title}
        </h2>
      )}
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={altText}
          width={data.image.width || 800}
          height={data.image.height || 600}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      {data.caption && (
        <p className={styles.caption}>
          {data.caption}
        </p>
      )}
    </section>
  );
}