import Link from 'next/link';
import { notFound } from 'next/navigation';
import Berbagi from '@/components/Berbagi';
import { cariDpc, DAFTAR_DPC } from '@/lib/dpc';
import { satuDpc } from '@/lib/rtdb';
import { SITUS, urlPenuh } from '@/lib/situs';

export const revalidate = 300;

export function generateStaticParams() {
  return DAFTAR_DPC.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dasar = cariDpc(slug);
  if (!dasar) return { title: 'Cabang tidak ditemukan' };

  const judul = `DPC HIPPI ${dasar.nama}`;
  const deskripsi = `Profil, susunan pengurus, dan kontak Dewan Pengurus Cabang HIPPI ${dasar.nama}, Jawa Timur.`;
  const jalur = `/dpc/${slug}`;

  return {
    title: judul,
    description: deskripsi,
    alternates: { canonical: jalur },
    openGraph: {
      type: 'profile',
      locale: 'id_ID',
      url: urlPenuh(jalur),
      siteName: SITUS.nama,
      title: judul,
      description: deskripsi,
      images: [{ url: SITUS.ogDefault, width: 1200, height: 630, alt: judul }],
    },
    twitter: { card: 'summary_large_image', title: judul, description: deskripsi, images: [SITUS.ogDefault] },
  };
}

export default async function ProfilDpc({ params }) {
  const { slug } = await params;
  const dasar = cariDpc(slug);
  if (!dasar) notFound();

  const data = (await satuDpc(slug)) || {};
  const pengurus = data.pengurus ? Object.values(data.pengurus) : [];

  return (
    <>
      <section className="dpc-hero">
        <div className="wrap">
          <div className="jenis">Dewan Pengurus Cabang · Cabang ke-{dasar.nomor}</div>
          <h1>HIPPI {dasar.nama}</h1>
          <p>Wilayah {dasar.wilayah}, Provinsi Jawa Timur</p>
        </div>
      </section>

      <div className="wrap" style={{ paddingBottom: 56 }}>
        <dl className="kartu-info">
          <div><dt>Ketua</dt><dd>{data.ketua || 'Belum diinput'}</dd></div>
          <div><dt>Sekretaris</dt><dd>{data.sekretaris || 'Belum diinput'}</dd></div>
          <div><dt>Sekretariat</dt><dd>{data.sekretariat || 'Belum diinput'}</dd></div>
          <div><dt>Kontak</dt><dd>{data.telepon || 'Belum diinput'}</dd></div>
          <div><dt>Status</dt><dd>{data.status === 'aktif' ? 'Pengurus lengkap' : 'Dalam persiapan'}</dd></div>
          <div><dt>Periode</dt><dd>{data.periode || '—'}</dd></div>
        </dl>

        {pengurus.length > 0 && (
          <>
            <div className="eyebrow">Susunan Pengurus</div>
            <table className="pengurus">
              <thead><tr><th>Jabatan</th><th>Nama</th></tr></thead>
              <tbody>
                {pengurus.map((p, i) => (
                  <tr key={i}><td>{p.jabatan}</td><td>{p.nama}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {!data.ketua && (
          <div className="hampa">
            <h2>Data cabang ini belum diisi</h2>
            <p>
              Pengurus DPC {dasar.nama} bisa mengirim profil dan susunan kepengurusan ke sekretariat DPD.
              <br />
              <Link href="/kontak">Hubungi sekretariat</Link>
            </p>
          </div>
        )}

        <Berbagi
          url={urlPenuh(`/dpc/${slug}`)}
          judul={`DPC HIPPI ${dasar.nama}`}
          ringkas={`Profil dan kontak DPC HIPPI ${dasar.nama}.`}
        />

        <Link href="/dpc" className="muat">Lihat semua 38 cabang</Link>
      </div>
    </>
  );
}
