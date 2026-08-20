-- 002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- Services Policies
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Leads Policies
CREATE POLICY "Public can submit leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage leads" ON leads FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Lead Attachments Policies
CREATE POLICY "Public can submit lead attachments" ON lead_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage lead attachments" ON lead_attachments FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Customers Policies
CREATE POLICY "Admins can manage customers" ON customers FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own customer record" ON customers FOR SELECT USING (user_id = auth.uid());

-- Measurements Policies
CREATE POLICY "Admins can manage measurements" ON measurements FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own measurements" ON measurements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers WHERE id = measurements.customer_id AND user_id = auth.uid()
  )
);

-- Appointments Policies
CREATE POLICY "Public can request appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage appointments" ON appointments FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers WHERE id = appointments.customer_id AND user_id = auth.uid()
  )
);

-- Orders Policies
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers WHERE id = orders.customer_id AND user_id = auth.uid()
  )
);

-- Portfolio Items Policies
CREATE POLICY "Public can view published portfolio items" ON portfolio_items FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage portfolio items" ON portfolio_items FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Portfolio Images Policies
CREATE POLICY "Public can view published portfolio images" ON portfolio_images FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM portfolio_items WHERE id = portfolio_images.portfolio_id AND is_published = true
  )
);
CREATE POLICY "Admins can manage portfolio images" ON portfolio_images FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Reviews Policies
CREATE POLICY "Public can submit reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'APPROVED' AND consent_to_publish = true);
CREATE POLICY "Admins can manage reviews" ON reviews FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers WHERE id = reviews.customer_id AND user_id = auth.uid()
  )
);

-- Blog Posts Policies
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- FAQs Policies
CREATE POLICY "Public can view active FAQs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage FAQs" ON faqs FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Admin Notes Policies
CREATE POLICY "Admins can manage admin notes" ON admin_notes FOR ALL USING (is_admin()) WITH CHECK (is_admin());
-- NEVER PUBLICLY ACCESSIBLE

-- Notifications Policies
CREATE POLICY "Admins can manage notifications" ON notifications FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
