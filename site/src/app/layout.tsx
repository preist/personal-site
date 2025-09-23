import type { Metadata } from 'next';
import { IBM_Plex_Sans, Fira_Code } from 'next/font/google';
import './globals.scss';

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Personal Website',
    default: 'Personal Website',
  },
  description: 'Personal website powered by Strapi and Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${firaCode.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
