// Génère supabase/seed.sql à partir du catalogue local (npx tsx scripts/generate-seed.ts)
import { writeFileSync } from 'fs';
import { CATEGORIES, PRODUCTS, REVIEWS } from '../src/data/products';

const q = (v: unknown): string => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return `'${String(v).replace(/'/g, "''")}'`;
};
const json = (v: unknown) => `${q(JSON.stringify(v ?? {}))}::jsonb`;
const arr = (v: string[] = []) => (v.length ? `ARRAY[${v.map(q).join(', ')}]::text[]` : `ARRAY[]::text[]`);

let sql = `-- Données initiales SBS SARL (générées depuis src/data/products.ts)\n-- À exécuter après schema.sql et 002_admin_suivi_stock.sql. Ré-exécutable : met à jour les lignes existantes.\n\n`;

sql += `INSERT INTO public.categories (id, name, slug, headline, description, image_url, display_order) VALUES\n`;
sql += CATEGORIES.map((c, i) => `  (${q(c.id)}, ${q(c.name)}, ${q(c.slug)}, ${q(c.headline)}, ${q(c.description)}, ${q(c.image)}, ${i + 1})`).join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, headline = EXCLUDED.headline, description = EXCLUDED.description, image_url = EXCLUDED.image_url, display_order = EXCLUDED.display_order;\n\n`;

sql += `INSERT INTO public.products (id, name, slug, category_id, sub_category, short_description, description, price, old_price, stock, brand, rating, review_count, badge, image_url, attributes, options, specs, features, is_featured, is_new, is_best_seller, is_promotion, is_active, display_order) VALUES\n`;
sql += PRODUCTS.map((p, i) => {
  const { Marque, ...attrs } = p.attributes || {};
  void Marque;
  return `  (${q(p.id)}, ${q(p.name)}, ${q(p.slug)}, ${q(p.category_id)}, ${q(p.sub_category)}, ${q(p.short_description)}, ${q(p.description)}, ${p.price}, ${q(p.old_price ?? null)}, ${p.stock ?? 0}, ${q(p.brand)}, ${p.rating}, ${p.review_count}, ${q(p.badge ?? null)}, ${q(p.image_url)}, ${json(attrs)}, ${p.options ? json(p.options) : 'NULL'}, ${json(p.specs)}, ${arr(p.features)}, ${q(Boolean(p.is_popular))}, ${q(Boolean(p.is_new))}, ${q(Boolean(p.is_popular))}, ${q(Boolean(p.is_promotion))}, true, ${i + 1})`;
}).join(',\n');
sql += `\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, category_id = EXCLUDED.category_id, sub_category = EXCLUDED.sub_category, short_description = EXCLUDED.short_description, description = EXCLUDED.description, price = EXCLUDED.price, old_price = EXCLUDED.old_price, stock = EXCLUDED.stock, brand = EXCLUDED.brand, rating = EXCLUDED.rating, review_count = EXCLUDED.review_count, badge = EXCLUDED.badge, image_url = EXCLUDED.image_url, attributes = EXCLUDED.attributes, options = EXCLUDED.options, specs = EXCLUDED.specs, features = EXCLUDED.features, is_featured = EXCLUDED.is_featured, is_new = EXCLUDED.is_new, is_best_seller = EXCLUDED.is_best_seller, is_promotion = EXCLUDED.is_promotion, display_order = EXCLUDED.display_order, updated_at = now();\n\n`;

sql += `-- Avis de démonstration (à supprimer quand les vrais avis arrivent)\nDELETE FROM public.reviews WHERE author_name LIKE 'Client démo%';\n`;
sql += `INSERT INTO public.reviews (product_name, author_name, location, rating, title, content, verified_purchase, is_approved) VALUES\n`;
sql += REVIEWS.map((r) => `  (${q(r.productName)}, ${q(r.author)}, ${q(r.location)}, ${r.rating}, ${q(r.title)}, ${q(r.content)}, false, true)`).join(',\n');
sql += `;\n\nINSERT INTO public.promotions (code, discount_percent, min_spend) VALUES ('SBS10', 10, 0) ON CONFLICT (code) DO NOTHING;\n`;

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log('supabase/seed.sql généré :', PRODUCTS.length, 'produits');
