import Link from 'next/link';
import { SITUS } from '@/lib/situs';

export const metadata = {
  title: 'Masuk Anggota',
  description: 'Portal masuk anggota HIPPI Jawa Timur.',
  alternates: { canonical: '/masuk' },
};

export default function Masuk() {
  return (
    <div className="hampa">
      <h2>Portal anggota belum tersedia</h2>
      <p>
        Layanan masuk khusus anggota sedang disiapkan. Sementara ini, pertanyaan
        seputar keanggotaan bisa disampaikan langsung ke sekretariat.
        <br />
        <a href={`https://wa.me/${SITUS.wa}`} target="_blank" rel="noopener noreferrer">
          Hubungi lewat WhatsApp
        </a>{' '}
        atau <Link href="/keanggotaan">lihat info keanggotaan</Link>.
      </p>
    </div>
  );
}
