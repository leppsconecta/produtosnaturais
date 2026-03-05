import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, ChevronLeft, ChevronRight, Plus, Minus, X } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import FloatingWhatsApp from '../../src/components/FloatingWhatsApp';
import { categories, products } from '../data/products';
import { useCart } from '../context/CartContext';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [flyingImage, setFlyingImage] = useState<{ src: string, x: number, y: number } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setFlyingImage({ src: product.img, x: rect.left, y: rect.top });

    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));

    setTimeout(() => setFlyingImage(null), 1000);
  };

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleNextProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % filteredProducts.length;
    setSelectedProduct(filteredProducts[nextIndex]);
  };

  const handlePrevProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + filteredProducts.length) % filteredProducts.length;
    setSelectedProduct(filteredProducts[prevIndex]);
  };

  return (
    <div className="min-h-screen font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900 bg-offwhite">
      {/* Flying Image Animation */}
      <AnimatePresence>
        {flyingImage && (
          <motion.img
            src={flyingImage.src}
            initial={{
              position: 'fixed',
              top: flyingImage.y,
              left: flyingImage.x,
              width: 60,
              height: 60,
              opacity: 1,
              zIndex: 9999,
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            animate={{
              top: 20,
              left: window.innerWidth - 60, // Approximate cart position
              width: 20,
              height: 20,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`product-${selectedProduct.id}`}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <X className="w-6 h-6 text-olive-900" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevProduct}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md hidden md:block"
              >
                <ChevronLeft className="w-6 h-6 text-olive-900" />
              </button>
              <button
                onClick={handleNextProduct}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-md hidden md:block"
              >
                <ChevronRight className="w-6 h-6 text-olive-900" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-earth-100">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <span className="text-sm font-bold text-mustard-600 uppercase tracking-wider bg-mustard-500/10 px-3 py-1 rounded-full">
                    {categories.find(c => c.id === selectedProduct.category)?.name}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-olive-900 mb-2">{selectedProduct.name}</h2>
                <p className="text-earth-500 font-medium mb-6">{selectedProduct.weight}</p>

                <div className="prose prose-earth mb-8">
                  <p className="text-earth-800 leading-relaxed">{selectedProduct.desc}</p>
                </div>

                <div className="mt-auto pt-6 border-t border-earth-100">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-earth-600">Quantidade:</span>
                    <div className="flex items-center gap-3 bg-earth-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-olive-900 w-8 text-center text-lg">{quantities[selectedProduct.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      handleAddToCart(selectedProduct, e);
                      handleCloseModal();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-mustard-500 hover:bg-mustard-600 text-olive-900 rounded-xl text-lg font-bold transition-colors shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>

                  {/* Mobile Navigation */}
                  <div className="flex justify-between mt-6 md:hidden">
                    <button
                      onClick={handlePrevProduct}
                      className="flex items-center gap-2 text-earth-600 hover:text-olive-900 font-medium"
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    <button
                      onClick={handleNextProduct}
                      className="flex items-center gap-2 text-earth-600 hover:text-olive-900 font-medium"
                    >
                      Próximo <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Navbar />

      <main className="pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-lg text-earth-800 max-w-2xl mx-auto">
            Selecionamos os melhores ingredientes da natureza para levar sabor, saúde e bem-estar para o seu dia a dia
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setActiveCategory('todos'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === 'todos'
                ? 'bg-olive-900 text-white shadow-md'
                : 'bg-white text-earth-800 hover:bg-earth-100 border border-earth-200'
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                  ? 'bg-olive-700 text-white shadow-md'
                  : 'bg-white text-earth-800 hover:bg-earth-100 border border-earth-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-earth-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="block w-full pl-10 pr-3 py-2 border border-earth-200 rounded-full leading-5 bg-white placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-mustard-500 focus:border-mustard-500 sm:text-sm transition-shadow shadow-sm"
            />
          </div>
        </div>

        {/* Product Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-earth-100 flex flex-col h-full"
                >
                  <div className="relative h-32 md:h-48 overflow-hidden">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-olive-900 shadow-sm">
                      {product.weight}
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-mustard-600 uppercase tracking-wider bg-mustard-500/10 px-2 py-1 rounded-md">
                        {categories.find(c => c.id === product.category)?.name}
                      </span>
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-olive-900 mb-1 md:mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-earth-800 text-xs md:text-sm mb-2 line-clamp-2">{product.desc}</p>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-xs text-mustard-600 font-bold hover:underline mb-4 text-left"
                    >
                      Ver mais
                    </button>

                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3 bg-earth-50 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-olive-900 w-6 text-center">{quantities[product.id] || 1}</span>
                        <button
                          onClick={() => handleQuantityChange(product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex items-center justify-center gap-2 w-full py-2 md:py-3 px-3 md:px-4 bg-mustard-500 hover:bg-mustard-600 text-olive-900 rounded-xl text-xs md:text-sm font-bold transition-colors shadow-md hover:shadow-lg"
                      >
                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-earth-500">Nenhum produto encontrado.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-earth-200 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-olive-900"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-earth-800 font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-earth-200 hover:bg-earth-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-olive-900"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
