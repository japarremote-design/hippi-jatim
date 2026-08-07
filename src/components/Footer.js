import Link from 'next/link';
import Image from 'next/image';
import { SITUS } from '@/lib/situs';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-grid">
          <div>
            <Image
              className="f-logo"
              src="/logo-hippi-putih.png"
              alt={SITUS.namaPanjang}
              width={800}
              height={307}
              style={{ height: 74, width: 'auto' }}
            />
            <p>Sekretariat {SITUS.namaPanjang}.</p>
            <p className="f-slogan">{SITUS.slogan}</p>
            <div className="sosmed">
              <a href="https://instagram.com/" aria-label="Instagram">IG</a>
              <a href="https://facebook.com/" aria-label="Facebook">FB</a>
              <a href="https://youtube.com/" aria-label="YouTube">YT</a>
              <a href="https://linkedin.com/" aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div>
            <h5>Organisasi</h5>
            <ul>
              <li><Link href="/tentang/sejarah">Sejarah</Link></li>
              <li><Link href="/tentang/visi-misi">Visi &amp; Misi</Link></li>
              <li><Link href="/tentang/pengurus">Pengurus DPD</Link></li>
              <li><Link href="/dpc">Daftar DPC</Link></li>
            </ul>
          </div>
          <div>
            <h5>Layanan</h5>
            <ul>
              <li><Link href="/keanggotaan">Pendaftaran anggota</Link></li>
              <li><Link href="/produk">Daftarkan produk</Link></li>
              <li><Link href="/iklan">Pasang iklan</Link></li>
              <li><Link href="/unduhan">Unduh formulir</Link></li>
            </ul>
          </div>
          <div>
            <h5>Sekretariat</h5>
            <ul>
              <li>Jl. Sekretariat No. 00, Surabaya</li>
              <li><a href="mailto:sekretariat@hippijatim.or.id">sekretariat@hippijatim.or.id</a></li>
              <li><a href={`https://wa.me/${SITUS.wa}`}>WhatsApp sekretariat</a></li>
              <li>Senin–Jumat, 09.00–16.00 WIB</li>
            </ul>
          </div>
        </div>
        <div className="f-bawah">
          <span>© {new Date().getFullYear()} {SITUS.nama}. Seluruh hak cipta dilindungi.</span>
          <span>Kebijakan Privasi · Syarat Penggunaan</span>
          <span>
            Powered by{' '}
            <a href="https://qfazdigital.my.id/" target="_blank" rel="noopener noreferrer">
              qfazdigital.my.id
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
