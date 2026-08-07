import { daftarProduk } from '@/lib/rtdb';
import { PRODUK_CONTOH } from '@/lib/contoh';

export const revalidate = 60;

export const metadata = {
  title: 'Produk Pribumi Asli',
  description: 'Etalase produk anggota HIPPI se-Jawa Timur.',
  alternates: { canonical: '/produk' },
};

export default async function Produk() {
  const dariDb = await daftarProduk({ jumlah: 40 });
  const produk = dariDb.length ? dariDb : PRODUK_CONTOH;

  return (
    <section className="produk">
      <div className="wrap">
        <div className="eyebrow">Produk Pribumi Asli</div>
        <h1 className="judul-bagian">Etalase produk anggota</h1>
        <div className="produk-grid">
          {produk.map((p) => (
            <div className="p-kartu" key={p.id || p.nama}>
              <div className="thumb">
                {p.gambar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.gambar} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="kode">Foto produk</span>
                )}
              </div>
              <div className="p-isi">
                <h4>{p.nama}</h4>
                <p className="asal">{p.asal}</p>
                <p className="harga">{p.harga}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
