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
1. Supabase → **SQL Editor** → exécuter dans l'ordre `supabase/schema.sql`, `supabase/002_admin_suivi_stock.sql`, puis `supabase/seed.sql`.
   ⚠️ `seed.sql` réinitialise prix et stocks du catalogue de démonstration : ne le relancer que volontairement.
2. **Project Settings → API Keys** → copier la clé `anon public`.
3. Données gérées depuis le **Table Editor** :
   - `products` : prix, stock, `is_active` (masquer un produit), badges, `attributes` (filtres).
   - `orders` / `order_items` : commandes passées sur le site (statut à mettre à jour).
   - `reviews` : avis envoyés par les clients → passer `is_approved` à `true` pour les publier.

Sécurité (RLS) : le site public peut lire le catalogue, créer une commande et proposer un avis, mais ne peut pas lire les commandes.
Le stock baisse automatiquement à chaque commande et remonte si la commande passe en « Annulée ».

### Espace administrateur (`/admin`)
1. Supabase → **Authentication → Users → Add user** (e-mail + mot de passe, cocher « Auto confirm »).
2. SQL Editor :
   ```sql
   INSERT INTO public.admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'adresse@exemple.com'
   ON CONFLICT DO NOTHING;
   ```
3. Se connecter sur `/admin` : commandes (changement de statut, contact WhatsApp du client), produits (prix, stock, visibilité, ajout avec photo), avis (validation).

### Suivi de commande (`/suivi`)
Le client saisit son numéro de commande et son téléphone (fonction SQL `track_order`).

Régénérer `seed.sql` après modification du catalogue local : `npm run seed`.
`public/sitemap.xml` est régénéré automatiquement à chaque build.

## Déploiement Vercel
1. Vercel → **Add New → Project** → importer `Hervekom/SBS-SARL` (framework Vite détecté, `vercel.json` inclus).
2. **Environment Variables** :
   - `VITE_SUPABASE_URL` = `https://eyftgsnmgnikrwvozrvx.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = clé anon public
3. Deploy. Chaque `git push` sur `main` redéploie automatiquement.

Render n'est pas nécessaire : le site est 100 % statique (aucun serveur Node).

## Statistiques
`@vercel/analytics` est intégré : activer **Analytics** dans l'onglet du projet Vercel.

## À personnaliser avec SBS
- `src/data/products.ts` → `SHOP` (coordonnées reprises de la page Facebook : à confirmer), `SHIPPING_ZONES` (zones et frais de livraison), `PROMO_CODES`.
- Images : illustrations SVG dans `public/images/` (générées par `scripts/generate_product_visuals.py`) à remplacer par les vraies photos.
- Logo : `public/logo-sbs-icon.png`, `public/logo-sbs.png` (logo provisoire issu de la page Facebook).
- Avis de démonstration (« Client démo ») à supprimer quand les vrais avis arrivent.
