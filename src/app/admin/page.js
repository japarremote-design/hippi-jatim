'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, google } from '@/lib/firebase';
import { bolehMasuk, ADMIN_EMAILS } from '@/lib/konfigurasi';
import FormBerita from '@/components/admin/FormBerita';
import FormDpc from '@/components/admin/FormDpc';

export default function Admin() {
  const [pengguna, setPengguna] = useState(undefined); // undefined = masih memeriksa
  const [tab, setTab] = useState('berita');
  const [galat, setGalat] = useState('');

  useEffect(() => onAuthStateChanged(auth, (u) => setPengguna(u || null)), []);

  const masuk = async () => {
    setGalat('');
    try {
      await signInWithPopup(auth, google);
    } catch (e) {
      setGalat(
        e?.code === 'auth/popup-closed-by-user'
          ? 'Jendela login ditutup sebelum selesai.'
          : `Login gagal: ${e?.code || e?.message}`
      );
    }
  };

  if (pengguna === undefined) {
    return <div className="gerbang"><p>Memeriksa sesi…</p></div>;
  }

  if (!pengguna) {
    return (
      <div className="gerbang">
        <h1>Panel Admin</h1>
        <p>Masuk dengan akun Google yang terdaftar sebagai pengelola situs.</p>
        <button className="tbl" onClick={masuk}>Masuk dengan Google</button>
        {galat && <p className="kabar buruk" style={{ marginTop: 16 }}>{galat}</p>}
      </div>
    );
  }

  if (!bolehMasuk(pengguna.email)) {
    return (
      <div className="gerbang">
        <h1>Akun ini tidak punya akses</h1>
        <p>
          Masuk sebagai <strong>{pengguna.email}</strong>, sementara yang diizinkan hanya{' '}
          {ADMIN_EMAILS.join(', ')}.
        </p>
        <button className="tbl sekunder" onClick={() => signOut(auth)}>Keluar</button>
      </div>
    );
  }

  return (
    <div className="adm">
      <div className="adm-kepala">
        <div>
          <h1>Panel Admin</h1>
          <div className="siapa">Masuk sebagai {pengguna.email}</div>
        </div>
        <button className="tbl sekunder" onClick={() => signOut(auth)}>Keluar</button>
      </div>

      <div className="adm-tab">
        <button aria-pressed={tab === 'berita'} onClick={() => setTab('berita')}>Berita</button>
        <button aria-pressed={tab === 'dpc'} onClick={() => setTab('dpc')}>Data DPC</button>
      </div>

      {tab === 'berita' ? <FormBerita /> : <FormDpc />}
    </div>
  );
}
