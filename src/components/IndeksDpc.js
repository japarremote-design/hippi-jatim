'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { DAFTAR_DPC, JUMLAH } from '@/lib/dpc';

const FILTER = [
  ['semua', 'Semua'],
  ['kabupaten', 'Kabupaten'],
  ['kota', 'Kota'],
  ['madura', 'Madura'],
];

export default function IndeksDpc({ status = {} }) {
  const [kata, setKata] = useState('');
  const [filter, setFilter] = useState('semua');

  const hasil = useMemo(() => {
    const k = kata.trim().toLowerCase();
    return DAFTAR_DPC.filter((d) => {
      if (k && !d.nama.toLowerCase().includes(k)) return false;
      if (filter === 'kabupaten') return d.jenis === 'kabupaten';
      if (filter === 'kota') return d.jenis === 'kota';
      if (filter === 'madura') return d.wilayah === 'Madura';
      return true;
    });
  }, [kata, filter]);

  return (
    <section className="dpc" id="dpc">
      <Image className="cap" src="/lambang-hippi.png" alt="" width={340} height={345} aria-hidden="true" />
      <div className="wrap">
        <div className="dpc-kepala">
          <div className="kiri">
            <div className="eyebrow">Dewan Pengurus Cabang</div>
            <h2 className="judul-bagian">38 DPC se-Jawa Timur</h2>
            <p>
              Setiap kabupaten dan kota punya halaman sendiri: susunan pengurus, alamat sekretariat,
              kontak, dan arsip kegiatan cabang.
            </p>
          </div>
          <div className="hitung">
            <div><b>{JUMLAH.total}</b><small>Kabupaten/Kota</small></div>
            <div><b>{JUMLAH.kabupaten}</b><small>Kabupaten</small></div>
            <div><b>{JUMLAH.kota}</b><small>Kota</small></div>
          </div>
        </div>

        <div className="alat">
          <label className="kotak-cari">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={kata}
              onChange={(e) => setKata(e.target.value)}
              placeholder="Ketik nama daerah, misalnya Jember"
              aria-label="Cari DPC"
            />
          </label>
          {FILTER.map(([kunci, teks]) => (
            <button
              key={kunci}
              className="chip"
              aria-pressed={filter === kunci}
              onClick={() => setFilter(kunci)}
            >
              {teks}
            </button>
          ))}
        </div>

        <div className="dpc-grid">
          {hasil.length === 0 ? (
            <div className="kosong">Tidak ada cabang yang cocok. Coba kata kunci lain.</div>
          ) : (
            hasil.map((d) => (
              <Link className="dpc-item" href={`/dpc/${d.slug}`} key={d.slug}>
                <span className="nomor">{String(d.nomor).padStart(2, '0')}</span>
                <span className="nama">
                  {d.nama}
                  <span className="wilayah">{d.wilayah}</span>
                </span>
                <i className={`dot ${status[d.slug] === 'aktif' ? 'aktif' : 'siap'}`} />
              </Link>
            ))
          )}
        </div>

        <div className="ket">
          <span><i className="dot aktif" /> Pengurus lengkap</span>
          <span><i className="dot siap" /> Dalam persiapan</span>
          <span>Menampilkan {hasil.length} dari {JUMLAH.total} cabang</span>
        </div>
      </div>
    </section>
  );
}
