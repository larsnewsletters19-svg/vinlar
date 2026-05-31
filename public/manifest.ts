import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VinLär',
    short_name: 'VinLär',
    description: 'Pedagogisk vinapp för druvsorter, aromer och blindprovning',
    start_url: '/',
    display: 'standalone',
    background_color: '#2d0a10',
    theme_color: '#2d0a10',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}