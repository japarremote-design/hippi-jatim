import Placeholder from '@/components/Placeholder';
import { daftarGaleri } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Galeri Foto',
  description: 'Galeri foto kegiatan HIPPI Jawa Timur.',
  alternates: { canonical: '/galeri' },
};

export default async function Galeri() {
  const daftar = await daftarGaleri();

  if (daftar.length > 0) {
    return (
      <section className="produk">
        <div className="wrap">
          <div className="eyebrow">Media</div>
          <h1 className="judul-bagian">Galeri Foto</h1>
          <div className="produk-grid">
            {daftar.map((g) => (
              <div className="p-kartu" key={g.id}>
                <div className="thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.judul} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="p-isi"><h4>{g.judul}</h4></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <Placeholder label="Media" judul="Galeri Foto" teks="Dokumentasi kegiatan DPD dan DPC akan tampil di halaman ini." />;
}
