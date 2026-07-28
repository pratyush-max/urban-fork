import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { seoConfig, SITE_URL } from '@/constants/seo';
import './globals.css';

// ── Font Configuration ──────────────────────────────────────
const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

// ── Viewport Configuration ──────────────────────────────────
export const viewport: Viewport = {
  themeColor: seoConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
};

// ── Metadata Configuration ──────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Core
  title: {
    template: seoConfig.titleTemplate,
    default: seoConfig.defaultTitle,
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author, url: SITE_URL }],
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,

  // Canonical
  alternates: {
    canonical: '/',
  },

  // Robots
  robots: seoConfig.robots,

  // OpenGraph
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    url: SITE_URL,
    siteName: seoConfig.siteName,
    locale: seoConfig.locale,
    type: 'website',
    images: [seoConfig.ogImage],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: [seoConfig.ogImage.url],
    creator: seoConfig.twitterHandle,
    site: seoConfig.twitterSite,
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // App info
  applicationName: seoConfig.siteName,
  category: 'restaurant',

  // Manifest
  manifest: '/manifest.webmanifest',
};

// ── JSON-LD Structured Data ─────────────────────────────────
function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(seoConfig.structuredData),
      }}
    />
  );
}

// ── Root Layout ─────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={seoConfig.language}
      className={`${cormorantGaramond.variable} ${inter.variable} min-h-screen antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="font-sans antialiased min-h-[100dvh] flex flex-col bg-[#0D0D0D] text-white">
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-[#D4AF37] focus:text-[#0D0D0D] focus:rounded-lg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0D0D0D] focus:text-sm focus:tracking-wider focus:uppercase"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
