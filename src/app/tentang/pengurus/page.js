import Placeholder from '@/components/Placeholder';

export const metadata = {
  title: 'Dewan Pengurus Daerah',
  description: 'Susunan pengurus DPD HIPPI Provinsi Jawa Timur.',
  alternates: { canonical: '/tentang/pengurus' },
};

export default function Pengurus() {
  return (
    <Placeholder
      label="Tentang Kami"
      judul="Dewan Pengurus Daerah"
      teks="Susunan lengkap pengurus DPD HIPPI Provinsi Jawa Timur periode berjalan sedang disiapkan."
    />
  );
}
