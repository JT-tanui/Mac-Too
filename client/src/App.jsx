import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AdminLogin from './admin/login.jsx';
import Dashboard from './admin/Dashboard';
import BlogEditor from './admin/BlogEditor.jsx';
import ServiceEditor from './admin/ServiceEditor';
import PortfolioEditor from './admin/PortfolioEditor.jsx';
import TeamManager from './admin/TeamManager';
import Settings from './admin/Settings';
import NewsletterManager from './admin/NewsletterManager';
import ContactMessages from './admin/ContactMessages';
import TestimonialsManager from './admin/TestimonialsManager';
import ImageGallery from './admin/ImageGallery';
import ActivityLog from './admin/ActivityLog';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/admin/blog" element={<AdminLayout><BlogEditor /></AdminLayout>} />
                <Route path="/admin/services" element={<AdminLayout><ServiceEditor /></AdminLayout>} />
                <Route path="/admin/portfolio" element={<AdminLayout><PortfolioEditor /></AdminLayout>} />
                <Route path="/admin/team" element={<AdminLayout><TeamManager /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
                <Route path="/admin/newsletter" element={<AdminLayout><NewsletterManager /></AdminLayout>} />
                <Route path="/admin/messages" element={<AdminLayout><ContactMessages /></AdminLayout>} />
                <Route path="/admin/testimonials" element={<AdminLayout><TestimonialsManager /></AdminLayout>} />
                <Route path="/admin/gallery" element={<AdminLayout><ImageGallery /></AdminLayout>} />
                <Route path="/admin/activity" element={<AdminLayout><ActivityLog /></AdminLayout>} />
                
                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
