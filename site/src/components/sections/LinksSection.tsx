import { Strapi } from '@/strapi.generated';

interface LinksSectionProps {
  data: Strapi.Components.Sections.LinksSection;
}

export default function LinksSection({ data }: LinksSectionProps) {
  return (
    <section>
      {data.title && (
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'normal',
          color: '#666',
          marginBottom: '2rem'
        }}>
          {data.title}
        </h2>
      )}
      {data.links && data.links.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.links.map((link, index) => {
            const href = link.url || (link.page ? `${link.page.slug}` : '#');
            return (
              <a
                key={index}
                href={href}
                style={{
                  fontSize: '1.125rem',
                  color: '#333',
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                target={link.url ? '_blank' : undefined}
                rel={link.url ? 'noopener' : undefined}
              >
                {link.text}
                {link.url && (
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#999',
                    transform: 'rotate(-45deg)'
                  }}>
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