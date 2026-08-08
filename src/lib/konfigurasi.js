// Konfigurasi Firebase proyek jatim-hippi-or-id.
// Nilai-nilai ini memang dirancang untuk tampil di sisi klien (bukan rahasia).
// Yang menjaga data adalah aturan di database.rules.json — pastikan sudah di-Publish
// di Firebase Console, kalau tidak, database bisa ditulis siapa saja.
//
// Semua nilai bisa ditimpa lewat environment variable di Vercel bila suatu saat
// proyek Firebase-nya diganti.

export const FIREBASE = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDDKXi4otulULFSGdIihN2_3PG5HGxZOK4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'jatim-hippi-or-id.firebaseapp.com',
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://jatim-hippi-or-id-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'jatim-hippi-or-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'jatim-hippi-or-id.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '37187040102',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:37187040102:web:56b2d84ae1e9e0dd5f4ea7',
};

// Admin utama yang permanen — selalu punya akses, tidak bergantung database.
// Ini "jaring pengaman": walau daftar admin di database kosong/salah/terhapus,
// akun ini tetap bisa masuk untuk memperbaikinya. Harus SAMA PERSIS dengan
// yang tertulis di database.rules.json.
export const ADMIN_UTAMA = 'qfazdigital@gmail.com';

// Email yang boleh masuk panel admin lewat env var (opsional, cara lama).
// Admin tambahan sekarang lebih baik diatur lewat tab "Kelola Admin" di panel,
// bukan lewat variabel ini.
export const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || ADMIN_UTAMA
)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const bolehMasuk = (email) => !!email && ADMIN_EMAILS.includes(email.toLowerCase());

// Firebase Realtime Database tidak mengizinkan titik (.) di dalam key,
// jadi email disimpan dengan titik diganti koma. Pola yang sama dipakai
// di database.rules.json — kalau diubah di sini, ubah juga di sana.
export const sanitasiEmail = (email) => (email || '').trim().toLowerCase().replace(/\./g, ',');
