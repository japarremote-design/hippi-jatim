'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';

const KOSONG = { nama: '', asal: '', harga: '', gambar: '' };

export default function FormProduk() {
  const [daftar, setDaftar] = useState([]);
  const [terpilih, setTerpilih] = useState(null);
  const [form, setForm] = useState(KOSONG);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'produk'));
      const isi = cuplik.val() || {};
      setDaftar(Object.entries(isi).map(([id, nilai]) => ({ id, ...nilai })));
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const pilih = (p) => { setTerpilih(p.id); setForm({ ...KOSONG, ...p }); setKabar(null); };
  const baru = () => { setTerpilih(null); setForm(KOSONG); setKabar(null); };

  const simpan = async () => {
    if (!form.nama.trim()) return setKabar({ jenis: 'buruk', teks: 'Nama produk belum diisi.' });
    setSibuk(true);
    setKabar(null);
    try {
      const id = terpilih || String(Date.now());
      await set(ref(db, `produk/${id}`), { ...form, diperbarui: Date.now() });
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
    if (!window.confirm(`Hapus produk "${form.nama}"?`)) return;
    setSibuk(true);
    try {
      await remove(ref(db, `produk/${terpilih}`));
      setKabar({ jenis: 'baik', teks: 'Produk dihapus.' });
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
        <button className="tbl" style={{ width: '100%', marginBottom: 12 }} onClick={baru}>+ Tambah produk</button>
        <div className="adm-daftar">
          {daftar.length === 0 ? (
            <button disabled style={{ color: 'var(--tinta-lembut)' }}>Belum ada produk tersimpan</button>
          ) : (
            daftar.map((p) => (
              <button key={p.id} aria-current={terpilih === p.id} onClick={() => pilih(p)}>
                {p.nama}
                <span className="kecil">{p.asal} · {p.harga}</span>
              </button>
            ))
          )}
        </div>
        <p className="bantu" style={{ marginTop: 10 }}>
          Tampil di beranda (etalase) dan halaman /produk. Kalau daftar ini kosong, situs menampilkan contoh bawaan.
        </p>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>Nama produk</label>
          <input value={form.nama} onChange={ubah('nama')} placeholder="Kopi Arabika Ijen" />
        </div>
        <div className="adm-baris">
          <div className="medan">
            <label>Asal DPC</label>
            <input value={form.asal} onChange={ubah('asal')} placeholder="DPC Bondowoso" />
          </div>
          <div className="medan">
            <label>Harga</label>
            <input value={form.harga} onChange={ubah('harga')} placeholder="Rp 85.000" />
          </div>
        </div>
        <div className="medan">
          <label>URL foto produk</label>
          <input value={form.gambar} onChange={ubah('gambar')} placeholder="https://…" />
          <div className="bantu">Kosongkan kalau belum ada foto — kartunya tetap tampil tanpa gambar.</div>
        </div>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
          {terpilih && (
            <>
              <a className="tbl sekunder" href="/produk" target="_blank" rel="noopener noreferrer">Lihat halaman</a>
              <button className="tbl bahaya" onClick={hapus} disabled={sibuk}>Hapus</button>
            </>
          )}
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
