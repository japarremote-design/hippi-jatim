import { SITUS } from '@/lib/situs';

export default function manifest() {
  return {
    name: SITUS.namaPanjang,
    short_name: SITUS.nama,
    description: SITUS.deskripsi,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0D2784',
    lang: 'id',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
