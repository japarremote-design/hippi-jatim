import Placeholder from '@/components/Placeholder';
import { daftarBuletin } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Buletin',
  description: 'Buletin HIPPI Jawa Timur.',
  alternates: { canonical: '/buletin' },
};

export default async function Buletin() {
  const daftar = await daftarBuletin();

  if (daftar.length > 0) {
    return (
      <section className="badan">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="eyebrow">Media</div>
          <h1 className="judul-bagian" style={{ marginBottom: 20 }}>Buletin</h1>
          <div className="populer">
            {daftar.map((b) => (
              <a href={b.url} target="_blank" rel="noopener noreferrer" key={b.id}>
                <span>{b.judul}{b.keterangan ? ` — ${b.keterangan}` : ''}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <Placeholder label="Media" judul="Buletin" teks="Edisi buletin HIPPI Jawa Timur akan diunggah di halaman ini." />;
}
