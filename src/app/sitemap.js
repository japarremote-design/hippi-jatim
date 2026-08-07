import { SITUS } from '@/lib/situs';
import { DAFTAR_DPC } from '@/lib/dpc';
import { daftarBerita } from '@/lib/rtdb';

export const revalidate = 3600;

export default async function sitemap() {
  const berita = await daftarBerita({ jumlah: 200 });
  const statis = ['', '/berita', '/dpc', '/keanggotaan', '/kontak'].map((p) => ({
    url: `${SITUS.url}${p}`,
    lastModified: new Date(),
    priority: p === '' ? 1 : 0.8,
  }));
  const cabang = DAFTAR_DPC.map((d) => ({
    url: `${SITUS.url}/dpc/${d.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));
  const artikel = berita.map((b) => ({
    url: `${SITUS.url}/berita/${b.slug}`,
    lastModified: b.tanggal ? new Date(b.tanggal) : new Date(),
    priority: 0.9,
  }));
  return [...statis, ...cabang, ...artikel];
}
