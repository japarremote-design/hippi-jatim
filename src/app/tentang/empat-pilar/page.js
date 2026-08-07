import { PILAR } from '@/lib/pilar';

export const metadata = {
  title: 'Empat Pilar Program',
  description: 'Empat pilar program kerja DPD HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/tentang/empat-pilar' },
};

export default function EmpatPilar() {
  return (
    <section className="pilar">
      <div className="wrap">
        <div className="eyebrow">Tentang Kami</div>
        <h1 className="judul-bagian">Empat pilar yang dijalankan di seluruh cabang</h1>
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
  );
}
