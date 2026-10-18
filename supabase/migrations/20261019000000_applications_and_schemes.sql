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
