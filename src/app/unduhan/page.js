import Placeholder from '@/components/Placeholder';
import { daftarUnduhan } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Unduhan',
  description: 'Formulir dan dokumen unduhan HIPPI Jawa Timur.',
  alternates: { canonical: '/unduhan' },
};

export default async function Unduhan() {
  const daftar = await daftarUnduhan();

  if (daftar.length > 0) {
    return (
      <section className="badan">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="eyebrow">Layanan</div>
          <h1 className="judul-bagian" style={{ marginBottom: 20 }}>Unduhan</h1>
          <div className="populer">
            {daftar.map((d) => (
              <a href={d.url} target="_blank" rel="noopener noreferrer" key={d.id}>
                <span>{d.judul}{d.keterangan ? ` — ${d.keterangan}` : ''}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <Placeholder
      label="Layanan"
      judul="Unduhan"
      teks="Formulir pendaftaran anggota dan dokumen organisasi akan tersedia untuk diunduh di halaman ini."
    />
  );
}
