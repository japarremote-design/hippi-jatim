# HIPPI Jawa Timur — jatim-hippiorid.vercel.app

Situs resmi DPD Himpunan Pengusaha Pribumi Indonesia Provinsi Jawa Timur.
Next.js 15 (App Router) + Firebase Realtime Database, siap deploy ke Vercel.

## 1. Siapkan Firebase

1. Buat proyek di <https://console.firebase.google.com>
2. Menu **Build → Realtime Database → Create Database**, pilih lokasi **Singapore (asia-southeast1)** biar dekat dan cepat.
3. Buka tab **Rules**, tempel isi file `database.rules.json`, lalu **Publish**. Ganti dua alamat email di dalamnya dengan email admin yang sebenarnya.
4. Menu **Build → Authentication → Sign-in method**, aktifkan **Google** (untuk login admin nanti).
5. Menu **Project settings → General → Your apps → Web app**, salin nilai konfigurasinya.

## 2. Siapkan repo

```bash
npm install
cp .env.example .env.local   # isi nilainya dari langkah 1
npm run dev                  # buka http://localhost:3000
```

## 3. Deploy ke Vercel

1. Push folder ini ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo tersebut. Framework terdeteksi otomatis sebagai Next.js.
3. Di **Environment Variables**, masukkan semua isi `.env.example` (untuk Production, Preview, dan Development). Yang paling penting: `NEXT_PUBLIC_SITE_URL` harus sama persis dengan domain final, karena inilah yang dipakai membentuk URL absolut Open Graph.
4. **Deploy**. Setelah domain custom dipasang, ubah `NEXT_PUBLIC_SITE_URL` lalu redeploy.

## 4. Struktur data di Realtime Database

```json
{
  "berita": {
    "slug-berita": {
      "judul": "Judul berita",
      "ringkas": "Ringkasan 1-2 kalimat, dipakai jadi deskripsi preview share",
      "isi": "<p>HTML isi berita</p>",
      "gambar": "https://res.cloudinary.com/.../sampul.jpg",
      "kategori": "Gresik",
      "penulis": "Redaksi HIPPI Jatim",
      "tanggal": "2026-08-05",
      "terbit": true,
      "sumberNama": "Nama portal asal",
      "sumberUrl": "https://portal-asal.com/artikel"
    }
  },
  "dpc": {
    "kabupaten-jember": {
      "ketua": "Nama ketua",
      "sekretaris": "Nama sekretaris",
      "sekretariat": "Alamat sekretariat",
      "telepon": "0812-xxxx-xxxx",
      "periode": "2026-2031",
      "status": "aktif",
      "pengurus": { "1": { "jabatan": "Ketua", "nama": "..." } }
    }
  },
  "agenda": { "id": { "nama": "...", "tempat": "...", "mulai": "2026-08-14" } },
  "produk": { "id": { "nama": "...", "asal": "DPC ...", "harga": "Rp ...", "gambar": "..." } }
}
```

Slug DPC memakai pola `kabupaten-jember`, `kota-surabaya` — lihat `src/lib/dpc.js`.
Selama `berita`, `agenda`, dan `produk` masih kosong, situs menampilkan data contoh dari `src/lib/contoh.js` supaya tampilannya tetap utuh.

## 5. Open Graph — cara kerjanya

Metadata dirender di server, jadi crawler WhatsApp/Facebook/Telegram/X membacanya langsung dari HTML awal.

| Halaman | Judul preview | Gambar preview |
|---|---|---|
| Beranda, DPC, halaman statis | judul halaman | `/og-default.jpg` (1200x630) |
| Artikel punya `gambar` | judul artikel | gambar sampul artikel |
| Artikel tanpa `gambar` | judul artikel | kartu biru dibuat otomatis dari judul |

Kartu otomatis itu dihasilkan `src/app/berita/[slug]/opengraph-image.js`.

**Setelah deploy, tes di sini:**

- Facebook & Instagram: <https://developers.facebook.com/tools/debug/>
- X: <https://cards-dev.twitter.com/validator>
- LinkedIn: <https://www.linkedin.com/post-inspector/>
- WhatsApp & Telegram: tidak ada alat resmi — kirim tautannya ke chat pribadi sendiri.

Kalau preview lama tidak berubah, klik **Scrape Again** di Facebook Debugger. WhatsApp menyimpan cache preview beberapa jam sampai beberapa hari.

**Catatan Instagram:** Instagram tidak menampilkan preview tautan di feed atau komentar sama sekali — hanya lewat link sticker di Story dan tautan di bio, dan itu pun tanpa kartu. Ini batasan Instagram, bukan situsnya. Tombol "Lainnya" di komponen berbagi memanggil share sheet bawaan HP, dari situ pengguna bisa memilih Instagram Story.

## 6. Yang belum ada

- Panel admin untuk menulis berita (login Google + editor). Sementara ini isi data lewat Firebase Console dulu.
- Halaman statis: sejarah, mukadimah, visi-misi, grand strategy, empat pilar, pengurus DPD, keanggotaan, kontak, unduhan, galeri, buletin, produk, iklan, masuk. Tautan menunya sudah ada, halamannya belum dibuat.
- Upload gambar ke Cloudinary.
- Fitur "tarik data" dari link berita luar.

## 7. Catatan teknis

- Font dimuat lewat `<link>` ke Google Fonts di `src/app/layout.js`. Kalau mau self-host dan menghilangkan request eksternal, ganti ke `next/font/google`.
- `revalidate` diset 60 detik untuk berita, 300 detik untuk DPC. Berita baru muncul paling lama satu menit setelah disimpan.
- 38 halaman DPC di-prerender saat build lewat `generateStaticParams`.
- `sitemap.xml` dan `robots.txt` dibuat otomatis.
