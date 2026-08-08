import Placeholder from '@/components/Placeholder';
import { satuKonten } from '@/lib/rtdb';

export const revalidate = 300;

export const metadata = {
  title: 'Mukadimah',
  description: 'Mukadimah HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/tentang/mukadimah' },
};

export default async function Halaman() {
  const k = await satuKonten('mukadimah');
  if (k?.isi) {
    return (
      <section className="badan">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <div className="eyebrow">Tentang Kami</div>
          <h1 className="judul-bagian" style={{ marginBottom: 20 }}>{k.judul}</h1>
          <div className="isi" dangerouslySetInnerHTML={{ __html: k.isi }} />
        </div>
      </section>
    );
  }
  return <Placeholder label="Tentang Kami" judul="Mukadimah" />;
}
