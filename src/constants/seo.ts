// ─────────────────────────────────────────────────────────────
// SEO Configuration — Single source of truth for all metadata,
// OpenGraph, Twitter Cards, structured data, and canonical URLs.
// Update ONLY this file when production domain or branding changes.
// ─────────────────────────────────────────────────────────────

/** Production domain — change this single value when going live */
export const SITE_URL = 'https://theurbanfork.com';

export const seoConfig = {
  // ── Core Metadata ─────────────────────────────────────────
  siteName: 'Urban Fork',
  titleTemplate: '%s | Urban Fork',
  defaultTitle: 'Urban Fork | Where Every Bite Becomes A Memory',
  description:
    'Experience luxury fine dining at Urban Fork — Manhattan\'s premier destination for exquisite cuisine, impeccable service, and unforgettable moments. Reserve your table today.',
  keywords: [
    'Urban Fork',
    'fine dining Manhattan',
    'luxury restaurant NYC',
    'Manhattan fine dining',
    'gourmet cuisine New York',
    'upscale dining experience',
    'Michelin-quality restaurant',
    'tasting menu Manhattan',
    'best restaurants NYC',
    'fine dining reservations',
    'private dining Manhattan',
    'chef\'s table experience',
  ],

  // ── Author & Publisher ────────────────────────────────────
  author: 'Urban Fork Restaurant Group',
  creator: 'Urban Fork',
  publisher: 'Urban Fork Restaurant Group',

  // ── Colors ────────────────────────────────────────────────
  themeColor: '#0D0D0D',
  backgroundColor: '#0D0D0D',
  accentColor: '#D4AF37',

  // ── Locale ────────────────────────────────────────────────
  locale: 'en_US',
  language: 'en',

  // ── Social Handles ────────────────────────────────────────
  twitterHandle: '@urbanfork',
  twitterSite: '@urbanfork',

  // ── OpenGraph Image (placeholder path — replace with branded asset) ──
  ogImage: {
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: 'Urban Fork — Luxury Fine Dining in Manhattan',
    type: 'image/png',
  },

  // ── Robots ────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },

  // ── Structured Data (Restaurant Schema.org) ───────────────
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Urban Fork',
    alternateName: 'Urban Fork NYC',
    description:
      'Manhattan\'s premier luxury fine dining destination offering an exquisite fusion of contemporary American cuisine with global influences, impeccable sommelier-curated wine pairings, and an unforgettable cinematic dining atmosphere.',
    url: SITE_URL,
    telephone: '+1-212-555-0187',
    email: 'concierge@urbanfork.com',
    servesCuisine: [
      'Contemporary American',
      'Fine Dining',
      'Farm-to-Table',
      'Fusion',
    ],
    priceRange: '$$$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/images/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Culinary Avenue',
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: '10013',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7484,
      longitude: -73.9857,
    },
    hasMap: 'https://maps.google.com/?q=123+Culinary+Avenue+Manhattan+NY',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '12:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '12:00',
        closes: '23:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '12:00',
        closes: '21:30',
      },
    ],
    acceptsReservations: 'True',
    reservations: `${SITE_URL}/#reservations`,
    menu: `${SITE_URL}/#menu`,
    sameAs: [
      'https://instagram.com/urbanfork',
      'https://facebook.com/urbanfork',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '342',
      bestRating: '5',
      worstRating: '1',
    },
  },
};
