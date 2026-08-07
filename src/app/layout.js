import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TombolWa from '@/components/TombolWa';
import { SITUS } from '@/lib/situs';

export const metadata = {
  metadataBase: new URL(SITUS.url),
  title: {
    default: `${SITUS.nama} — Dewan Pengurus Daerah Provinsi Jawa Timur`,
    template: `%s | ${SITUS.nama}`,
  },
  description: SITUS.deskripsi,
  applicationName: SITUS.nama,
  keywords: ['HIPPI', 'HIPPI Jatim', 'pengusaha pribumi', 'UMKM Jawa Timur', 'DPC HIPPI'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITUS.url,
    siteName: SITUS.nama,
    title: `${SITUS.nama} — Dewan Pengurus Daerah Provinsi Jawa Timur`,
    description: SITUS.deskripsi,
    images: [
      {
        url: SITUS.ogDefault,
        width: 1200,
        height: 630,
        alt: SITUS.namaPanjang,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITUS.nama} — Dewan Pengurus Daerah Provinsi Jawa Timur`,
    description: SITUS.deskripsi,
    images: [SITUS.ogDefault],
  },
  icons: {
    icon: [{ url: '/lambang-hippi.png', type: 'image/png' }],
    apple: [{ url: '/icon-192.png' }],
  },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0D2784',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <TombolWa />
      </body>
    </html>
  );
}
