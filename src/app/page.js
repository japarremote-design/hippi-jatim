import Link from 'next/link';
import Ticker from '@/components/Ticker';
import IndeksDpc from '@/components/IndeksDpc';
import { daftarBerita, daftarAgenda, daftarProduk, semuaDpc } from '@/lib/rtdb';
import { BERITA_CONTOH, AGENDA_CONTOH, PRODUK_CONTOH } from '@/lib/contoh';
import { tanggalIndo } from '@/lib/dpc';

export const revalidate = 60;

import { PILAR } from '@/lib/pilar';

function Gambar({ gambar, kategori, kode = 'Foto' }) {
  if (gambar) {
    return (
      <div className="thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gambar} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        {kategori && <span className="kategori">{kategori}</span>}
      </div>
    );
  }
  return (
    <div className="thumb">
      {kategori && <span className="kategori">{kategori}</span>}
      <span className="kode">{kode}</span>
    </div>
  );
}

export default async function Beranda() {
  const dariDb = await daftarBerita({ jumlah: 12 });
  const berita = dariDb.length ? dariDb : BERITA_CONTOH;
  const agendaDb = await daftarAgenda();
  const agenda = agendaDb.length ? agendaDb : AGENDA_CONTOH;
  const produkDb = await daftarProduk();
  const produk = produkDb.length ? produkDb : PRODUK_CONTOH;

  const cabang = await semuaDpc();
  const status = Object.fromEntries(cabang.map((c) => [c.slug, c.status || 'siap']));

  const [utama, ...sisa] = berita;
  const samping = sisa.slice(0, 4);
  const lanjutan = sisa.slice(4, 8);

  return (
    <>
      <Ticker judul={berita.slice(0, 5).map((b) => ({ teks: b.judul, href: `/berita/${b.slug}` }))} />

      <section className="hero">
        <div className="wrap hero-grid">
          <article className="utama">
            <Link href={`/berita/${utama.slug}`}>
              <Gambar gambar={utama.gambar} kategori={utama.kategori} kode="Foto — Musda" />
            </Link>
            <h2><Link href={`/berita/${utama.slug}`}>{utama.judul}</Link></h2>
            <p className="ringkas">{utama.ringkas}</p>
            <div className="meta">
              <b>{utama.penulis || 'Redaksi HIPPI Jatim'}</b>
              <i className="titik" />
              <span>{tanggalIndo(utama.tanggal)}</span>
            </div>
          </article>

          <div className="samping">
            {samping.map((b) => (
              <article className="kartu-kecil" key={b.slug}>
                <Link href={`/berita/${b.slug}`}><Gambar gambar={b.gambar} /></Link>
                <div>
                  <h3><Link href={`/berita/${b.slug}`}>{b.judul}</Link></h3>
                  <div className="meta"><span>{tanggalIndo(b.tanggal)}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pilar">
        <div className="wrap">
          <div className="eyebrow">Program Kerja</div>
          <h2 className="judul-bagian">Empat pilar yang dijalankan di seluruh cabang</h2>
          <div className="pilar-grid">
            {PILAR.map(([no, judul, teks]) => (
              <div className="pilar-item" key={no}>
                <div className="no">{no}</div>
                <h4>{judul}</h4>
                <p>{teks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="badan">
        <div className="wrap badan-grid">
          <div>
            <div className="eyebrow">Kabar Cabang</div>
            <h2 className="judul-bagian">Yang sedang berjalan di 38 kabupaten/kota</h2>
            <div className="daftar-berita">
              {(lanjutan.length ? lanjutan : samping).map((b) => (
                <article className="kartu" key={b.slug}>
                  <Link href={`/berita/${b.slug}`}><Gambar gambar={b.gambar} kategori={b.kategori} /></Link>
                  <h3><Link href={`/berita/${b.slug}`}>{b.judul}</Link></h3>
                  <p>{b.ringkas}</p>
                  <div className="meta"><span>{tanggalIndo(b.tanggal)}</span></div>
                </article>
              ))}
            </div>
            <Link href="/berita" className="muat">Tampilkan lebih banyak</Link>
          </div>

          <aside className="sisi">
            <section>
              <div className="judul-sisi">Paling dibaca</div>
              <div className="populer">
                {berita.slice(0, 5).map((b) => (
                  <Link href={`/berita/${b.slug}`} key={b.slug}><span>{b.judul}</span></Link>
                ))}
              </div>
            </section>

            <section>
              <div className="judul-sisi">Agenda</div>
              <ul className="agenda">
                {agenda.map((a) => {
                  const t = new Date(a.mulai);
                  const bl = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                  return (
                    <li key={a.id || a.slug || a.nama}>
                      <div className="kal">
                        <b>{Number.isNaN(t.getTime()) ? '--' : String(t.getDate()).padStart(2, '0')}</b>
                        <small>{Number.isNaN(t.getTime()) ? '' : bl[t.getMonth()]}</small>
                      </div>
                      <div><h5>{a.nama}</h5><p>{a.tempat}</p></div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section>
              <div className="iklan">
                <b>Ruang Iklan</b>
                <small>300 × 250 px — hubungi sekretariat</small>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <IndeksDpc status={status} />

      <section className="produk" id="produk">
        <div className="wrap">
          <div className="eyebrow">Produk Pribumi Asli</div>
          <h2 className="judul-bagian">Etalase produk anggota</h2>
          <div className="produk-grid">
            {produk.map((p) => (
              <Link className="p-kartu" href="/produk" key={p.id || p.nama}>
                <Gambar gambar={p.gambar} kode="Foto produk" />
                <div className="p-isi">
                  <h4>{p.nama}</h4>
                  <p className="asal">{p.asal}</p>
                  <p className="harga">{p.harga}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
