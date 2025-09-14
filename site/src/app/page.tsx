import { Metadata } from 'next';
import PageRenderer, { generatePageMetadata } from '@/components/PageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('/');
}

export default async function HomePage() {
  return <PageRenderer slug="/" />;
}
