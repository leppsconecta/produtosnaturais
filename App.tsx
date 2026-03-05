/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import { CartProvider } from './context/CartContext';
import CartSidebar from './components/CartSidebar';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/quemsomos" element={<AboutPage />} />
        </Routes>
        <CartSidebar />
      </Router>
    </CartProvider>
  );
}
