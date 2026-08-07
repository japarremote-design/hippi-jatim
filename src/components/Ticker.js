export default function Ticker({ judul = [] }) {
  const isi = judul.length ? judul : ['Selamat datang di situs resmi HIPPI Jawa Timur'];
  const dua = [...isi, ...isi];
  return (
    <div className="ticker">
      <div className="wrap">
        <span className="tag">Kabar Terbaru</span>
        <div className="jalur">
          <div className="geser">
            {dua.map((t, i) => (
              <a href={t.href || '/berita'} key={i}><b>•</b>{t.teks || t}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
