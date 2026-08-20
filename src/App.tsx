import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Customer Pages
import { Home } from './pages/Home';
import { Bespoke } from './pages/Bespoke';
import { Alterations } from './pages/Alterations';
import { MensServices } from './pages/MensServices';
import { WomensServices } from './pages/WomensServices';
import { OurCraft } from './pages/OurCraft';
import { Contact } from './pages/Contact';
import { Consultation } from './pages/Consultation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AccountDashboard } from './pages/AccountDashboard';
import { RequestDetails } from './pages/RequestDetails';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLeads } from './pages/AdminLeads';
import { AdminLeadDetail } from './pages/AdminLeadDetail';
import { AdminRequests } from './pages/AdminRequests';

const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen pt-32 text-center text-secondary font-body-md">Verifying session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Routes>
      {/* Customer Public Routes */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/bespoke" element={<CustomerLayout><Bespoke /></CustomerLayout>} />
      <Route path="/alterations" element={<CustomerLayout><Alterations /></CustomerLayout>} />
      <Route path="/men" element={<CustomerLayout><MensServices /></CustomerLayout>} />
      <Route path="/women" element={<CustomerLayout><WomensServices /></CustomerLayout>} />
      <Route path="/craft" element={<CustomerLayout><OurCraft /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
      <Route path="/consultation" element={<CustomerLayout><Consultation /></CustomerLayout>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />

      {/* Customer Protected Routes */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Navbar />
            <AccountDashboard />
            <Footer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/consultations"
        element={
          <ProtectedRoute>
            <Navbar />
            <AccountDashboard />
            <Footer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/requests"
        element={
          <ProtectedRoute>
            <Navbar />
            <AccountDashboard />
            <Footer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/requests/:id"
        element={
          <ProtectedRoute>
            <Navbar />
            <RequestDetails />
            <Footer />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute adminOnly>
            <AdminLeads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminLeadDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <ProtectedRoute adminOnly>
            <AdminRequests />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
