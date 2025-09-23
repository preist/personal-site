import { BlocksRenderer } from '@strapi/blocks-react-renderer';

import { Strapi } from '@/strapi.generated';

import styles from './TextSection.module.scss';

interface TextSectionProps {
  data: Strapi.Components.Sections.TextSection;
}

export default function TextSection({ data }: TextSectionProps) {
  return (
    <section className={styles.section}>
      {data.title && (
        <h2 className={styles.title}>
          {data.title}
        </h2>
      )}
      {data.text && (
        <div className={styles.text}>
          <BlocksRenderer content={data.text} />
        </div>
      )}
    </section>
  );
}