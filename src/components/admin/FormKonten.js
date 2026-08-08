'use client';

import { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';

const HALAMAN = [
  { slug: 'sejarah', label: 'Sejarah HIPPI Jawa Timur', jalur: '/tentang/sejarah' },
  { slug: 'mukadimah', label: 'Mukadimah', jalur: '/tentang/mukadimah' },
  { slug: 'visi-misi', label: 'Visi & Misi', jalur: '/tentang/visi-misi' },
  { slug: 'grand-strategy', label: 'Grand Strategy', jalur: '/tentang/grand-strategy' },
];

const KOSONG = { judul: '', isi: '' };

export default function FormKonten() {
  const [halaman, setHalaman] = useState(HALAMAN[0].slug);
  const [semua, setSemua] = useState({});
  const [form, setForm] = useState(KOSONG);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'konten'));
      setSemua(cuplik.val() || {});
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  useEffect(() => {
    const dipilih = HALAMAN.find((h) => h.slug === halaman);
    setForm({ judul: dipilih.label, ...(semua[halaman] || {}) });
    setKabar(null);
  }, [halaman, semua]);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = async () => {
    setSibuk(true);
    setKabar(null);
    try {
      await set(ref(db, `konten/${halaman}`), { ...form, diperbarui: Date.now() });
      setKabar({ jenis: 'baik', teks: 'Tersimpan.' });
      await muat();
    } catch (e) {
      setKabar({
        jenis: 'buruk',
        teks: e?.code === 'PERMISSION_DENIED' ? 'Ditolak database. Pastikan rules sudah di-Publish.' : `Gagal: ${e.message}`,
      });
    }
    setSibuk(false);
  };

  const dipilih = HALAMAN.find((h) => h.slug === halaman);
  const terisi = HALAMAN.filter((h) => semua[h.slug]?.isi).length;

  return (
    <div className="adm-kolom">
      <div>
        <p style={{ fontSize: 13, color: 'var(--tinta-lembut)', marginBottom: 12 }}>
          {terisi} dari {HALAMAN.length} halaman sudah terisi.
        </p>
        <div className="adm-daftar">
          {HALAMAN.map((h) => (
            <button key={h.slug} aria-current={halaman === h.slug} onClick={() => setHalaman(h.slug)}>
              {h.label}
              <span className="kecil">{semua[h.slug]?.isi ? 'Sudah terisi' : 'Belum diisi'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>Judul halaman</label>
          <input value={form.judul} onChange={ubah('judul')} />
        </div>
        <div className="medan">
          <label>Isi (HTML)</label>
          <textarea
            rows={16}
            value={form.isi}
            onChange={ubah('isi')}
            placeholder="<p>Paragraf pertama…</p>"
          />
          <div className="bantu">
            Pakai tag sederhana: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;&lt;li&gt;, &lt;blockquote&gt;.
          </div>
        </div>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
          <a className="tbl sekunder" href={dipilih.jalur} target="_blank" rel="noopener noreferrer">Lihat halaman</a>
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
