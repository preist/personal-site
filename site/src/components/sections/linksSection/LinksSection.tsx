import { Strapi } from '@/strapi.generated';

import styles from './LinksSection.module.scss';

interface LinksSectionProps {
  data: Strapi.Components.Sections.LinksSection;
}

export default function LinksSection({ data }: LinksSectionProps) {
  return (
    <section className={styles.section}>
      {data.title && (
        <h2 className={styles.title}>
          {data.title}
        </h2>
      )}
      {data.links && data.links.length > 0 && (
        <div className={styles.links}>
          {data.links.map((link, index) => {
            const href = link.url || (link.page ? `${link.page.slug}` : '#');
            return (
              <a
                key={index}
                href={href}
                className={styles.link}
                target={link.url ? '_blank' : undefined}
                rel={link.url ? 'noopener' : undefined}
              >
                {link.text}
                {link.url && (
                  <span className={styles.icon}>
                    ↗
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}