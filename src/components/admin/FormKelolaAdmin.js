'use client';

import { useEffect, useState } from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { db } from '@/lib/firebase';
import { ADMIN_UTAMA, sanitasiEmail } from '@/lib/konfigurasi';

export default function FormKelolaAdmin({ emailSaya }) {
  const [daftar, setDaftar] = useState([]);
  const [emailBaru, setEmailBaru] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'admin-emails'));
      const isi = cuplik.val() || {};
      setDaftar(
        Object.entries(isi)
          .filter(([, aktif]) => aktif === true)
          .map(([kunci]) => kunci.replace(/,/g, '.'))
      );
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  const tambah = async () => {
    const email = emailBaru.trim().toLowerCase();
    if (!email || !email.includes('@')) return setKabar({ jenis: 'buruk', teks: 'Masukkan alamat email yang benar.' });
    if (email === ADMIN_UTAMA) return setKabar({ jenis: 'buruk', teks: 'Email ini sudah otomatis jadi admin utama.' });
    if (daftar.includes(email)) return setKabar({ jenis: 'buruk', teks: 'Email ini sudah ada di daftar.' });

    setSibuk(true);
    setKabar(null);
    try {
      await set(ref(db, `admin-emails/${sanitasiEmail(email)}`), true);
      setEmailBaru('');
      setKabar({ jenis: 'baik', teks: `${email} ditambahkan sebagai admin.` });
      await muat();
    } catch (e) {
      setKabar({
        jenis: 'buruk',
        teks:
          e?.code === 'PERMISSION_DENIED'
            ? 'Ditolak database. Pastikan database.rules.json versi terbaru sudah di-Publish di Firebase Console.'
            : `Gagal menyimpan: ${e.message}`,
      });
    }
    setSibuk(false);
  };

  const hapus = async (email) => {
    if (!window.confirm(`Cabut akses admin untuk ${email}?`)) return;
    setSibuk(true);
    setKabar(null);
    try {
      await remove(ref(db, `admin-emails/${sanitasiEmail(email)}`));
      setKabar({ jenis: 'baik', teks: `Akses ${email} dicabut.` });
      await muat();
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal menghapus: ${e.message}` });
    }
    setSibuk(false);
  };

  return (
    <div className="adm-form" style={{ maxWidth: 620 }}>
      <p className="bantu">
        Semua akun di bawah ini bisa masuk panel admin dan mengelola seluruh isi situs
        (bukan cuma tab ini). Tambahkan hanya pengurus yang benar-benar dipercaya.
      </p>

      <div className="medan">
        <label>Admin utama (permanen, tidak bisa dicabut dari sini)</label>
        <input value={ADMIN_UTAMA} disabled style={{ background: 'var(--abu)', color: 'var(--tinta-lembut)' }} />
      </div>

      <div className="medan">
        <label>Daftar admin tambahan</label>
        {daftar.length === 0 ? (
          <p className="bantu">Belum ada admin tambahan.</p>
        ) : (
          <div className="adm-daftar" style={{ maxHeight: 260 }}>
            {daftar.map((email) => (
              <div
                key={email}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid var(--garis)' }}
              >
                <span style={{ fontSize: 13.5 }}>
                  {email}
                  {email === emailSaya && <span style={{ color: 'var(--tinta-lembut)' }}> (akun ini)</span>}
                </span>
                <button className="tbl bahaya" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => hapus(email)} disabled={sibuk}>
                  Cabut
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="adm-baris">
        <div className="medan">
          <label>Tambah admin baru</label>
          <input
            type="email"
            value={emailBaru}
            onChange={(e) => setEmailBaru(e.target.value)}
            placeholder="pengurus@email.com"
          />
          <div className="bantu">Harus akun Google — email lain (misal Yahoo) tidak bisa login lewat tombol "Masuk dengan Google".</div>
        </div>
      </div>

      <div className="adm-aksi">
        <button className="tbl" onClick={tambah} disabled={sibuk}>{sibuk ? 'Menyimpan…' : '+ Tambahkan sebagai admin'}</button>
        {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
      </div>
    </div>
  );
}
