-- Green Bangla Society — full database setup for a NEW, empty Supabase project.
-- Run once: Supabase dashboard → SQL Editor → paste everything → Run.

-- ═════ 1. Roles, admin check, products ═════
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Grocery',
  price numeric(12,2) NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'per kg',
  available boolean NOT NULL DEFAULT true,
  image text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.products (name, category, price, unit, available, image, description, sort_order) VALUES
('Organic Red Lentil (Masoor) 1kg','Grocery',165,'per kg',true,'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?auto=format&fit=crop&w=800&q=70','Cleaned, stone-free red lentil sourced from our contract farmers. Cooks fast and holds a rich colour.',1),
('Farm Fresh Brown Eggs (30 pcs)','Poultry',420,'per tray',true,'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=70','Eggs collected every morning from our deshi-cross layer sheds, packed in a 30-piece tray.',2),
('Pure Mustard Oil (Ghani) 1L','Grocery',340,'per litre',true,'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=70','Cold-pressed in a traditional wooden ghani, no blending and no added preservatives.',3),
('Live Desi Chicken','Poultry',620,'per kg',true,'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=70','Free-range deshi chicken raised without growth hormones. Live weight, dressed on request.',4),
('Sundarban Natural Honey 500g','Specialty',850,'per jar',true,'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&w=800&q=70','Wild honey collected from the Sundarban belt during the season. Raw and unpasteurised.',5),
('Fresh Tilapia Fish','Fishery',240,'per kg',true,'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=70','Pond-raised tilapia harvested the same morning and delivered on ice.',6),
('Mango Grafted Sapling (Amrapali)','Nursery',180,'per plant',true,'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=70','Grafted Amrapali mango sapling, ready to plant and fruiting within two to three years.',7),
('Raw Cow Milk (Chilled) 1L','Livestock',110,'per litre',true,'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=70','Chilled raw cow milk from our dairy unit, tested for fat and free of any added water.',8),
('Organic Vermicompost 5kg','Agro Input',250,'per bag',true,'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=70','Earthworm-processed organic compost that improves soil structure and holds moisture.',9),
('Seasonal Vegetable Combo Box','Crop',550,'per box',true,'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=70','A weekly box of five to seven seasonal vegetables picked from the farm the day of delivery.',10),
('Amin Rice (Fine Grain) 5kg','Grocery',420,'per 5kg',true,'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70','Fine grain Amin rice, milled in small batches and sifted clean.',11),
('Broiler Chicken (Dressed)','Poultry',230,'per kg',true,'https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&w=800&q=70','Farm-raised broiler, dressed and cleaned to order for same-day delivery.',12),
('Fresh Pangas Fish','Fishery',180,'per kg',true,'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=70','Fresh pangas from our own ponds, cut to your preferred size on request.',13),
('Hybrid Tomato Sapling','Nursery',12,'per plant',true,'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=800&q=70','Disease-resistant hybrid tomato sapling suitable for both field and rooftop growing.',14),
('Pure Cow Ghee 250g','Livestock',680,'per jar',true,'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=70','Slow-cooked ghee from our own cow milk, with a natural grainy texture and deep aroma.',15),
('Organic Paddy Seed (BR-28) 1kg','Agro Input',195,'per kg',true,'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=70','Certified BR-28 paddy seed with high germination for the boro season.',16),
('Fresh Duck Eggs (Hans er Dim) 12 pcs','Poultry',180,'per dozen',true,'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=70','Duck eggs from our open-water flock, richer in yolk than hen eggs.',17),
('Pointed Gourd (Potol) 1kg','Crop',90,'per kg',true,'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=70','Tender potol harvested young, ideal for curries and stuffed dishes.',18),
('Turmeric Powder (Haldi) 250g','Grocery',145,'per packet',true,'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=70','Sun-dried turmeric ground in small batches, no colour or filler added.',19),
('Rui Fish (Fresh)','Fishery',380,'per kg',false,'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=70','Full-grown Rui from our fishery ponds. Restocked with each fresh harvest.',20),
('Lemon Grass Plant','Nursery',55,'per plant',true,'https://images.unsplash.com/photo-1599599810769-bcde5a160d66?auto=format&fit=crop&w=800&q=70','Healthy lemon grass plant for tea and cooking, grows well in pots.',21),
('Bio Fertilizer Mix 1kg','Agro Input',120,'per packet',true,'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=70','Balanced bio fertiliser blend for vegetables and fruit plants, safe for organic plots.',22),
('Black Chickpea (Chhola) 1kg','Grocery',140,'per kg',true,'https://images.unsplash.com/photo-1515543908654-735b99a371a9?auto=format&fit=crop&w=800&q=70','Whole black chickpea, hand-sorted and graded for even cooking.',23),
('Farm Fresh Cucumber 1kg','Crop',60,'per kg',true,'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=800&q=70','Crisp cucumber picked at first light, unwaxed and unsprayed after harvest.',24);

