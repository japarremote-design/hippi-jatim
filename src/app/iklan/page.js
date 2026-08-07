import Placeholder from '@/components/Placeholder';

export const metadata = {
  title: 'Pasang Iklan',
  description: 'Informasi pemasangan iklan di situs HIPPI Jawa Timur.',
  alternates: { canonical: '/iklan' },
};

export default function Iklan() {
  return (
    <Placeholder
      label="Layanan"
      judul="Pasang Iklan"
      teks="Untuk informasi slot dan tarif iklan di situs ini, silakan hubungi sekretariat DPD HIPPI Jawa Timur."
    />
  );
}
