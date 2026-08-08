'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { tanggalIndo } from '@/lib/dpc';
import UploadBerkas from '@/components/admin/UploadBerkas';

const KOSONG = {
  judul: '',
  slug: '',
  ringkas: '',
  isi: '',
  gambar: '',
  kategori: '',
  penulis: 'Redaksi HIPPI Jatim',
  tanggal: new Date().toISOString().slice(0, 10),
  terbit: true,
  sumberNama: '',
  sumberUrl: '',
};

const buatSlug = (teks) =>
  teks
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);

export default function FormBerita() {
  const [daftar, setDaftar] = useState([]);
  const [terpilih, setTerpilih] = useState(null); // null = sedang menulis baru
  const [form, setForm] = useState(KOSONG);
  const [slugKunci, setSlugKunci] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'berita'));
      const isi = cuplik.val() || {};
      setDaftar(
        Object.entries(isi)
          .map(([slug, nilai]) => ({ slug, ...nilai }))
          .sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)))
      );
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat daftar: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  const ubah = (kunci) => (e) => {
    const nilai = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const baru = { ...f, [kunci]: nilai };
      if (kunci === 'judul' && !slugKunci && !terpilih) baru.slug = buatSlug(nilai);
      return baru;
    });
  };

  const pilih = (b) => {
    setTerpilih(b.slug);
    setForm({ ...KOSONG, ...b });
    setSlugKunci(true);
    setKabar(null);
  };

  const baru = () => {
    setTerpilih(null);
    setForm(KOSONG);
    setSlugKunci(false);
    setKabar(null);
  };

  const simpan = async () => {
    if (!form.judul.trim()) return setKabar({ jenis: 'buruk', teks: 'Judul belum diisi.' });
    if (!form.slug.trim()) return setKabar({ jenis: 'buruk', teks: 'Slug belum diisi.' });
    if (!form.ringkas.trim())
      return setKabar({ jenis: 'buruk', teks: 'Ringkasan belum diisi — ini yang muncul sebagai deskripsi saat dishare.' });

    setSibuk(true);
    setKabar(null);
    try {
      const slug = buatSlug(form.slug);
      const { slug: _buang, ...isi } = form;
      await set(ref(db, `berita/${slug}`), { ...isi, slug, diperbarui: Date.now() });
      setTerpilih(slug);
      setSlugKunci(true);
      setKabar({ jenis: 'baik', teks: `Tersimpan. Alamatnya /berita/${slug}` });
      await muat();
    } catch (e) {
      setKabar({
        jenis: 'buruk',
        teks:
          e?.code === 'PERMISSION_DENIED'
            ? 'Ditolak database. Pastikan database.rules.json sudah di-Publish di Firebase Console.'
            : `Gagal menyimpan: ${e.message}`,
      });
    }
    setSibuk(false);
  };

  const hapus = async () => {
    if (!terpilih) return;
    if (!window.confirm(`Hapus berita "${form.judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setSibuk(true);
    try {
      await remove(ref(db, `berita/${terpilih}`));
      setKabar({ jenis: 'baik', teks: 'Berita dihapus.' });
      baru();
      await muat();
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal menghapus: ${e.message}` });
    }
    setSibuk(false);
  };

  return (
    <div className="adm-kolom">
      <div>
        <button className="tbl" style={{ width: '100%', marginBottom: 12 }} onClick={baru}>
          + Tulis berita baru
        </button>
        <div className="adm-daftar">
          {daftar.length === 0 ? (
            <button disabled style={{ color: 'var(--tinta-lembut)' }}>Belum ada berita tersimpan</button>
          ) : (
            daftar.map((b) => (
              <button key={b.slug} aria-current={terpilih === b.slug} onClick={() => pilih(b)}>
                {b.judul}
                <span className="kecil">
                  {tanggalIndo(b.tanggal)} · {b.terbit === false ? 'Draf' : 'Terbit'}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>Judul</label>
          <input value={form.judul} onChange={ubah('judul')} placeholder="Judul berita" />
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Slug (alamat halaman)</label>
            <input
              value={form.slug}
              onChange={(e) => { setSlugKunci(true); ubah('slug')(e); }}
              placeholder="musda-viii-hippi-jawa-timur"
            />
            <div className="bantu">Jadi /berita/{form.slug || '…'}. Jangan diubah setelah berita dishare.</div>
          </div>
          <div className="medan">
            <label>Tanggal</label>
            <input type="date" value={form.tanggal} onChange={ubah('tanggal')} />
          </div>
        </div>

        <div className="medan">
          <label>Ringkasan</label>
          <textarea
            rows={3}
            value={form.ringkas}
            onChange={ubah('ringkas')}
            placeholder="Satu sampai dua kalimat."
          />
          <div className="bantu">
            Ini yang muncul jadi deskripsi preview saat link dishare ke WhatsApp, Facebook, atau Telegram.
            Idealnya di bawah 160 karakter — sekarang {form.ringkas.length}.
          </div>
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Kategori / asal DPC</label>
            <input value={form.kategori} onChange={ubah('kategori')} placeholder="Gresik" />
          </div>
          <div className="medan">
            <label>Penulis</label>
            <input value={form.penulis} onChange={ubah('penulis')} />
          </div>
        </div>

        <UploadBerkas
          label="Gambar sampul"
          value={form.gambar}
          onChange={(url) => setForm((f) => ({ ...f, gambar: url }))}
          accept="image/*"
        />
        <p className="bantu" style={{ marginTop: -8 }}>
          Kosongkan kalau belum ada — sistem otomatis membuat kartu preview biru dari judulnya.
          Ukuran ideal 1200 × 630 piksel.
        </p>

        <div className="medan">
          <label>Isi berita (HTML)</label>
          <textarea
            rows={14}
            value={form.isi}
            onChange={ubah('isi')}
            placeholder="<p>Paragraf pertama…</p>"
          />
          <div className="bantu">
            Pakai tag sederhana: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;&lt;li&gt;, &lt;blockquote&gt;,
            &lt;a href=&quot;…&quot;&gt;, &lt;img src=&quot;…&quot;&gt;.
          </div>
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Nama sumber (bila kutip portal lain)</label>
            <input value={form.sumberNama} onChange={ubah('sumberNama')} placeholder="Nama portal" />
          </div>
          <div className="medan">
            <label>Tautan sumber</label>
            <input value={form.sumberUrl} onChange={ubah('sumberUrl')} placeholder="https://…" />
          </div>
        </div>

        <label className="centang">
          <input type="checkbox" checked={form.terbit !== false} onChange={ubah('terbit')} />
          Tampilkan di situs
        </label>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>
            {sibuk ? 'Menyimpan…' : terpilih ? 'Simpan perubahan' : 'Terbitkan'}
          </button>
          {terpilih && (
            <>
              <a
                className="tbl sekunder"
                href={`/berita/${terpilih}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat halaman
              </a>
              <button className="tbl bahaya" onClick={hapus} disabled={sibuk}>Hapus</button>
            </>
          )}
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
