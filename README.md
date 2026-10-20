# SBS SARL – Boutique e-commerce

Site e-commerce de **Smart Business Services SARL** (Douala, Cameroun) : téléphones, pochettes & verres trempés, montres connectées, chargeurs et gadgets électroniques.

- Stack : React 19 + Vite + Tailwind CSS 4 + Supabase
- Thème : blanc · orange `#F26B1D` · or `#D4A017` · noir `#111111` — prix en FCFA

## Lancer en local
```bash
npm install
cp .env.example .env.local   # puis coller la clé anon Supabase
npm run dev                  # http://localhost:3000
```
Sans clé Supabase, le site tourne en **mode démo** avec le catalogue local (`src/data/products.ts`).

## Supabase (projet `eyftgsnmgnikrwvozrvx`)
1. Supabase → **SQL Editor** → exécuter `supabase/schema.sql`, puis `supabase/seed.sql`.
2. **Project Settings → API Keys** → copier la clé `anon public`.
3. Données gérées depuis le **Table Editor** :
   - `products` : prix, stock, `is_active` (masquer un produit), badges, `attributes` (filtres).
   - `orders` / `order_items` : commandes passées sur le site (statut à mettre à jour).
   - `reviews` : avis envoyés par les clients → passer `is_approved` à `true` pour les publier.

Sécurité (RLS) : le site public peut lire le catalogue, créer une commande et proposer un avis, mais ne peut pas lire les commandes.

Régénérer `seed.sql` après modification du catalogue local : `npx tsx scripts/generate-seed.ts`.

## Déploiement Vercel
1. Vercel → **Add New → Project** → importer `Hervekom/SBS-SARL` (framework Vite détecté, `vercel.json` inclus).
2. **Environment Variables** :
   - `VITE_SUPABASE_URL` = `https://eyftgsnmgnikrwvozrvx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = clé anon public
3. Deploy. Chaque `git push` sur `main` redéploie automatiquement.

Render n'est pas nécessaire : le site est 100 % statique (aucun serveur Node).

## À personnaliser avec SBS
- `src/data/products.ts` → `SHOP` : numéro WhatsApp, téléphone, adresse, horaires, code promo, seuil de livraison gratuite.
- Images : illustrations SVG dans `public/images/` (générées par `scripts/generate_product_visuals.py`) à remplacer par les vraies photos.
- Logo : `public/logo-sbs-icon.png`, `public/logo-sbs.png` (logo provisoire issu de la page Facebook).
- Avis de démonstration (« Client démo ») à supprimer quand les vrais avis arrivent.
