import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { SiteProvider } from '@/contexts/SiteContext';
import { ProjectsProvider } from '@/contexts/ProjectsContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Public Site Components
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { About } from '@/components/site/About';
import { Services } from '@/components/site/Services';
import { Testimonials } from '@/components/site/Testimonials';
import { Contacts } from '@/components/site/Contacts';
import { Footer } from '@/components/site/Footer';
import { ProjectPage } from '@/components/site/ProjectPage';
import { ProjectsPage } from '@/components/site/ProjectsPage';
import { CookieConsent } from '@/components/site/CookieConsent';
import { PrivacyPolicy } from '@/components/site/PrivacyPolicy';

// Admin Components
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Login } from '@/admin/pages/Login';
import { Dashboard } from '@/admin/pages/Dashboard';
import { HeroEditor } from '@/admin/pages/HeroEditor';
import { AboutEditor } from '@/admin/pages/AboutEditor';
import { ProjectsManager } from '@/admin/pages/ProjectsManager';
import { ServicesManager } from '@/admin/pages/ServicesManager';
import { TestimonialsManager } from '@/admin/pages/TestimonialsManager';
import { ContactsEditor } from '@/admin/pages/ContactsEditor';

// Public Home Page
function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}

// Protected Admin Route
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin" replace />;
}

// Public Admin Route (redirects if authenticated)
function PublicAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/admin/dashboard" replace />;
}

function App() {
  return (
    <SiteProvider>
      <ProjectsProvider>
        <AuthProvider>
          <HashRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <PublicAdminRoute>
                    <Login />
                  </PublicAdminRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="hero" element={<HeroEditor />} />
                <Route path="about" element={<AboutEditor />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="contacts" element={<ContactsEditor />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <CookieConsent />
          </HashRouter>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ProjectsProvider>
    </SiteProvider>
  );
}

export default App;
