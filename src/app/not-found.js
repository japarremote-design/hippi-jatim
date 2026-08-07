import Link from 'next/link';

export default function TidakDitemukan() {
  return (
    <div className="hampa">
      <h2>Halaman tidak ditemukan</h2>
      <p>
        Alamat yang dibuka tidak ada atau sudah dipindah.
        <br />
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </div>
  );
}
