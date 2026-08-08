'use client';

import { useRef, useState } from 'react';

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Unggah unsigned ke Cloudinary — dipakai di form admin mana pun yang butuh
// gambar atau file (foto sampul, foto produk, foto galeri, PDF buletin/unduhan).
// Tetap bisa isi manual URL kalau file sudah di-hosting di tempat lain.
export default function UploadBerkas({ label, value, onChange, accept = 'image/*', gambarPratinjau = true }) {
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState('');
  const inputRef = useRef(null);

  const unggah = async (file) => {
    if (!CLOUD || !PRESET) {
      setGalat('Cloudinary belum diatur — isi NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME dan NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET di environment variable Vercel.');
      return;
    }
    setSibuk(true);
    setGalat('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Upload gagal.');
      onChange(data.secure_url);
    } catch (e) {
      setGalat(e.message);
    }
    setSibuk(false);
  };

  return (
    <div className="medan">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… (atau unggah file di sebelah)"
          style={{ flex: 1, minWidth: 180 }}
        />
        <button
          type="button"
          className="tbl sekunder"
          style={{ flex: 'none' }}
          onClick={() => inputRef.current?.click()}
          disabled={sibuk}
        >
          {sibuk ? 'Mengunggah…' : 'Unggah file'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) unggah(f);
            e.target.value = '';
          }}
        />
      </div>
      {galat && <div className="bantu" style={{ color: '#B3261E' }}>{galat}</div>}
      {gambarPratinjau && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          style={{ marginTop: 8, maxHeight: 120, borderRadius: 4, border: '1px solid var(--garis)' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
    </div>
  );
}
