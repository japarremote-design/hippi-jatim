'use client';
import { useState } from 'react';

const IKON = {
  wa: 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm4.52 11.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z',
  tg: 'M11.94 15.4 8.2 18.7c-.3.3-.55.16-.66-.18l-1.4-4.6-4.4-1.5c-.5-.17-.5-.5.1-.7l17-6.5c.4-.15.8.1.66.7l-2.9 13.7c-.1.5-.4.6-.8.4l-4.6-3.4-2.2 2.1c-.02.02-.04.04-.06.06Z',
  fb: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.77-3.9 1.1 0 2.24.19 2.24.19v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z',
  x: 'M18.24 2.25h3.3l-7.22 8.26L22.8 21.75h-6.63l-5.2-6.8-5.94 6.8H1.73l7.73-8.84L1.2 2.25h6.8l4.7 6.21 5.54-6.21Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z',
  li: 'M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM3.2 8.6h3.5V21H3.2V8.6Zm5.9 0h3.35v1.7h.05c.47-.85 1.6-1.75 3.3-1.7 3.53 0 4.2 2.3 4.2 5.3V21h-3.5v-5.5c0-1.3-.03-3-1.85-3-1.85 0-2.13 1.44-2.13 2.9V21H9.1V8.6Z',
  th: 'M17.1 11.13c-.1-.05-.2-.1-.3-.14-.18-3.3-1.98-5.18-5-5.2h-.04c-1.8 0-3.3.77-4.23 2.17l1.66 1.14c.69-1.05 1.78-1.28 2.57-1.28h.03c.98 0 1.72.29 2.2.85.35.4.58.97.7 1.68a12.6 12.6 0 0 0-2.83-.14c-2.85.17-4.68 1.83-4.56 4.15.06 1.17.65 2.18 1.65 2.84.85.55 1.94.83 3.08.77 1.5-.08 2.68-.66 3.5-1.7.63-.8 1.02-1.83 1.2-3.13.72.43 1.25 1 1.55 1.7.5 1.17.53 3.1-1.05 4.67-1.38 1.38-3.04 1.98-5.56 2-2.8-.02-4.9-.92-6.27-2.66C4.1 17.1 3.44 14.94 3.42 12c.02-2.93.68-5.1 1.98-6.73C6.77 3.53 8.88 2.63 11.67 2.6c2.81.02 4.96.93 6.38 2.68.7.87 1.22 1.95 1.57 3.22l1.95-.52c-.42-1.55-1.08-2.9-1.98-4.02C17.76 1.7 15.06.53 11.68.5h-.01C8.3.53 5.63 1.71 3.75 4.02 2.08 6.08 1.22 8.94 1.2 12v.01c.02 3.05.88 5.9 2.55 7.97C5.63 22.29 8.3 23.47 11.67 23.5h.01c3-.02 5.11-.8 6.85-2.55 2.28-2.27 2.21-5.12 1.46-6.87-.54-1.25-1.57-2.27-2.89-2.95Zm-5.13 4.85c-1.26.07-2.57-.5-2.63-1.7-.05-.9.64-1.89 2.71-2.01.24-.02.47-.02.7-.02.75 0 1.46.07 2.1.21-.24 2.98-1.64 3.46-2.88 3.52Z',
};

const Ikon = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
);

export default function Berbagi({ url, judul, ringkas = '' }) {
  const [tersalin, setTersalin] = useState(false);
  const u = encodeURIComponent(url);
  const j = encodeURIComponent(judul);
  const teks = encodeURIComponent(`${judul}\n${url}`);

  const tautan = [
    ['WhatsApp', `https://api.whatsapp.com/send?text=${teks}`, IKON.wa],
    ['Telegram', `https://t.me/share/url?url=${u}&text=${j}`, IKON.tg],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`, IKON.fb],
    ['X', `https://twitter.com/intent/tweet?url=${u}&text=${j}`, IKON.x],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, IKON.li],
    ['Threads', `https://www.threads.net/intent/post?text=${teks}`, IKON.th],
  ];

  const bagikanNatif = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: judul, text: ringkas, url });
      } catch {
        /* dibatalkan pengguna */
      }
    }
  };

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      setTersalin(false);
    }
  };

  return (
    <div className="berbagi">
      <div className="label">Bagikan halaman ini</div>
      <div className="baris">
        {tautan.map(([nama, href, d]) => (
          <a className="b-tombol" key={nama} href={href} target="_blank" rel="noopener noreferrer">
            <Ikon d={d} />{nama}
          </a>
        ))}
        <button className="b-tombol" onClick={bagikanNatif}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16.1c-.8 0-1.5.3-2 .8l-7-4.1c.05-.25.08-.5.08-.75s-.03-.5-.08-.75l6.9-4c.55.5 1.3.85 2.1.85a3 3 0 1 0-3-3c0 .25.03.5.08.75l-6.9 4A3 3 0 1 0 6 15.3l7 4.1c-.05.2-.08.4-.08.6a2.92 2.92 0 1 0 5.08-2Z" /></svg>
          Lainnya
        </button>
        <button className="b-tombol salin" data-tersalin={tersalin ? '1' : '0'} onClick={salin}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" /></svg>
          {tersalin ? 'Tersalin' : 'Salin tautan'}
        </button>
      </div>
    </div>
  );
}
