import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import './styles/global.css'

import HomePage from './pages/client/HomePage'
import PropertiesPage from './pages/client/PropertiesPage'
import PropertyDetailPage from './pages/client/PropertyDetailPage'
import DirectListingsPage from './pages/client/DirectListingsPage'
import ListPropertyPage from './pages/client/ListPropertyPage'
import BlogPage from './pages/client/BlogPage'
import BlogPostPage from './pages/client/BlogPostPage'
import AboutPage from './pages/client/AboutPage'
import ContactPage from './pages/client/ContactPage'
import LocationPage from './pages/client/LocationPage'
import PrivacyPage from './pages/client/PrivacyPage'
import TermsPage from './pages/client/TermsPage'
import LoginPage from './pages/LoginPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProperties from './pages/admin/AdminProperties'
import AdminPropertyForm from './pages/admin/AdminPropertyForm'
import AdminBookings from './pages/admin/AdminBookings'
import AdminStaff from './pages/admin/AdminStaff'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminBlog from './pages/admin/AdminBlog'
import AdminBlogForm from './pages/admin/AdminBlogForm'
import AdminDirectListings from './pages/admin/AdminDirectListings'

import StaffDashboard from './pages/staff/StaffDashboard'
import StaffProperties from './pages/staff/StaffProperties'
import StaffPropertyForm from './pages/staff/StaffPropertyForm'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()

  // Still loading auth or profile — show spinner, do NOT redirect yet
  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--gray-400)', fontSize: '.9rem' }}>
          Loading...
        </p>
      </div>
    )
  }

  // Not logged in at all
  if (!user) return <Navigate to="/login" replace />

  // Profile not loaded yet — keep waiting
  if (!profile) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    )
  }

  // Admin-only route but user is not admin
  if (adminOnly && profile.role !== 'admin') {
    if (profile.role === 'staff') return <Navigate to="/staff" replace />
    return <Navigate to="/" replace />
  }

  return children
}

function StaffRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (!profile) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    )
  }

  if (profile.role !== 'staff' && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:slug" element={<PropertyDetailPage />} />
      <Route path="/direct-listings" element={<DirectListingsPage />} />
      <Route path="/list-property" element={<ListPropertyPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/location/:location" element={<LocationPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Staff */}
      <Route path="/staff" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
      <Route path="/staff/properties" element={<StaffRoute><StaffProperties /></StaffRoute>} />
      <Route path="/staff/properties/new" element={<StaffRoute><StaffPropertyForm /></StaffRoute>} />
      <Route path="/staff/properties/edit/:id" element={<StaffRoute><StaffPropertyForm /></StaffRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/properties" element={<ProtectedRoute adminOnly><AdminProperties /></ProtectedRoute>} />
      <Route path="/admin/properties/new" element={<ProtectedRoute adminOnly><AdminPropertyForm /></ProtectedRoute>} />
      <Route path="/admin/properties/edit/:id" element={<ProtectedRoute adminOnly><AdminPropertyForm /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute adminOnly><AdminStaff /></ProtectedRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedRoute adminOnly><AdminEnquiries /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute adminOnly><AdminBlog /></ProtectedRoute>} />
      <Route path="/admin/blog/new" element={<ProtectedRoute adminOnly><AdminBlogForm /></ProtectedRoute>} />
      <Route path="/admin/blog/edit/:id" element={<ProtectedRoute adminOnly><AdminBlogForm /></ProtectedRoute>} />
      <Route path="/admin/direct-listings" element={<ProtectedRoute adminOnly><AdminDirectListings /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'var(--font-body)', fontSize: '.87rem' }
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}