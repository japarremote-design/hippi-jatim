'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, google, db } from '@/lib/firebase';
import { bolehMasuk, ADMIN_UTAMA, sanitasiEmail } from '@/lib/konfigurasi';
import FormBerita from '@/components/admin/FormBerita';
import FormDpc from '@/components/admin/FormDpc';
import FormProduk from '@/components/admin/FormProduk';
import FormAgenda from '@/components/admin/FormAgenda';
import FormKonten from '@/components/admin/FormKonten';
import FormPengurusDpd from '@/components/admin/FormPengurusDpd';
import FormDaftarTautan from '@/components/admin/FormDaftarTautan';
import FormKelolaAdmin from '@/components/admin/FormKelolaAdmin';

const TAB = [
  { kunci: 'berita', label: 'Berita' },
  { kunci: 'dpc', label: 'Data DPC' },
  { kunci: 'produk', label: 'Produk' },
  { kunci: 'agenda', label: 'Agenda' },
  { kunci: 'konten', label: 'Halaman Statis' },
  { kunci: 'pengurus', label: 'Pengurus DPD' },
  { kunci: 'buletin', label: 'Buletin' },
  { kunci: 'galeri', label: 'Galeri' },
  { kunci: 'unduhan', label: 'Unduhan' },
  { kunci: 'admin', label: 'Kelola Admin' },
];

export default function Admin() {
  const [pengguna, setPengguna] = useState(undefined); // undefined = masih memeriksa
  const [boleh, setBoleh] = useState(undefined); // undefined = masih memeriksa akses
  const [tab, setTab] = useState('berita');
  const [galat, setGalat] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setPengguna(u || null);
      if (!u) { setBoleh(false); return; }

      // Admin utama & yang diatur lewat env var langsung lolos tanpa perlu tanya database.
      if (bolehMasuk(u.email)) { setBoleh(true); return; }

      // Selain itu, cek daftar admin tambahan yang diatur lewat tab "Kelola Admin".
      try {
        const cuplik = await get(ref(db, `admin-emails/${sanitasiEmail(u.email)}`));
        setBoleh(cuplik.val() === true);
      } catch {
        setBoleh(false);
      }
    });
  }, []);

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

  if (pengguna === undefined || (pengguna && boleh === undefined)) {
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

  if (!boleh) {
    return (
      <div className="gerbang">
        <h1>Akun ini tidak punya akses</h1>
        <p>
          Masuk sebagai <strong>{pengguna.email}</strong>. Minta admin yang sudah punya akses
          untuk menambahkan email ini lewat tab &quot;Kelola Admin&quot; di panel.
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
        {TAB.map((t) => (
          <button key={t.kunci} aria-pressed={tab === t.kunci} onClick={() => setTab(t.kunci)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'berita' && <FormBerita />}
      {tab === 'dpc' && <FormDpc />}
      {tab === 'produk' && <FormProduk />}
      {tab === 'agenda' && <FormAgenda />}
      {tab === 'konten' && <FormKonten />}
      {tab === 'pengurus' && <FormPengurusDpd />}
      {tab === 'buletin' && (
        <FormDaftarTautan
          jalur="buletin"
          labelJudul="Judul edisi"
          placeholderJudul="Buletin Edisi Agustus 2026"
          labelUrl="File (PDF)"
          placeholderUrl="https://…"
          jalurLihat="/buletin"
          terimaUnggah
          acceptUnggah=".pdf,application/pdf"
        />
      )}
      {tab === 'galeri' && (
        <FormDaftarTautan
          jalur="galeri"
          labelJudul="Judul foto"
          placeholderJudul="Pelantikan DPC Kota Malang"
          labelUrl="Gambar"
          placeholderUrl="https://…"
          jalurLihat="/galeri"
          terimaUnggah
          acceptUnggah="image/*"
          gambarPratinjau
        />
      )}
      {tab === 'unduhan' && (
        <FormDaftarTautan
          jalur="unduhan"
          labelJudul="Judul dokumen"
          placeholderJudul="Formulir Pendaftaran Anggota"
          labelUrl="File"
          placeholderUrl="https://…"
          jalurLihat="/unduhan"
          terimaUnggah
          acceptUnggah=".pdf,.doc,.docx,application/pdf"
        />
      )}
      {tab === 'admin' && <FormKelolaAdmin emailSaya={pengguna.email} />}
    </div>
  );
}
