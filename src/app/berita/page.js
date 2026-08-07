import Link from 'next/link';
import { daftarBerita } from '@/lib/rtdb';
import { BERITA_CONTOH } from '@/lib/contoh';
import { tanggalIndo } from '@/lib/dpc';

export const revalidate = 60;

export const metadata = {
  title: 'Berita',
  description: 'Kabar terbaru dari DPD dan 38 DPC HIPPI se-Jawa Timur.',
  alternates: { canonical: '/berita' },
  openGraph: {
    title: 'Berita HIPPI Jawa Timur',
    description: 'Kabar terbaru dari DPD dan 38 DPC HIPPI se-Jawa Timur.',
    url: '/berita',
  },
};

export default async function DaftarBerita() {
  const dariDb = await daftarBerita({ jumlah: 30 });
  const berita = dariDb.length ? dariDb : BERITA_CONTOH;

  return (
    <section className="badan">
      <div className="wrap">
        <div className="eyebrow">Media</div>
        <h1 className="judul-bagian">Berita</h1>
        <div className="daftar-berita">
          {berita.map((b) => (
            <article className="kartu" key={b.slug}>
              <Link href={`/berita/${b.slug}`}>
                <div className="thumb">
                  {b.gambar && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={b.gambar} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  {b.kategori && <span className="kategori">{b.kategori}</span>}
                  {!b.gambar && <span className="kode">Foto</span>}
                </div>
              </Link>
              <h3><Link href={`/berita/${b.slug}`}>{b.judul}</Link></h3>
              <p>{b.ringkas}</p>
              <div className="meta"><span>{tanggalIndo(b.tanggal)}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
