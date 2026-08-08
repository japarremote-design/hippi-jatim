// Pembaca Firebase Realtime Database lewat REST.
// Dipakai di Server Component supaya metadata Open Graph ikut ter-render di HTML awal —
// ini syarat mutlak agar preview WhatsApp/Facebook/Telegram muncul.

import { FIREBASE } from './konfigurasi';

const DB = FIREBASE.databaseURL.replace(/\/$/, '');

async function baca(jalur, query = '', revalidate = 60) {
  if (!DB) return null;
  const url = `${DB}/${jalur}.json${query ? `?${query}` : ''}`;
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const keArray = (obj) =>
  obj ? Object.entries(obj).map(([kunci, nilai]) => ({ slug: kunci, ...nilai })) : [];

export async function daftarBerita({ jumlah = 12 } = {}) {
  const data = await baca('berita', `orderBy="tanggal"&limitToLast=${jumlah}`);
  return keArray(data)
    .filter((b) => b.terbit !== false)
    .sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)));
}

export async function satuBerita(slug) {
  const data = await baca(`berita/${encodeURIComponent(slug)}`);
  return data ? { slug, ...data } : null;
}

export async function daftarAgenda({ jumlah = 5 } = {}) {
  const data = await baca('agenda', `orderBy="mulai"&limitToLast=${jumlah}`);
  return keArray(data).sort((a, b) => String(a.mulai).localeCompare(String(b.mulai)));
}

export async function daftarProduk({ jumlah = 8 } = {}) {
  const data = await baca('produk', `limitToLast=${jumlah}`);
  return keArray(data).filter((p) => p.aktif !== false);
}

export async function satuDpc(slug) {
  const data = await baca(`dpc/${encodeURIComponent(slug)}`);
  return data ? { slug, ...data } : null;
}

export async function semuaDpc() {
  const data = await baca('dpc');
  return keArray(data);
}

export async function satuKonten(slug) {
  return baca(`konten/${encodeURIComponent(slug)}`);
}

export async function daftarPengurusDpd() {
  const data = await baca('pengurus-dpd');
  return Array.isArray(data) ? data.filter(Boolean) : keArray(data);
}

export async function daftarBuletin() {
  const data = await baca('buletin');
  return keArray(data).sort((a, b) => (b.diperbarui || 0) - (a.diperbarui || 0));
}

export async function daftarGaleri() {
  const data = await baca('galeri');
  return keArray(data).sort((a, b) => (b.diperbarui || 0) - (a.diperbarui || 0));
}

export async function daftarUnduhan() {
  const data = await baca('unduhan');
  return keArray(data).sort((a, b) => (b.diperbarui || 0) - (a.diperbarui || 0));
}
