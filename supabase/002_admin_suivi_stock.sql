-- ============================================================================
-- SBS SARL – Mise à jour 002 : variantes, suivi de commande, stock automatique,
-- espace administrateur sécurisé et stockage des photos produits.
-- À exécuter après schema.sql (ré-exécutable).
-- ============================================================================

-- 1. Variantes produit (stockage, couleur, modèle…) ---------------------------
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS options JSONB;

-- 2. Administrateurs -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin reads own row" ON public.admin_users;
CREATE POLICY "Admin reads own row" ON public.admin_users FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
    SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = (SELECT auth.uid()));
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Droits complets des administrateurs
DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products" ON public.products FOR ALL TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin read orders" ON public.orders;
CREATE POLICY "Admin read orders" ON public.orders FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin delete orders" ON public.orders;
CREATE POLICY "Admin delete orders" ON public.orders FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin read order items" ON public.order_items;
CREATE POLICY "Admin read order items" ON public.order_items FOR SELECT TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin read reviews" ON public.reviews;
CREATE POLICY "Admin read reviews" ON public.reviews FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin update reviews" ON public.reviews;
CREATE POLICY "Admin update reviews" ON public.reviews FOR UPDATE TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin delete reviews" ON public.reviews;
CREATE POLICY "Admin delete reviews" ON public.reviews FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage promotions" ON public.promotions;
CREATE POLICY "Admin manage promotions" ON public.promotions FOR ALL TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "Admin manage banners" ON public.banners;
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL TO authenticated
    USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

-- 3. Lignes de commande : uniquement pour une commande créée il y a moins de 15 min
CREATE OR REPLACE FUNCTION public.order_is_recent(p_order_id TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.orders
        WHERE id = p_order_id AND created_at > now() - interval '15 minutes'
    );
$$;
GRANT EXECUTE ON FUNCTION public.order_is_recent(TEXT) TO anon, authenticated;

DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT TO anon, authenticated
    WITH CHECK (quantity > 0 AND quantity <= 20 AND public.order_is_recent(order_id));

-- 4. Stock automatique ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_stock()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
    IF NEW.product_id IS NOT NULL THEN
        UPDATE public.products SET stock = GREATEST(stock - NEW.quantity, 0) WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.decrement_stock() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_order_items_stock ON public.order_items;
CREATE TRIGGER trg_order_items_stock AFTER INSERT ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION public.decrement_stock();

-- Remise en stock si la commande est annulée
CREATE OR REPLACE FUNCTION public.restock_cancelled_order()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
    IF NEW.status = 'Annulée' AND OLD.status <> 'Annulée' THEN
        UPDATE public.products p
           SET stock = p.stock + i.quantity
          FROM public.order_items i
         WHERE i.order_id = NEW.id AND p.id = i.product_id;
    END IF;
    RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.restock_cancelled_order() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_orders_restock ON public.orders;
CREATE TRIGGER trg_orders_restock AFTER UPDATE OF status ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.restock_cancelled_order();

-- 5. Suivi de commande sans compte (n° de commande + 8 derniers chiffres du téléphone)
CREATE OR REPLACE FUNCTION public.track_order(p_order_id TEXT, p_phone TEXT)
RETURNS TABLE (
    id TEXT, status TEXT, created_at TIMESTAMPTZ, total_amount INT,
    shipping_method TEXT, payment_method TEXT, city TEXT, items JSONB
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
    SELECT o.id, o.status, o.created_at, o.total_amount, o.shipping_method, o.payment_method, o.city,
           COALESCE((
               SELECT jsonb_agg(jsonb_build_object('name', i.product_name, 'quantity', i.quantity, 'variant', i.selected_variant))
               FROM public.order_items i WHERE i.order_id = o.id
           ), '[]'::jsonb)
    FROM public.orders o
    WHERE o.id = upper(trim(p_order_id))
      AND length(regexp_replace(p_phone, '\D', '', 'g')) >= 8
      AND right(regexp_replace(o.phone, '\D', '', 'g'), 8) = right(regexp_replace(p_phone, '\D', '', 'g'), 8);
$$;
GRANT EXECUTE ON FUNCTION public.track_order(TEXT, TEXT) TO anon, authenticated;

-- 6. Photos produits (bucket public en lecture, écriture réservée aux admins)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Admin upload product images" ON storage.objects;
CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'products' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin update product images" ON storage.objects;
CREATE POLICY "Admin update product images" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'products' AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admin delete product images" ON storage.objects;
CREATE POLICY "Admin delete product images" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'products' AND (SELECT public.is_admin()));

-- ============================================================================
-- Pour nommer un administrateur (après avoir créé l'utilisateur dans
-- Authentication > Users > Add user) :
--   INSERT INTO public.admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = 'adresse@exemple.com'
--   ON CONFLICT DO NOTHING;
-- ============================================================================
