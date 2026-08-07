'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { DAFTAR_DPC } from '@/lib/dpc';

const MENU = [
  {
    judul: 'Tentang Kami',
    isi: [
      ['Sejarah HIPPI Jawa Timur', '/tentang/sejarah'],
      ['Mukadimah', '/tentang/mukadimah'],
      ['Visi & Misi', '/tentang/visi-misi'],
      ['Grand Strategy', '/tentang/grand-strategy'],
      ['Empat Pilar Program', '/tentang/empat-pilar'],
      ['Dewan Pengurus Daerah', '/tentang/pengurus'],
    ],
  },
  {
    judul: 'Media',
    isi: [
      ['Berita', '/berita'],
      ['Buletin', '/buletin'],
      ['Galeri Foto', '/galeri'],
      ['Unduhan', '/unduhan'],
    ],
  },
];

export default function Navbar() {
  const [buka, setBuka] = useState(null);
  const [menuHp, setMenuHp] = useState(false);
  const [tgl, setTgl] = useState('');

  useEffect(() => {
    const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const t = new Date();
    setTgl(`${hari[t.getDay()]}, ${t.getDate()} ${bulan[t.getMonth()]} ${t.getFullYear()}`);
  }, []);

  useEffect(() => {
    const tutup = (e) => {
      if (!e.target.closest('.item')) setBuka(null);
    };
    document.addEventListener('click', tutup);
    return () => document.removeEventListener('click', tutup);
  }, []);

  const toggle = (e, judul) => {
    e.stopPropagation();
    setBuka((s) => (s === judul ? null : judul));
  };

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="tgl">{tgl}</div>
          <nav>
            <Link href="/tentang/pengurus">Pengurus</Link>
            <Link href="/unduhan">Unduhan</Link>
            <Link href="/kontak">Kontak</Link>
            <Link href="/masuk" className="masuk">Masuk Anggota</Link>
          </nav>
        </div>
      </div>

      <header className="masthead">
        <div className="wrap">
          <Link className="merek" href="/">
            <Image
              src="/logo-hippi-baris.png"
              alt="HIPPI — Himpunan Pengusaha Pribumi Indonesia"
              width={700}
              height={164}
              priority
              style={{ height: 46, width: 'auto' }}
            />
            <span className="pemisah" />
            <span className="daerah">
              <strong>Dewan Pengurus Daerah</strong>
              <small>Provinsi Jawa Timur</small>
            </span>
          </Link>
          <Link href="/keanggotaan" className="cta-gabung">Daftar Anggota</Link>
        </div>
      </header>

      <nav className="navbar">
        <div className="wrap">
          <div className="menu" data-buka={menuHp ? '1' : '0'}>
            <Link href="/">Beranda</Link>

            {MENU.map((m) => (
              <div className="item" key={m.judul} data-open={buka === m.judul ? '1' : '0'}>
                <button className="top" aria-expanded={buka === m.judul} onClick={(e) => toggle(e, m.judul)}>
                  {m.judul} <span className="tanda">▼</span>
                </button>
                <div className="drop">
                  {m.isi.map(([teks, href]) => (
                    <Link href={href} key={href}>{teks}</Link>
                  ))}
                </div>
              </div>
            ))}

            <Link href="/keanggotaan">Keanggotaan</Link>

            <div className="item" data-open={buka === 'DPC' ? '1' : '0'}>
              <button className="top" aria-expanded={buka === 'DPC'} onClick={(e) => toggle(e, 'DPC')}>
                DPC <span className="tanda">▼</span>
              </button>
              <div className="drop">
                <div className="kolom-dpc">
                  {DAFTAR_DPC.map((d) => (
                    <Link href={`/dpc/${d.slug}`} key={d.slug}>
                      {d.nama.replace('Kabupaten', 'Kab.')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/produk">Produk Pribumi</Link>
            <Link href="/kontak">Kontak</Link>
          </div>

          <button
            className="burger"
            aria-label="Buka menu"
            aria-expanded={menuHp}
            onClick={(e) => { e.stopPropagation(); setMenuHp((s) => !s); }}
          >
            {menuHp ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </>
  );
}
