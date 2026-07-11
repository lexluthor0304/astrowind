import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const failures = [];
const checks = [];

function read(path) {
  const absolutePath = resolve(root, path);
  if (!existsSync(absolutePath)) {
    failures.push(`${path}: missing`);
    return '';
  }
  return readFileSync(absolutePath, 'utf8');
}

function requireText(path, content, expected, label = expected) {
  if (!content.includes(expected)) failures.push(`${path}: missing ${label}`);
}

function forbidText(path, content, forbidden, label = forbidden) {
  if (content.includes(forbidden)) failures.push(`${path}: must not include ${label}`);
}

function parseJsonLd(path, html) {
  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) {
    failures.push(`${path}: missing JSON-LD`);
    return [];
  }

  return blocks.flatMap((match) => {
    try {
      return [JSON.parse(match[1])];
    } catch (error) {
      failures.push(`${path}: invalid JSON-LD (${error.message})`);
      return [];
    }
  });
}

const productPath = 'product/rakucall.html';
const articlePath = 'blog/rakucall-launch.html';
const product = read(productPath);
const article = read(articlePath);
const formScript = read('src/js/rakucall-demo-form.js');
const home = read('index.html');
const blogIndex = read('blog.html');
const aiSolution = read('solution/ai.html');
const privacy = read('privacy.html');
const sitemap = read('public/sitemap.xml');
const robots = read('public/robots.txt');
const viteConfig = read('vite.config.js');
const vercelConfig = JSON.parse(read('vercel.json'));
const distProduct = read('dist/product/rakucall.html');

for (const field of [
  'companyName',
  'contactName',
  'email',
  'phoneNumber',
  'purpose',
  'preferredContactTime',
  'consentPrivacy',
  'consentAiCall',
]) {
  requireText(productPath, product, `name="${field}"`, `form field ${field}`);
}
requireText(productPath, product, 'data-endpoint="https://rakucall.ai/api/public/demo-applications"', 'production API endpoint');
requireText(productPath, product, '担当者確認後に発信します。自動で即時発信は行いません。', 'operator-review notice');
requireText(productPath, product, '外部送信やSalesforce本番組織への書き込みは行いません。', 'public-demo boundary');
requireText('src/js/rakucall-demo-form.js', formScript, "'http://127.0.0.1:4173/api/public/demo-applications'", 'local API endpoint');
requireText('src/js/rakucall-demo-form.js', formScript, "method: 'POST'", 'POST submission');
checks.push('demo application form fields, consent, review notice, and API endpoints');

const publicImage = 'https://rakucloud.com/images/rakucall-launch-top.png';
for (const [path, html] of [[productPath, product], [articlePath, article]]) {
  requireText(path, html, publicImage, 'stable social image URL');
  requireText(path, html, '<meta name="twitter:card" content="summary_large_image">', 'Twitter card');
  if (/property="og:image"\s+content="[^"]*\/src\//.test(html)) {
    failures.push(`${path}: og:image must not use a Vite source path`);
  }
}
checks.push('canonical, Open Graph, and social sharing metadata');

const productSchemas = parseJsonLd(productPath, product);
const articleSchemas = parseJsonLd(articlePath, article);
if (!productSchemas.some((schema) => schema['@type'] === 'Service' && schema.name === 'RakuCall')) {
  failures.push(`${productPath}: missing RakuCall Service schema`);
}
if (!articleSchemas.some((schema) => schema['@type'] === 'NewsArticle' && schema.datePublished)) {
  failures.push(`${articlePath}: missing NewsArticle publication schema`);
}
checks.push('valid Service and NewsArticle JSON-LD');

requireText('solution/ai.html', aiSolution, '/product/rakucall.html', 'RakuCall product discovery link');
requireText('privacy.html', privacy, 'RakuCall', 'RakuCall privacy terms');
for (const [path, html] of [
  ['index.html', home],
  ['blog.html', blogIndex],
  [productPath, product],
  ['vite.config.js', viteConfig],
]) {
  forbidText(path, html, '/blog/rakucall-launch', 'published RakuCall launch article reference');
}
checks.push('launch article hidden from homepage, blog, product navigation, and Vite inputs');

const hiddenArticleRedirect = vercelConfig.redirects?.find(
  (redirect) => redirect.source === '/blog/rakucall-launch',
);
if (
  hiddenArticleRedirect?.destination !== '/blog' ||
  hiddenArticleRedirect?.permanent !== false
) {
  failures.push('vercel.json: hidden launch article must temporarily redirect to /blog');
}
checks.push('direct launch article URL temporarily redirects to the blog index');

const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const url of [
  'https://rakucloud.com/',
  'https://rakucloud.com/product/rakucall',
]) {
  if (!sitemapUrls.includes(url)) failures.push(`public/sitemap.xml: missing ${url}`);
}
if (sitemapUrls.includes('https://rakucloud.com/blog/rakucall-launch')) {
  failures.push('public/sitemap.xml: hidden RakuCall launch article must be absent');
}
if (new Set(sitemapUrls).size !== sitemapUrls.length) failures.push('public/sitemap.xml: duplicate URL');
requireText('public/robots.txt', robots, 'Sitemap: https://rakucloud.com/sitemap.xml', 'sitemap declaration');
checks.push('robots and sitemap discovery');

for (const path of [
  'public/images/rakucall-launch-top.png',
  'dist/images/rakucall-launch-top.png',
  'dist/robots.txt',
  'dist/sitemap.xml',
]) {
  if (!existsSync(resolve(root, path))) failures.push(`${path}: missing`);
}
requireText('dist/product/rakucall.html', distProduct, publicImage, 'built product social image');
if (existsSync(resolve(root, 'dist/blog/rakucall-launch.html'))) {
  failures.push('dist/blog/rakucall-launch.html: hidden article must not be built');
}
checks.push('production build contains product assets and excludes the hidden article');

for (const [path, html] of [[productPath, product], [articlePath, article]]) {
  if (/\bfont-bold\b|<strong\b|<b\b/.test(html)) failures.push(`${path}: bold text is not allowed in RakuCloud customer-facing materials`);
}
checks.push('RakuCloud customer-facing no-bold rule');

const result = {
  ok: failures.length === 0,
  checks,
  failures,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
