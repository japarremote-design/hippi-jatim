import IndeksDpc from '@/components/IndeksDpc';
import { semuaDpc } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Daftar DPC se-Jawa Timur',
  description: 'Dewan Pengurus Cabang HIPPI di 38 kabupaten/kota se-Jawa Timur.',
  alternates: { canonical: '/dpc' },
  openGraph: {
    title: 'Daftar DPC HIPPI se-Jawa Timur',
    description: 'Dewan Pengurus Cabang HIPPI di 38 kabupaten/kota se-Jawa Timur.',
    url: '/dpc',
  },
};

export default async function HalamanDpc() {
  const cabang = await semuaDpc();
  const status = Object.fromEntries(cabang.map((c) => [c.slug, c.status || 'siap']));
  return <IndeksDpc status={status} />;
}
