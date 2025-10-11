import { Strapi } from '@/strapi.generated';
import StrapiImage from '@/components/StrapiImage';

import styles from './ImageSection.module.scss';

interface ImageSectionProps {
  data: Strapi.Components.Sections.ImageSection;
}

export default function ImageSection({ data }: ImageSectionProps) {
  if (!data.image) {
    console.error("ImageSection: No image provided");
    return null;
  }

  return (
    <section className={styles.section}>
      {data.title && (
        <h2 className={styles.title}>
          {data.title}
        </h2>
      )}
      <div className={styles.imageWrapper}>
        <StrapiImage
          media={data.image}
          alt={data.title || data.caption}
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