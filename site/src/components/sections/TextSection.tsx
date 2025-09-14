import { BlocksRenderer } from '@strapi/blocks-react-renderer';

import { Strapi } from '@/strapi.generated';

interface TextSectionProps {
  data: Strapi.Components.Sections.TextSection;
}

export default function TextSection({ data }: TextSectionProps) {
  return (
    <section>
      {data.title && (
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'normal',
            color: '#666',
            marginBottom: '2rem',
          }}
        >
          {data.title}
        </h2>
      )}
      {data.text && (
        <div
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.6',
            color: '#333',
          }}
        >
          <BlocksRenderer content={data.text} />
        </div>
      )}
    </section>
  );
}
