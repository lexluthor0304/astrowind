import { SITE } from 'astrowind:config';

import { getCanonical, getPermalink } from '~/utils/permalinks';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/solution/rakuplatform',
  '/solution/salesforce',
  '/solution/others',
];

const toAbsoluteUrl = (path: string): string => {
  const permalink = path === '/' ? getPermalink('/', 'home') : getPermalink(path);
  const canonical = getCanonical(permalink);
  return typeof canonical === 'string' ? canonical : canonical.toString();
};

const generateSitemap = (urls: string[]): string => {
  const lastmod = new Date().toISOString();

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((url) => `  <url>\n` + `    <loc>${url}</loc>\n` + `    <lastmod>${lastmod}</lastmod>\n` + `  </url>`)
      .join('\n') +
    `\n</urlset>`
  );
};

export const GET = async () => {
  if (!SITE?.site) {
    return new Response(null, {
      status: 500,
      statusText: 'SITE.site is not defined in configuration.',
    });
  }

  const urls = Array.from(new Set(STATIC_ROUTES.map(toAbsoluteUrl))).sort();

  const sitemap = generateSitemap(urls);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
