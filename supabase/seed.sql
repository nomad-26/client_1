-- seed.sql

-- Safe development seed data

-- Clean up first (if needed, but mostly for fresh instances)
TRUNCATE TABLE faqs, blog_posts, reviews, portfolio_images, portfolio_items, services CASCADE;

-- Insert Services
INSERT INTO services (name, slug, short_description, description, is_active, display_order)
VALUES 
  ('Bespoke Tailoring', 'bespoke-tailoring', 'Exquisite custom-made garments', 'Full bespoke experience from consultation to final fitting.', true, 1),
  ('Coat Stitching', 'coat-stitching', 'Premium customized coats', 'Tailored coats crafted for perfection and warmth.', true, 2),
  ('Suit & Blazer Tailoring', 'suit-blazer-tailoring', 'Classic suits and blazers', 'Perfectly fitted suits and blazers for every occasion.', true, 3),
  ('Luxury Alterations', 'luxury-alterations', 'High-end alteration services', 'Expert adjustments to your luxury garments.', true, 4),
  ('Lehenga Stitching', 'lehenga-stitching', 'Custom lehengas', 'Beautifully crafted custom lehengas with intricate detailing.', true, 5),
  ('Bridal Tailoring', 'bridal-tailoring', 'Exclusive bridal wear', 'Making your special day perfect with our tailored wedding attire.', true, 6),
  ('Custom Designs', 'custom-designs', 'Bring your vision to life', 'Work with our designers to create something completely unique.', true, 7),
  ('Doorstep Service', 'doorstep-service', 'Tailoring at your convenience', 'We bring the bespoke experience right to your doorstep.', true, 8);

-- Insert Sample Portfolio
INSERT INTO portfolio_items (title, slug, description, category, tags, is_published, display_order)
VALUES 
  ('Midnight Blue Velvet Suit', 'midnight-blue-velvet-suit', 'A classic midnight blue velvet suit for an evening gala.', 'Suits', ARRAY['Velvet', 'Evening', 'Bespoke'], true, 1),
  ('Bridal Lehenga in Crimson', 'bridal-lehenga-crimson', 'An exquisite crimson bridal lehenga with heavy zari work.', 'Bridal', ARRAY['Bridal', 'Lehenga', 'Embroidery'], true, 2);

-- Insert Sample FAQ
INSERT INTO faqs (question, answer, category, display_order, is_active)
VALUES 
  ('How long does a bespoke suit take?', 'Typically, a bespoke suit takes 4 to 6 weeks, including multiple fittings.', 'General', 1, true),
  ('Do you offer doorstep measurements?', 'Yes, we provide doorstep measurement services for an additional fee.', 'Services', 2, true);

-- Insert Sample Blog Post
INSERT INTO blog_posts (title, slug, excerpt, content, is_published, published_at)
VALUES 
  ('The Art of Bespoke Tailoring', 'the-art-of-bespoke-tailoring', 'Learn what makes bespoke tailoring a truly unique experience.', '<p>Bespoke tailoring is about creating a garment that is perfectly molded to your body and style preferences...</p>', true, now());

-- Insert Sample Approved Review
INSERT INTO reviews (customer_name, rating, review_text, consent_to_publish, status)
VALUES 
  ('John Doe', 5, 'The suit fits perfectly! The attention to detail is remarkable.', true, 'APPROVED');
