// Génère public/sitemap.xml à partir du catalogue (lancé automatiquement avant chaque build)
import { writeFileSync } from 'fs';
import { CATEGORIES, PRODUCTS, SITE_URL } from '../src/data/products';

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: '/', priority: '1.0' },
  ...CATEGORIES.map((c) => ({ loc: `/${c.slug}`, priority: '0.8' })),
  { loc: '/promotions', priority: '0.7' },
  ...PRODUCTS.map((p) => ({ loc: `/produit/${p.slug}`, priority: '0.6' })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml : ${urls.length} URL`);
