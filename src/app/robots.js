import { SITUS } from '@/lib/situs';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin'] }],
    sitemap: `${SITUS.url}/sitemap.xml`,
  };
}
