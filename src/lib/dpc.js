// 38 kabupaten/kota se-Jawa Timur (29 kabupaten + 9 kota).
// Dipakai sebagai daftar dasar; detail pengurus tiap cabang diambil dari Realtime Database.

export const DAFTAR_DPC = [
  ['Kabupaten Bangkalan', 'Madura'],
  ['Kabupaten Banyuwangi', 'Tapal Kuda'],
  ['Kabupaten Blitar', 'Mataraman'],
  ['Kabupaten Bojonegoro', 'Pantura'],
  ['Kabupaten Bondowoso', 'Tapal Kuda'],
  ['Kabupaten Gresik', 'Metropolitan'],
  ['Kabupaten Jember', 'Tapal Kuda'],
  ['Kabupaten Jombang', 'Mataraman'],
  ['Kabupaten Kediri', 'Mataraman'],
  ['Kabupaten Lamongan', 'Pantura'],
  ['Kabupaten Lumajang', 'Tapal Kuda'],
  ['Kabupaten Madiun', 'Mataraman'],
  ['Kabupaten Magetan', 'Mataraman'],
  ['Kabupaten Malang', 'Malang Raya'],
  ['Kabupaten Mojokerto', 'Metropolitan'],
  ['Kabupaten Nganjuk', 'Mataraman'],
  ['Kabupaten Ngawi', 'Mataraman'],
  ['Kabupaten Pacitan', 'Mataraman'],
  ['Kabupaten Pamekasan', 'Madura'],
  ['Kabupaten Pasuruan', 'Tapal Kuda'],
  ['Kabupaten Ponorogo', 'Mataraman'],
  ['Kabupaten Probolinggo', 'Tapal Kuda'],
  ['Kabupaten Sampang', 'Madura'],
  ['Kabupaten Sidoarjo', 'Metropolitan'],
  ['Kabupaten Situbondo', 'Tapal Kuda'],
  ['Kabupaten Sumenep', 'Madura'],
  ['Kabupaten Trenggalek', 'Mataraman'],
  ['Kabupaten Tuban', 'Pantura'],
  ['Kabupaten Tulungagung', 'Mataraman'],
  ['Kota Batu', 'Malang Raya'],
  ['Kota Blitar', 'Mataraman'],
  ['Kota Kediri', 'Mataraman'],
  ['Kota Madiun', 'Mataraman'],
  ['Kota Malang', 'Malang Raya'],
  ['Kota Mojokerto', 'Metropolitan'],
  ['Kota Pasuruan', 'Tapal Kuda'],
  ['Kota Probolinggo', 'Tapal Kuda'],
  ['Kota Surabaya', 'Metropolitan'],
].map(([nama, wilayah], i) => ({
  nomor: i + 1,
  nama,
  wilayah,
  jenis: nama.startsWith('Kota') ? 'kota' : 'kabupaten',
  slug: nama.toLowerCase().replace(/\s+/g, '-'),
}));

export const cariDpc = (slug) => DAFTAR_DPC.find((d) => d.slug === slug) || null;

export const JUMLAH = {
  total: DAFTAR_DPC.length,
  kabupaten: DAFTAR_DPC.filter((d) => d.jenis === 'kabupaten').length,
  kota: DAFTAR_DPC.filter((d) => d.jenis === 'kota').length,
};

export function tanggalIndo(nilai) {
  if (!nilai) return '';
  const t = new Date(nilai);
  if (Number.isNaN(t.getTime())) return String(nilai);
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${t.getDate()} ${bulan[t.getMonth()]} ${t.getFullYear()}`;
}
