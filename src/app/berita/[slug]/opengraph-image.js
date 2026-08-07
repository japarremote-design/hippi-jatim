import { ImageResponse } from 'next/og';
import { satuBerita } from '@/lib/rtdb';
import { BERITA_CONTOH } from '@/lib/contoh';
import { SITUS } from '@/lib/situs';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'HIPPI Jawa Timur';

// Kartu OG dibuat otomatis dari judul berita — dipakai kalau artikel belum punya gambar sampul.
export default async function Image({ params }) {
  const { slug } = await params;
  const b = (await satuBerita(slug)) || BERITA_CONTOH.find((x) => x.slug === slug);
  const judul = b?.judul || SITUS.nama;
  const kategori = b?.kategori || 'Berita';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0D2784',
          padding: '64px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              background: '#209ACB',
              color: '#06183F',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 3,
              padding: '8px 18px',
              textTransform: 'uppercase',
            }}
          >
            {kategori}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: judul.length > 90 ? 50 : 62,
            lineHeight: 1.15,
            color: '#FFFFFF',
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {judul.length > 150 ? `${judul.slice(0, 147)}…` : judul}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#FFFFFF', fontSize: 30, fontWeight: 800, letterSpacing: 2 }}>
              HIPPI JAWA TIMUR
            </div>
            <div style={{ color: '#8FB0E8', fontSize: 20, marginTop: 6 }}>
              Dewan Pengurus Daerah Provinsi Jawa Timur
            </div>
          </div>
          <div style={{ display: 'flex', width: 220, height: 8, background: '#209ACB' }} />
        </div>
      </div>
    ),
    size
  );
}
