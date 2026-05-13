-- ============================================================
-- AMON HEIGHTS LIMITED – SUPABASE DATABASE SETUP
-- Run this in your Supabase SQL Editor (in order)
-- ============================================================

-- 1. PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin','staff','viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin full access to profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'viewer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  property_type TEXT,
  listing_type TEXT CHECK (listing_type IN ('Sale','Rent','Shortlet','Land')),
  price NUMERIC,
  location TEXT,
  address TEXT,
  description TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking INTEGER,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available','Sold','Rented')),
  source TEXT DEFAULT 'Direct Listing',
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  video_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
-- Public can read available properties
CREATE POLICY "Public can read available properties" ON public.properties FOR SELECT USING (status = 'Available');
-- Staff can read all their own properties
CREATE POLICY "Staff can read own properties" ON public.properties FOR SELECT USING (created_by = auth.uid());
-- Admin can read all
CREATE POLICY "Admin can read all properties" ON public.properties FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Staff and admin can insert
CREATE POLICY "Staff and admin can insert properties" ON public.properties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
);
-- Staff can update own, admin can update all
CREATE POLICY "Staff can update own properties" ON public.properties FOR UPDATE USING (
  created_by = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Only admin can delete
CREATE POLICY "Admin can delete properties" ON public.properties FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_title TEXT,
  booking_type TEXT CHECK (booking_type IN ('meeting','inspection')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  message TEXT,
  inspection_fee_agreed BOOLEAN,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
-- Anyone can insert a booking
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
-- Admin can read/update all bookings
CREATE POLICY "Admin can read all bookings" ON public.bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit enquiry" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read enquiries" ON public.enquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update enquiries" ON public.enquiries FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. DIRECT LISTING REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.direct_listing_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  phone2 TEXT,
  email TEXT NOT NULL,
  residential_address TEXT,
  id_type TEXT,
  property_type TEXT,
  property_purpose TEXT,
  property_address TEXT,
  title_document TEXT,
  land_size TEXT,
  rooms_units TEXT,
  features_facilities TEXT,
  asking_price TEXT,
  rental_price TEXT,
  availability_date DATE,
  existing_tenants TEXT,
  tenant_until DATE,
  special_conditions TEXT,
  neighbourhood TEXT,
  road_access TEXT,
  utilities TEXT,
  other_info TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','reviewing','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.direct_listing_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit direct listing" ON public.direct_listing_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read direct listings" ON public.direct_listing_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update direct listings" ON public.direct_listing_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT,
  author TEXT,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admin can read all posts" ON public.blog_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can insert posts" ON public.blog_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update posts" ON public.blog_posts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can delete posts" ON public.blog_posts FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. STORAGE BUCKET for property images
-- Run in Supabase Dashboard > Storage > Create bucket: "property-images" (public)
-- Or use this SQL:
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Staff and admin can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'property-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
);
CREATE POLICY "Staff and admin can delete images" ON storage.objects FOR DELETE USING (
  bucket_id = 'property-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
);

-- 8. CREATE FIRST ADMIN USER
-- After running this SQL, go to Supabase Auth > Users > Create User
-- Email: admin@amonheights.online  Password: (set a strong one)
-- Then run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@amonheights.online';

-- ============================================================
-- SAMPLE DATA (optional - remove for production)
-- ============================================================
INSERT INTO public.properties (title, slug, property_type, listing_type, price, location, address, description, bedrooms, bathrooms, parking, status, source, is_featured, images, features, latitude, longitude)
VALUES
(
  '4 Bedroom Luxury Duplex in Guzape',
  '4-bedroom-luxury-duplex-guzape',
  'Duplex', 'Sale', 185000000,
  'Guzape', 'Plot 12, Guzape District, Abuja',
  'A stunning fully-detached luxury duplex in the prestigious Guzape District. Features modern finishes, spacious rooms, and a serene environment perfect for families.',
  4, 4, 3, 'Available', 'Direct Listing', true,
  ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85'],
  ARRAY['Swimming Pool','BQ / Boys Quarters','24/7 Security','CCTV','Standby Generator','Inverter System','Modern Kitchen'],
  9.0200, 7.4800
),
(
  'Luxury 3 Bedroom Apartment in Maitama',
  'luxury-3-bedroom-apartment-maitama',
  'Apartment', 'Rent', 4500000,
  'Maitama', '15 Maitama Close, Abuja',
  'Premium 3-bedroom apartment in the heart of Maitama. Perfect for executives and diplomats. All rooms en-suite with modern finishing.',
  3, 3, 2, 'Available', 'Affiliate', true,
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=85'],
  ARRAY['All Rooms En-suite','Air Conditioning','American Kitchen','Balcony','24/7 Security'],
  9.0800, 7.4900
),
(
  '2 Bedroom Shortlet Apartment in Wuse 2',
  '2-bedroom-shortlet-wuse-2',
  'Apartment', 'Shortlet', 35000,
  'Wuse', 'Plot 5, Wuse 2, Abuja',
  'Tastefully furnished 2-bedroom shortlet apartment. Ideal for short-stay visitors, business travellers and tourists. WiFi, generator backup, and great location.',
  2, 2, 1, 'Available', 'Direct Listing', false,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=85'],
  ARRAY['Fully Furnished','High-Speed WiFi','Generator Backup','Smart TV','Modern Kitchen','Weekly Cleaning'],
  9.0700, 7.4700
),
(
  '1000 sqm Plot of Land in Katampe Extension',
  '1000sqm-land-katampe-extension',
  'Land', 'Land', 65000000,
  'Katampe', 'Katampe Extension, Abuja',
  'Registered 1000 square meter plot of land in Katampe Extension with C of O. Perfect for residential development. Serene environment with excellent road access.',
  NULL, NULL, NULL, 'Available', 'Direct Listing', false,
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=85'],
  ARRAY['Certificate of Occupancy','Good Road Access','Flat Terrain','Close to main road','Peaceful neighbourhood'],
  9.0900, 7.4600
)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Setup complete! ✓' as message;
