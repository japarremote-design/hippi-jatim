import Link from 'next/link';
import { SITUS } from '@/lib/situs';

// Halaman yang isinya belum dikirim pengurus DPD. Dipakai untuk menu yang
// sudah tertaut tapi kontennya masih menunggu naskah resmi (sejarah, visi-misi, dll)
// supaya pengunjung mendapat halaman yang layak, bukan 404.
export default function Placeholder({ label, judul, teks, children }) {
  return (
    <section className="badan">
      <div className="wrap" style={{ maxWidth: 760 }}>
        {label && <div className="eyebrow">{label}</div>}
        <h1 className="judul-bagian" style={{ marginBottom: 16 }}>{judul}</h1>
        <p style={{ color: 'var(--tinta-lembut)', fontSize: 15.5, lineHeight: 1.7, marginBottom: 24 }}>
          {teks || 'Halaman ini sedang disiapkan oleh Sekretariat DPD HIPPI Jawa Timur dan akan segera diisi.'}
        </p>
        {children}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 24 }}>
          <a
            className="cta-gabung"
            href={`https://wa.me/${SITUS.wa}?text=${encodeURIComponent(`Halo, saya ingin menanyakan tentang "${judul}" di situs HIPPI Jawa Timur.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tanya lewat WhatsApp
          </a>
          <Link href="/" className="muat" style={{ margin: 0 }}>Kembali ke beranda</Link>
        </div>
      </div>
    </section>
  );
}
