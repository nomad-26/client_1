-- 003_storage.sql

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('portfolio-images', 'portfolio-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('customer-images', 'customer-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('lead-attachments', 'lead-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('review-images', 'review-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('blog-images', 'blog-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Policies for portfolio-images (Public)
CREATE POLICY "Portfolio Images Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Portfolio Images Admin All" ON storage.objects FOR ALL USING (bucket_id = 'portfolio-images' AND is_admin()) WITH CHECK (bucket_id = 'portfolio-images' AND is_admin());

-- Policies for customer-images (Private)
CREATE POLICY "Customer Images Admin All" ON storage.objects FOR ALL USING (bucket_id = 'customer-images' AND is_admin()) WITH CHECK (bucket_id = 'customer-images' AND is_admin());
CREATE POLICY "Customer Images User Select" ON storage.objects FOR SELECT USING (bucket_id = 'customer-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policies for lead-attachments (Private)
CREATE POLICY "Lead Attachments Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'lead-attachments');
CREATE POLICY "Lead Attachments Admin All" ON storage.objects FOR ALL USING (bucket_id = 'lead-attachments' AND is_admin()) WITH CHECK (bucket_id = 'lead-attachments' AND is_admin());

-- Policies for review-images (Public)
CREATE POLICY "Review Images Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
CREATE POLICY "Review Images Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-images');
CREATE POLICY "Review Images Admin All" ON storage.objects FOR ALL USING (bucket_id = 'review-images' AND is_admin()) WITH CHECK (bucket_id = 'review-images' AND is_admin());

-- Policies for blog-images (Public)
CREATE POLICY "Blog Images Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Blog Images Admin All" ON storage.objects FOR ALL USING (bucket_id = 'blog-images' AND is_admin()) WITH CHECK (bucket_id = 'blog-images' AND is_admin());
