import Placeholder from '@/components/Placeholder';
import { daftarPengurusDpd } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Dewan Pengurus Daerah',
  description: 'Susunan pengurus DPD HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/tentang/pengurus' },
};

export default async function Pengurus() {
  const daftar = await daftarPengurusDpd();

  if (daftar.length > 0) {
    return (
      <section className="badan">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="eyebrow">Tentang Kami</div>
          <h1 className="judul-bagian" style={{ marginBottom: 20 }}>Dewan Pengurus Daerah</h1>
          <table className="pengurus">
            <thead><tr><th>Jabatan</th><th>Nama</th></tr></thead>
            <tbody>
              {daftar.map((p, i) => (
                <tr key={i}><td>{p.jabatan}</td><td>{p.nama}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <Placeholder
      label="Tentang Kami"
      judul="Dewan Pengurus Daerah"
      teks="Susunan lengkap pengurus DPD HIPPI Provinsi Jawa Timur periode berjalan sedang disiapkan."
    />
  );
}
