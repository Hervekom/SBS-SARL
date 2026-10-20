-- ============================================================================
-- SBS SARL (Smart Business Services) – Schéma Supabase
-- Projet : https://eyftgsnmgnikrwvozrvx.supabase.co
-- Monnaie : FCFA (XAF). Script ré-exécutable (idempotent).
-- Ordre d'exécution dans le SQL Editor : 1) schema.sql  2) seed.sql
-- ============================================================================

-- 1. CATÉGORIES ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    headline TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PRODUITS -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || gen_random_uuid()::text),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE,
    sub_category TEXT,
    short_description TEXT,
    description TEXT NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    old_price INT CHECK (old_price IS NULL OR old_price >= price),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    brand TEXT,
    rating NUMERIC(2, 1) DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0,
    badge TEXT,
    image_url TEXT,
    attributes JSONB NOT NULL DEFAULT '{}'::jsonb,   -- ex: {"Stockage":"256 Go","Réseau":"5G"}
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_promotion BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. COMMANDES ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,                          -- ex: 'SBS-782910'
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Cameroun',
    city TEXT NOT NULL DEFAULT 'Douala',
    delivery_address TEXT NOT NULL,
    postal_code TEXT,
    shipping_method TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal INT NOT NULL,
    shipping_fee INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    total_amount INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'En préparation'
        CHECK (status IN ('En préparation', 'En transit', 'Livrée et reçue', 'Annulée')),
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    unit_price INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    selected_variant TEXT,
    total_price INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AVIS CLIENTS -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    author_name TEXT NOT NULL,
    location TEXT DEFAULT 'Douala, Cameroun',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,            -- publié après validation par SBS
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CODES PROMO & BANNIÈRES --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_percent INT NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    min_spend INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    button_text TEXT DEFAULT 'Voir la boutique',
    target_link TEXT DEFAULT '/smartphones',
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEX -----------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- SÉCURITÉ (RLS) ----------------------------------------------------------------
-- Le site public (clé anon) peut : lire le catalogue, créer une commande,
-- proposer un avis (non publié). Il ne peut PAS lire les commandes des clients.
-- La gestion (stock, prix, statut des commandes, validation des avis) se fait
-- depuis le tableau de bord Supabase (Table Editor).
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Reviews" ON public.reviews;
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "Public Insert Reviews" ON public.reviews;
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT TO anon, authenticated
    WITH CHECK (is_approved = false AND verified_purchase = false AND length(content) <= 2000);

DROP POLICY IF EXISTS "Public Read Banners" ON public.banners;
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Promotions" ON public.promotions;
CREATE POLICY "Public Read Promotions" ON public.promotions FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT TO anon, authenticated
    WITH CHECK (status = 'En préparation' AND total_amount >= 0);

DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT TO anon, authenticated
    WITH CHECK (quantity > 0 AND quantity <= 100);

-- Mise à jour automatique de updated_at -----------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated ON public.products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated ON public.orders;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
