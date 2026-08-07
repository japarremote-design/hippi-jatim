import { SITUS } from '@/lib/situs';

export const metadata = {
  title: 'Kontak',
  description: 'Kontak sekretariat DPD HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/kontak' },
};

export default function Kontak() {
  return (
    <section className="badan">
      <div className="wrap" style={{ maxWidth: 760 }}>
        <div className="eyebrow">Layanan</div>
        <h1 className="judul-bagian" style={{ marginBottom: 20 }}>Kontak Sekretariat</h1>

        <dl className="kartu-info" style={{ margin: '0 0 28px' }}>
          <div><dt>Alamat</dt><dd>Jl. Sekretariat No. 00, Surabaya</dd></div>
          <div><dt>Email</dt><dd><a href="mailto:sekretariat@hippijatim.or.id">sekretariat@hippijatim.or.id</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href={`https://wa.me/${SITUS.wa}`}>Kirim pesan</a></dd></div>
          <div><dt>Jam layanan</dt><dd>Senin–Jumat, 09.00–16.00 WIB</dd></div>
        </dl>

        <a
          className="cta-gabung"
          href={`https://wa.me/${SITUS.wa}?text=${encodeURIComponent('Halo, saya ingin bertanya ke Sekretariat DPD HIPPI Jawa Timur.')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hubungi lewat WhatsApp
        </a>
      </div>
    </section>
  );
}
