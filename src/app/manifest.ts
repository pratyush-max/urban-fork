import { MetadataRoute } from 'next';
import { seoConfig } from '@/constants/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${seoConfig.siteName} — Luxury Fine Dining`,
    short_name: seoConfig.siteName,
    description: seoConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: seoConfig.backgroundColor,
    theme_color: seoConfig.themeColor,
    orientation: 'portrait-primary',
    categories: ['food', 'lifestyle'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
