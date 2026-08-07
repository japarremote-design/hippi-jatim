import { SITUS } from '@/lib/situs';

export const metadata = {
  title: 'Keanggotaan',
  description: 'Informasi pendaftaran anggota HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/keanggotaan' },
};

export default function Keanggotaan() {
  return (
    <section className="badan">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Layanan</div>
        <h1 className="judul-bagian" style={{ marginBottom: 16 }}>Keanggotaan</h1>
        <p style={{ color: 'var(--tinta-lembut)', fontSize: 15.5, lineHeight: 1.7, marginBottom: 24 }}>
          HIPPI Jawa Timur terbuka bagi pengusaha pribumi di seluruh 38 kabupaten/kota se-Jawa Timur.
          Untuk syarat, berkas, dan biaya pendaftaran terbaru, silakan hubungi sekretariat DPD atau
          pengurus DPC di kabupaten/kota domisili Anda.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            className="cta-gabung"
            href={`https://wa.me/${SITUS.wa}?text=${encodeURIComponent('Halo, saya ingin mendaftar sebagai anggota HIPPI Jawa Timur.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Daftar lewat WhatsApp
          </a>
          <a className="muat" style={{ margin: 0 }} href="/dpc">Cari DPC domisili saya</a>
        </div>
      </div>
    </section>
  );
}
