'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';

const KOSONG = { nama: '', tempat: '', mulai: new Date().toISOString().slice(0, 10) };

export default function FormAgenda() {
  const [daftar, setDaftar] = useState([]);
  const [terpilih, setTerpilih] = useState(null);
  const [form, setForm] = useState(KOSONG);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'agenda'));
      const isi = cuplik.val() || {};
      setDaftar(
        Object.entries(isi)
          .map(([id, nilai]) => ({ id, ...nilai }))
          .sort((a, b) => String(a.mulai).localeCompare(String(b.mulai)))
      );
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const pilih = (a) => { setTerpilih(a.id); setForm({ ...KOSONG, ...a }); setKabar(null); };
  const baru = () => { setTerpilih(null); setForm(KOSONG); setKabar(null); };

  const simpan = async () => {
    if (!form.nama.trim()) return setKabar({ jenis: 'buruk', teks: 'Nama agenda belum diisi.' });
    if (!form.mulai) return setKabar({ jenis: 'buruk', teks: 'Tanggal belum diisi.' });
    setSibuk(true);
    setKabar(null);
    try {
      const id = terpilih || String(Date.now());
      await set(ref(db, `agenda/${id}`), { ...form, diperbarui: Date.now() });
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
    if (!window.confirm(`Hapus agenda "${form.nama}"?`)) return;
    setSibuk(true);
    try {
      await remove(ref(db, `agenda/${terpilih}`));
      setKabar({ jenis: 'baik', teks: 'Agenda dihapus.' });
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
        <button className="tbl" style={{ width: '100%', marginBottom: 12 }} onClick={baru}>+ Tambah agenda</button>
        <div className="adm-daftar">
          {daftar.length === 0 ? (
            <button disabled style={{ color: 'var(--tinta-lembut)' }}>Belum ada agenda tersimpan</button>
          ) : (
            daftar.map((a) => (
              <button key={a.id} aria-current={terpilih === a.id} onClick={() => pilih(a)}>
                {a.nama}
                <span className="kecil">{a.mulai} · {a.tempat}</span>
              </button>
            ))
          )}
        </div>
        <p className="bantu" style={{ marginTop: 10 }}>
          Tampil di sidebar beranda. Kalau daftar ini kosong, situs menampilkan contoh bawaan.
        </p>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>Nama kegiatan</label>
          <input value={form.nama} onChange={ubah('nama')} placeholder="Pelantikan DPC Kota Malang" />
        </div>
        <div className="adm-baris">
          <div className="medan">
            <label>Tanggal mulai</label>
            <input type="date" value={form.mulai} onChange={ubah('mulai')} />
          </div>
          <div className="medan">
            <label>Tempat / waktu</label>
            <input value={form.tempat} onChange={ubah('tempat')} placeholder="Balai Kota Malang · 09.00 WIB" />
          </div>
        </div>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
          {terpilih && <button className="tbl bahaya" onClick={hapus} disabled={sibuk}>Hapus</button>}
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
