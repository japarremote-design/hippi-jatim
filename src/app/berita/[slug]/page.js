import Link from 'next/link';
import { notFound } from 'next/navigation';
import Berbagi from '@/components/Berbagi';
import { satuBerita, daftarBerita } from '@/lib/rtdb';
import { BERITA_CONTOH } from '@/lib/contoh';
import { SITUS, urlPenuh } from '@/lib/situs';
import { tanggalIndo } from '@/lib/dpc';

export const revalidate = 60;

async function ambil(slug) {
  const dariDb = await satuBerita(slug);
  if (dariDb) return dariDb;
  return BERITA_CONTOH.find((b) => b.slug === slug) || null;
}

// Inilah yang membuat preview WhatsApp/Facebook/Telegram/X muncul per artikel.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = await ambil(slug);
  if (!b) return { title: 'Berita tidak ditemukan' };

  const gambar = b.gambar || SITUS.ogDefault;
  const jalur = `/berita/${slug}`;

  return {
    title: b.judul,
    description: b.ringkas,
    alternates: { canonical: jalur },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url: urlPenuh(jalur),
      siteName: SITUS.nama,
      title: b.judul,
      description: b.ringkas,
      publishedTime: b.tanggal,
      authors: [b.penulis || 'Redaksi HIPPI Jatim'],
      images: [{ url: gambar, width: 1200, height: 630, alt: b.judul }],
    },
    twitter: {
      card: 'summary_large_image',
      title: b.judul,
      description: b.ringkas,
      images: [gambar],
    },
  };
}

export default async function Artikel({ params }) {
  const { slug } = await params;
  const b = await ambil(slug);
  if (!b) notFound();

  const lain = (await daftarBerita({ jumlah: 4 })).filter((x) => x.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: b.judul,
    description: b.ringkas,
    image: [b.gambar || urlPenuh(SITUS.ogDefault)],
    datePublished: b.tanggal,
    author: [{ '@type': 'Organization', name: b.penulis || SITUS.nama }],
    publisher: {
      '@type': 'Organization',
      name: SITUS.namaPanjang,
      logo: { '@type': 'ImageObject', url: urlPenuh('/logo-hippi-baris.png') },
    },
    mainEntityOfPage: urlPenuh(`/berita/${slug}`),
  };

  return (
    <article className="artikel">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="remah">
        <Link href="/">Beranda</Link> · <Link href="/berita">Berita</Link>
        {b.kategori ? ` · ${b.kategori}` : ''}
      </div>

      <h1>{b.judul}</h1>
      {b.ringkas && <p className="ringkas-besar">{b.ringkas}</p>}
      <div className="meta">
        <b>{b.penulis || 'Redaksi HIPPI Jatim'}</b>
        <i className="titik" />
        <span>{tanggalIndo(b.tanggal)}</span>
      </div>

      {b.gambar && (
        <div className="sampul">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.gambar} alt={b.judul} />
        </div>
      )}

      <div className="isi" dangerouslySetInnerHTML={{ __html: b.isi || '<p>Isi berita belum tersedia.</p>' }} />

      {b.sumberUrl && (
        <div className="sumber">
          <b>Sumber berita</b>
          <a href={b.sumberUrl} target="_blank" rel="noopener noreferrer">
            {b.sumberNama || b.sumberUrl}
          </a>
        </div>
      )}

      <Berbagi url={urlPenuh(`/berita/${slug}`)} judul={b.judul} ringkas={b.ringkas} />

      {lain.length > 0 && (
        <>
          <div className="judul-sisi">Berita lainnya</div>
          <div className="populer">
            {lain.map((x) => (
              <Link href={`/berita/${x.slug}`} key={x.slug}><span>{x.judul}</span></Link>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
