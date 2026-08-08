'use client';

import { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';

const BARIS_KOSONG = { jabatan: '', nama: '' };

export default function FormPengurusDpd() {
  const [baris, setBaris] = useState([{ ...BARIS_KOSONG }]);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'pengurus-dpd'));
      const nilai = cuplik.val();
      const list = nilai ? Object.values(nilai) : [];
      setBaris(list.length ? list : [{ ...BARIS_KOSONG }]);
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  const ubahBaris = (i, kunci, nilai) =>
    setBaris((b) => b.map((r, idx) => (idx === i ? { ...r, [kunci]: nilai } : r)));

  const tambahBaris = () => setBaris((b) => [...b, { ...BARIS_KOSONG }]);
  const hapusBaris = (i) => setBaris((b) => b.filter((_, idx) => idx !== i));

  const simpan = async () => {
    const terisi = baris.filter((b) => b.jabatan.trim() && b.nama.trim());
    if (terisi.length === 0) return setKabar({ jenis: 'buruk', teks: 'Isi minimal satu baris jabatan & nama.' });
    setSibuk(true);
    setKabar(null);
    try {
      await set(ref(db, 'pengurus-dpd'), terisi);
      setKabar({ jenis: 'baik', teks: 'Tersimpan.' });
      setBaris(terisi);
    } catch (e) {
      setKabar({
        jenis: 'buruk',
        teks: e?.code === 'PERMISSION_DENIED' ? 'Ditolak database. Pastikan rules sudah di-Publish.' : `Gagal: ${e.message}`,
      });
    }
    setSibuk(false);
  };

  return (
    <div className="adm-form" style={{ maxWidth: 620 }}>
      <p className="bantu">Susunan pengurus DPD yang tampil di halaman /tentang/pengurus, urut dari atas ke bawah.</p>

      {baris.map((r, i) => (
        <div className="adm-baris" key={i} style={{ alignItems: 'end' }}>
          <div className="medan">
            <label>Jabatan</label>
            <input value={r.jabatan} onChange={(e) => ubahBaris(i, 'jabatan', e.target.value)} placeholder="Ketua Umum" />
          </div>
          <div className="medan" style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Nama</label>
              <input value={r.nama} onChange={(e) => ubahBaris(i, 'nama', e.target.value)} placeholder="Nama lengkap" />
            </div>
            <button
              className="tbl bahaya"
              style={{ flex: 'none', padding: '10px 14px', alignSelf: 'flex-end' }}
              onClick={() => hapusBaris(i)}
              disabled={baris.length === 1}
              title="Hapus baris ini"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <button className="tbl sekunder" style={{ width: 'fit-content' }} onClick={tambahBaris}>+ Tambah baris</button>

      <div className="adm-aksi">
        <button className="tbl" onClick={simpan} disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
        <a className="tbl sekunder" href="/tentang/pengurus" target="_blank" rel="noopener noreferrer">Lihat halaman</a>
        {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
      </div>
    </div>
  );
}
