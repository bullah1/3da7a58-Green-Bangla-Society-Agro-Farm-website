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
