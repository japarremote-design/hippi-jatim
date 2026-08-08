'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import UploadBerkas from '@/components/admin/UploadBerkas';

// Form generik untuk daftar berbasis tautan: Buletin, Galeri, Unduhan.
// jalur = path di Realtime Database (mis. "buletin"), labelJudul & labelUrl menyesuaikan konteks.
// terimaUnggah = true untuk menampilkan tombol unggah file (Cloudinary) selain input URL manual.
export default function FormDaftarTautan({
  jalur, labelJudul, placeholderJudul, labelUrl, placeholderUrl, jalurLihat,
  terimaUnggah = false, acceptUnggah = '*/*', gambarPratinjau = false,
}) {
  const KOSONG = { judul: '', url: '', keterangan: '' };
  const [daftar, setDaftar] = useState([]);
  const [terpilih, setTerpilih] = useState(null);
  const [form, setForm] = useState(KOSONG);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, jalur));
      const isi = cuplik.val() || {};
      setDaftar(
        Object.entries(isi)
          .map(([id, nilai]) => ({ id, ...nilai }))
          .sort((a, b) => (b.diperbarui || 0) - (a.diperbarui || 0))
      );
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, [jalur]);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));
  const pilih = (b) => { setTerpilih(b.id); setForm({ ...KOSONG, ...b }); setKabar(null); };
  const baru = () => { setTerpilih(null); setForm(KOSONG); setKabar(null); };

  const simpan = async () => {
    if (!form.judul.trim()) return setKabar({ jenis: 'buruk', teks: `${labelJudul} belum diisi.` });
    if (!form.url.trim()) return setKabar({ jenis: 'buruk', teks: `${labelUrl} belum diisi.` });
    setSibuk(true);
    setKabar(null);
    try {
      const id = terpilih || String(Date.now());
      await set(ref(db, `${jalur}/${id}`), { ...form, diperbarui: Date.now() });
      setTerpilih(id);
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

  const hapus = async () => {
    if (!terpilih) return;
    if (!window.confirm(`Hapus "${form.judul}"?`)) return;
    setSibuk(true);
    try {
      await remove(ref(db, `${jalur}/${terpilih}`));
      setKabar({ jenis: 'baik', teks: 'Dihapus.' });
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
        <button className="tbl" style={{ width: '100%', marginBottom: 12 }} onClick={baru}>+ Tambah</button>
        <div className="adm-daftar">
          {daftar.length === 0 ? (
            <button disabled style={{ color: 'var(--tinta-lembut)' }}>Belum ada data tersimpan</button>
          ) : (
            daftar.map((b) => (
              <button key={b.id} aria-current={terpilih === b.id} onClick={() => pilih(b)}>
                {b.judul}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>{labelJudul}</label>
          <input value={form.judul} onChange={ubah('judul')} placeholder={placeholderJudul} />
        </div>
        {terimaUnggah ? (
          <UploadBerkas
            label={labelUrl}
            value={form.url}
            onChange={(url) => setForm((f) => ({ ...f, url }))}
            accept={acceptUnggah}
            gambarPratinjau={gambarPratinjau}
          />
        ) : (
          <div className="medan">
            <label>{labelUrl}</label>
            <input value={form.url} onChange={ubah('url')} placeholder={placeholderUrl} />
          </div>
        )}
        <div className="medan">
          <label>Keterangan (opsional)</label>
          <input value={form.keterangan} onChange={ubah('keterangan')} />
        </div>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
          {terpilih && (
            <>
              {jalurLihat && <a className="tbl sekunder" href={jalurLihat} target="_blank" rel="noopener noreferrer">Lihat halaman</a>}
              <button className="tbl bahaya" onClick={hapus} disabled={sibuk}>Hapus</button>
            </>
          )}
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
