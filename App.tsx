import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/site/Home';
import ProductsPage from './pages/site/ProductsPage';
import AboutPage from './pages/site/AboutPage';
import TrabalheConoscoPage from './pages/site/TrabalheConosco';
import PublicFormFuncionario from './pages/site/PublicFormFuncionario';

import AdminLogin from './pages/admin/AdminLogin';
import DashboardPage from './pages/admin/Dashboard';
import FeedbacksPage from './pages/admin/Feedbacks';
import FuncionariosPage from './pages/admin/Funcionarios';
import CatalogoPage from './pages/admin/Catalogo';
import EscalaPage from './pages/admin/Escala';
import FichaTecnicaPage from './pages/admin/FichaTecnica';
import CurriculosPage from './pages/admin/Curriculos';

import AdminLayout from './components/admin/AdminLayout';
import PublicLayout from './components/site/PublicLayout';

import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import CartSidebar from './components/site/CartSidebar';
import ScrollToTop from './components/UI/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/produtos" element={<ProductsPage />} />
                <Route path="/quemsomos" element={<AboutPage />} />
                <Route path="/curriculo" element={<TrabalheConoscoPage />} />
              </Route>

              {/* Standalone routes - sem Header/Footer */}
              <Route path="/form-funcionario" element={<PublicFormFuncionario />} />

              {/* Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="produtos" element={<CatalogoPage />} />
                <Route path="feedbacks" element={<FeedbacksPage />} />
                <Route path="funcionarios" element={<FuncionariosPage />} />
                <Route path="escala" element={<EscalaPage />} />
                <Route path="fichatecnica" element={<FichaTecnicaPage />} />
                <Route path="curriculos" element={<CurriculosPage />} />
              </Route>
            </Routes>
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

