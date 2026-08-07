export const SITUS = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://jatim-hippiorid.vercel.app').replace(/\/$/, ''),
  nama: 'HIPPI Jawa Timur',
  namaPanjang: 'DPD Himpunan Pengusaha Pribumi Indonesia Provinsi Jawa Timur',
  deskripsi:
    'Situs resmi Dewan Pengurus Daerah HIPPI Provinsi Jawa Timur. Kabar 38 DPC kabupaten/kota, agenda, keanggotaan, dan etalase Produk Pribumi Asli.',
  slogan: 'Pribumi Berkarya, Jawa Timur Berdaya',
  wa: process.env.NEXT_PUBLIC_WA || '628177999960',
  ogDefault: '/og-default.jpg',
};

export const urlPenuh = (path = '/') =>
  `${SITUS.url}${path.startsWith('/') ? path : `/${path}`}`;
