# Amon Heights Limited – Real Estate Web App

Premium real estate platform for Abuja, Nigeria.

## 🚀 Tech Stack
- **Frontend:** React + Vite
- **Backend:** Supabase (Auth, Database, Storage)
- **Hosting:** Netlify
- **Domain:** amonheights.online
- **Maps:** Google Maps API
- **Email:** Resend

---

## ⚡ Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/your-org/amon-heights.git
cd amon-heights
npm install
```

### 2. Environment Variables
Create `.env.local` in the root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire `SUPABASE_SETUP.sql` file
3. Go to **Storage** → ensure `property-images` bucket is created (public)
4. Go to **Authentication > Users** → create your admin user
5. Run: `UPDATE profiles SET role = 'admin' WHERE email = 'admin@amonheights.online';`

### 4. Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps JavaScript API**
3. Create an API key and restrict to your domain
4. Add to `.env.local`

### 5. Run Locally
```bash
npm run dev
```

### 6. Deploy to Netlify
1. Push to GitHub
2. Connect repo in Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

---

## 📂 Project Structure
```
src/
  components/
    layout/     # Navbar, Footer, Admin/Staff layouts
    shared/     # PropertyCard, BookingModal, Maps, Forms
  context/      # AuthContext (auth state)
  lib/          # supabase.js, constants.js, utils.js
  pages/
    client/     # Public pages (Home, Properties, Contact, etc.)
    admin/      # Admin dashboard pages
    staff/      # Staff portal pages
  styles/       # Global CSS
```

---

## 🔑 User Roles
| Role  | Access |
|-------|--------|
| Public | Browse properties, submit bookings & enquiries |
| Staff | Upload & manage own properties, pin on map |
| Admin | Full access: all properties, bookings, staff, blog, direct listings |

## 📞 Contact
- Phone/WhatsApp: 08137868434 / 09012265157
- Email: info@amonheights.online
- Address: Holborn House, Suite 106, Plot 649 Franca Afegbua Crescent, Zone E, Apo, Abuja

