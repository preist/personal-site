import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested page could not be found.',
};

export default function NotFound() {
  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2
        style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          fontWeight: 'normal',
        }}
      >
        Page Not Found
      </h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        The page you are looking for does not exist.
      </p>
      <p>
        <Link
          href="/"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            border: '1px solid #0070f3',
            borderRadius: '4px',
            transition: 'all 0.2s',
          }}
        >
          ← Go Home
        </Link>
      </p>
    </div>
  );
}
