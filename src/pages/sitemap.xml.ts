import { SITE } from 'astrowind:config';

import { getCanonical, getPermalink, BLOG_BASE } from '~/utils/permalinks';
import { fetchPosts, blogPostsPerPage, isBlogEnabled } from '~/utils/blog';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/team',
  '/contact',
  '/privacy',
  '/terms',
  '/electronic-notice',
  '/solution/rakuplatform',
  '/solution/salesforce',
  '/solution/ai',
  '/solution/nocobase',
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

const getBlogListPath = (page: number) => {
  const base = BLOG_BASE || 'blog';
  return page <= 1 ? `/${base}` : `/${base}/${page}`;
};

export const GET = async () => {
  if (!SITE?.site) {
    return new Response(null, {
      status: 500,
      statusText: 'SITE.site is not defined in configuration.',
    });
  }

  const urls = new Set<string>(STATIC_ROUTES.map(toAbsoluteUrl));

  if (isBlogEnabled) {
    const posts = await fetchPosts();

    urls.add(toAbsoluteUrl(getBlogListPath(1)));

    posts.forEach((post) => {
      urls.add(toAbsoluteUrl(getPermalink(post.permalink, 'post')));
    });

    const perPage = blogPostsPerPage || 6;
    const totalPages = Math.ceil(posts.length / perPage);
    for (let page = 2; page <= totalPages; page += 1) {
      urls.add(toAbsoluteUrl(getBlogListPath(page)));
    }

    const categories = new Set<string>();
    const tags = new Set<string>();
    posts.forEach((post) => {
      if (post.category?.slug) categories.add(post.category.slug);
      post.tags?.forEach((tag) => tags.add(tag.slug));
    });

    categories.forEach((slug) => urls.add(toAbsoluteUrl(getPermalink(slug, 'category'))));
    tags.forEach((slug) => urls.add(toAbsoluteUrl(getPermalink(slug, 'tag'))));
  }

  const sitemapUrls = Array.from(urls).sort();

  const sitemap = generateSitemap(sitemapUrls);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
