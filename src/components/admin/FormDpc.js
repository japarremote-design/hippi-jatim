'use client';

import { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { DAFTAR_DPC } from '@/lib/dpc';

const KOSONG = {
  ketua: '',
  sekretaris: '',
  bendahara: '',
  sekretariat: '',
  telepon: '',
  email: '',
  periode: '',
  status: 'siap',
};

export default function FormDpc() {
  const [semua, setSemua] = useState({});
  const [slug, setSlug] = useState(DAFTAR_DPC[0].slug);
  const [form, setForm] = useState(KOSONG);
  const [sibuk, setSibuk] = useState(false);
  const [kabar, setKabar] = useState(null);

  const muat = async () => {
    try {
      const cuplik = await get(ref(db, 'dpc'));
      setSemua(cuplik.val() || {});
    } catch (e) {
      setKabar({ jenis: 'buruk', teks: `Gagal memuat: ${e.message}` });
    }
  };

  useEffect(() => { muat(); }, []);

  useEffect(() => {
    setForm({ ...KOSONG, ...(semua[slug] || {}) });
    setKabar(null);
  }, [slug, semua]);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const cabang = DAFTAR_DPC.find((d) => d.slug === slug);
  const terisi = DAFTAR_DPC.filter((d) => semua[d.slug]?.ketua).length;

  const simpan = async () => {
    setSibuk(true);
    setKabar(null);
    try {
      await set(ref(db, `dpc/${slug}`), {
        ...form,
        nama: cabang.nama,
        wilayah: cabang.wilayah,
        jenis: cabang.jenis,
        diperbarui: Date.now(),
      });
      setKabar({ jenis: 'baik', teks: 'Tersimpan.' });
      await muat();
    } catch (e) {
      setKabar({
        jenis: 'buruk',
        teks:
          e?.code === 'PERMISSION_DENIED'
            ? 'Ditolak database. Pastikan database.rules.json sudah di-Publish di Firebase Console.'
            : `Gagal menyimpan: ${e.message}`,
      });
    }
    setSibuk(false);
  };

  return (
    <div className="adm-kolom">
      <div>
        <p style={{ fontSize: 13, color: 'var(--tinta-lembut)', marginBottom: 12 }}>
          {terisi} dari {DAFTAR_DPC.length} cabang sudah terisi.
        </p>
        <div className="adm-daftar">
          {DAFTAR_DPC.map((d) => (
            <button key={d.slug} aria-current={slug === d.slug} onClick={() => setSlug(d.slug)}>
              {d.nama}
              <span className="kecil">
                {semua[d.slug]?.ketua ? `Ketua: ${semua[d.slug].ketua}` : 'Belum diisi'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="adm-form">
        <div className="medan">
          <label>Cabang</label>
          <input value={`DPC HIPPI ${cabang.nama}`} readOnly style={{ background: 'var(--abu)' }} />
          <div className="bantu">Halamannya di /dpc/{slug}</div>
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Ketua</label>
            <input value={form.ketua} onChange={ubah('ketua')} />
          </div>
          <div className="medan">
            <label>Sekretaris</label>
            <input value={form.sekretaris} onChange={ubah('sekretaris')} />
          </div>
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Bendahara</label>
            <input value={form.bendahara} onChange={ubah('bendahara')} />
          </div>
          <div className="medan">
            <label>Periode kepengurusan</label>
            <input value={form.periode} onChange={ubah('periode')} placeholder="2026–2031" />
          </div>
        </div>

        <div className="medan">
          <label>Alamat sekretariat</label>
          <input value={form.sekretariat} onChange={ubah('sekretariat')} />
        </div>

        <div className="adm-baris">
          <div className="medan">
            <label>Telepon / WhatsApp</label>
            <input value={form.telepon} onChange={ubah('telepon')} />
          </div>
          <div className="medan">
            <label>Email</label>
            <input value={form.email} onChange={ubah('email')} />
          </div>
        </div>

        <div className="medan">
          <label>Status kepengurusan</label>
          <select value={form.status} onChange={ubah('status')}>
            <option value="aktif">Pengurus lengkap</option>
            <option value="siap">Dalam persiapan</option>
          </select>
          <div className="bantu">Menentukan warna titik di indeks 38 DPC pada beranda.</div>
        </div>

        <div className="adm-aksi">
          <button className="tbl" onClick={simpan} disabled={sibuk}>
            {sibuk ? 'Menyimpan…' : 'Simpan'}
          </button>
          <a className="tbl sekunder" href={`/dpc/${slug}`} target="_blank" rel="noopener noreferrer">
            Lihat halaman
          </a>
          {kabar && <span className={`kabar ${kabar.jenis}`}>{kabar.teks}</span>}
        </div>
      </div>
    </div>
  );
}