-- ═════ 2. Lock down helper functions ═════
REVOKE ALL ON FUNCTION public.grant_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- ═════ 3. Product photo storage ═════
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', false)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read product images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- ═════ 4. Online applications and DPS/FDR rates ═════
-- Online applications (from the website form) and editable DPS/FDR schemes.

-- ───────────────────────── Applications ─────────────────────────
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  phone text NOT NULL CHECK (char_length(btrim(phone)) BETWEEN 6 AND 30),
  email text CHECK (email IS NULL OR char_length(email) <= 160),
  address text CHECK (address IS NULL OR char_length(address) <= 300),
  service text NOT NULL CHECK (char_length(service) <= 60),
  amount text CHECK (amount IS NULL OR char_length(amount) <= 30),
  message text CHECK (message IS NULL OR char_length(message) <= 2000),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'approved', 'rejected')),
  admin_note text CHECK (admin_note IS NULL OR char_length(admin_note) <= 2000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_created_at_idx ON public.applications (created_at DESC);
CREATE INDEX applications_status_idx ON public.applications (status);

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone may submit, but only as a fresh application with no admin fields set.
CREATE POLICY "Anyone can submit an application" ON public.applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND admin_note IS NULL);

CREATE POLICY "Admins can read applications" ON public.applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications" ON public.applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications" ON public.applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ───────────────────────── Schemes (DPS / FDR) ─────────────────────────
CREATE TABLE public.schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('dps', 'fdr')),
  years integer NOT NULL CHECK (years BETWEEN 1 AND 30),
  rate numeric(5,2) NOT NULL CHECK (rate >= 0 AND rate <= 50),
  min_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (min_amount >= 0),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, years)
);

GRANT SELECT ON public.schemes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schemes TO authenticated;
GRANT ALL ON public.schemes TO service_role;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

-- The public site shows active schemes; admins also see inactive ones.
CREATE POLICY "Active schemes are publicly readable" ON public.schemes
  FOR SELECT TO anon, authenticated USING (active);

CREATE POLICY "Admins can read all schemes" ON public.schemes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert schemes" ON public.schemes
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update schemes" ON public.schemes
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete schemes" ON public.schemes
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Current rates from the website, so nothing changes until the owner edits them.
INSERT INTO public.schemes (kind, years, rate, min_amount, sort_order) VALUES
  ('dps', 3, 8.0, 500, 1),
  ('dps', 5, 9.0, 1000, 2),
  ('dps', 10, 10.0, 1000, 3),
  ('fdr', 1, 9.0, 25000, 1),
  ('fdr', 2, 9.5, 25000, 2),
  ('fdr', 3, 10.0, 25000, 3),
  ('fdr', 5, 11.0, 25000, 4);

-- ═════ 5. Site settings and banner images ═════
-- Site settings (contact info, home banner text/images, home numbers) editable from admin.

CREATE TABLE public.site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are publicly readable" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Empty row: the website uses its built-in text until the owner saves changes.
INSERT INTO public.site_settings (id, data) VALUES (1, '{}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

-- Public bucket for banner and page images (anyone can view, only admins can change).
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload site images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));
