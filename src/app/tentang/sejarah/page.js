import Placeholder from '@/components/Placeholder';

export const metadata = {
  title: 'Sejarah',
  description: 'Sejarah berdirinya DPD HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/tentang/sejarah' },
};

export default function Sejarah() {
  return (
    <Placeholder
      label="Tentang Kami"
      judul="Sejarah HIPPI Jawa Timur"
      teks="Naskah sejarah berdirinya DPD HIPPI Provinsi Jawa Timur sedang disiapkan oleh sekretariat dan akan segera tayang di halaman ini."
    />
  );
}
