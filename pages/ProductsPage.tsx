import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, Search, ChevronLeft, ChevronRight, Plus, Minus, X, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { useCart } from '../context/CartContext';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, removeFromCart, cart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [flyingImage, setFlyingImage] = useState<{ src: string, x: number, y: number } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(res => res.json()).then(setCategories).catch(console.error);
    fetch('/api/products?public=true').then(res => res.json()).then(data => {
      // Ensure alphabetical order
      const sorted = data.sort((a: any, b: any) => a.name.localeCompare(b.name));

      // MOCK DATA for external sources
      const mocked = sorted.map((p: any, idx: number) => {
        // Mock combinations for demonstration
        if (idx === 0) return { ...p, shopee_link: 'https://shopee.com.br' };
        if (idx === 1) return { ...p, shopee_link: 'https://shopee.com.br', mercadolivre_link: 'https://mercadolivre.com.br' };
        if (idx === 2) return { ...p, shopee_link: 'https://shopee.com.br', mercadolivre_link: 'https://mercadolivre.com.br', amazon_link: 'https://amazon.com.br' };
        if (idx === 3) return { ...p, shopee_link: 'https://shopee.com.br', mercadolivre_link: 'https://mercadolivre.com.br', amazon_link: 'https://amazon.com.br', aliexpress_link: 'https://aliexpress.com' };
        // Example with just one different link
        if (idx === 4) return { ...p, amazon_link: 'https://amazon.com.br' };
        return p;
      });

      setProducts(mocked);
    }).catch(console.error);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

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

  const ExternalLinkIcons = ({ product, isBig = false }: { product: any, isBig?: boolean }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const links = [
      { id: 'shopee', url: product.shopee_link, color: '#EE4D2D', label: 'Shopee', icon: 'S' },
      { id: 'mercadolivre', url: product.mercadolivre_link, color: '#FFE600', textColor: '#2D3277', label: 'Mercado Livre', icon: 'M' },
      { id: 'amazon', url: product.amazon_link, color: '#000000', label: 'Amazon', icon: 'A' },
      { id: 'aliexpress', url: product.aliexpress_link, color: '#E62E04', label: 'AliExpress', icon: 'al' },
    ].filter(l => l.url);

    if (links.length === 0) return null;

    const firstLink = links[0];
    const otherLinks = links.slice(1);

    return (
      <div className="relative">
        {/* Desktop View: Show all icons */}
        <div className="hidden md:flex items-center gap-2">
          {links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className="flex items-center justify-center rounded-xl transition-transform hover:scale-105 shadow-sm border border-black/5 flex-shrink-0"
              style={{
                backgroundColor: link.color,
                width: isBig ? '56px' : '40px',
                height: isBig ? '56px' : '40px',
                color: link.textColor || 'white'
              }}
            >
              <span className={`font-black uppercase ${isBig ? 'text-2xl' : 'text-sm'}`}>{link.icon}</span>
            </a>
          ))}
        </div>

        {/* Mobile View: Show only first link + toggle for others */}
        <div className="md:hidden">
          <button
            onClick={() => {
              if (otherLinks.length > 0) {
                setShowDropdown(!showDropdown);
              } else {
                window.open(firstLink.url, '_blank', 'noopener,noreferrer');
              }
            }}
            className="flex items-center justify-center rounded-xl shadow-sm border border-black/5 flex-shrink-0"
            style={{
              backgroundColor: firstLink.color,
              width: '40px',
              height: '40px',
              color: firstLink.textColor || 'white'
            }}
          >
            <span className="font-black uppercase text-sm">{firstLink.icon}</span>
            {otherLinks.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
            )}
          </button>

          <AnimatePresence>
            {showDropdown && otherLinks.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-white rounded-2xl shadow-2xl z-50 border border-earth-100 flex flex-col gap-1 min-w-[170px] max-w-[90vw]"
                >
                  <div className="text-[10px] font-bold text-earth-400 px-3 uppercase mb-1 border-b border-earth-50 pb-1">Onde comprar:</div>
                  {links.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowDropdown(false)}
                      className={`flex items-center gap-3 p-2.5 hover:bg-earth-50 rounded-xl transition-colors ${link.id === firstLink.id ? 'bg-earth-50/50' : ''}`}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black shadow-sm"
                        style={{ backgroundColor: link.color, color: link.textColor || 'white' }}
                      >
                        {link.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-olive-900 leading-tight">{link.label}</span>
                      </div>
                    </a>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);

    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
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
      {/* Navigation Buttons */}

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

              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-earth-100 overflow-hidden">
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevProduct}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm md:shadow-md"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-olive-900" />
                </button>
                <button
                  onClick={handleNextProduct}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm md:shadow-md"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-olive-900" />
                </button>
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

                  <div className="flex items-center gap-3">
                    {(() => {
                      const marketplaceLinks = [selectedProduct.shopee_link, selectedProduct.mercadolivre_link, selectedProduct.amazon_link, selectedProduct.aliexpress_link].filter(Boolean);
                      const numLinks = marketplaceLinks.length;

                      return (
                        <>
                          {!isInCart(selectedProduct.id) && <ExternalLinkIcons product={selectedProduct} isBig />}

                          <button
                            onClick={(e) => {
                              if (isInCart(selectedProduct.id)) {
                                removeFromCart(selectedProduct.id);
                              } else {
                                handleAddToCart(selectedProduct, e);
                              }
                            }}
                            className={`flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group font-bold ${numLinks > 0 && !isInCart(selectedProduct.id)
                              ? 'w-[56px] h-[56px] md:flex-grow md:h-auto md:py-4 md:px-6'
                              : 'flex-grow py-4 px-6'
                              } rounded-xl text-lg ${isInCart(selectedProduct.id)
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-mustard-500 hover:bg-mustard-600 text-olive-900'
                              }`}
                          >
                            {isInCart(selectedProduct.id) ? <Trash2 className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                            <span className={`${(numLinks > 0 && !isInCart(selectedProduct.id)) ? 'hidden md:inline' : 'inline'}`}>
                              {isInCart(selectedProduct.id) ? 'Remover' : 'Adicionar ao Carrinho'}
                            </span>
                          </button>
                        </>
                      );
                    })()}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* Search and Filter - Fixed Sub-Header */}
      <div className="fixed top-[64px] left-0 right-0 z-40 bg-offwhite border-b border-earth-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
          {/* Categories - Horizontal Scroll on Mobile */}
          <div className="flex flex-nowrap justify-start items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 max-w-full scrollbar-hide no-scrollbar flex-grow">
            <button
              onClick={() => { setActiveCategory('todos'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === 'todos'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id
                  ? 'bg-olive-700 text-white shadow-md'
                  : 'bg-white text-earth-800 hover:bg-earth-100 border border-earth-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72 flex-shrink-0">
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
      </div>

      <main className="pt-[210px] md:pt-[150px] pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

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
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-earth-100 flex flex-col h-full relative"
                >
                  <div className="relative h-32 md:h-48 overflow-hidden rounded-t-[15px]">
                    {isInCart(product.id) && (
                      <div className="absolute top-2 left-2 z-10 bg-olive-900/90 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1">
                        <ShoppingBag size={10} className="text-mustard-400" />
                        NO CARRINHO
                      </div>
                    )}
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
                    <div className="flex-grow">
                      <h3 className="text-base md:text-xl font-bold text-olive-900 mb-1 md:mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-earth-800 text-xs md:text-sm mb-2 line-clamp-2">{product.desc}</p>
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-xs text-mustard-600 font-bold hover:underline mb-4 text-left"
                      >
                        Ver mais
                      </button>
                    </div>

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

                      {(() => {
                        const marketplaceLinks = [product.shopee_link, product.mercadolivre_link, product.amazon_link, product.aliexpress_link].filter(Boolean);
                        const numLinks = marketplaceLinks.length;

                        return (
                          <div className="flex items-center justify-center gap-1.5 md:gap-2 w-full">
                            {!isInCart(product.id) && <ExternalLinkIcons product={product} />}

                            <button
                              onClick={(e) => {
                                if (isInCart(product.id)) {
                                  removeFromCart(product.id);
                                } else {
                                  handleAddToCart(product, e);
                                }
                              }}
                              title={isInCart(product.id) ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
                              className={`flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md rounded-xl font-bold h-10 md:h-[40px] ${(numLinks > 0 && !isInCart(product.id))
                                  ? (numLinks < 3 ? 'flex-grow min-w-[100px] px-2' : 'w-10 md:w-[40px] flex-shrink-0')
                                  : 'flex-grow min-w-[100px] px-4'
                                } ${isInCart(product.id)
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-mustard-500 hover:bg-mustard-600 text-olive-900 border border-mustard-600/10'
                                }`}
                            >
                              {isInCart(product.id) ? <Trash2 className="w-4 h-4 md:w-5 md:h-5" /> : <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />}
                              <span className={`${(numLinks >= 3 && !isInCart(product.id)) ? 'hidden' : 'inline'}`}>
                                {isInCart(product.id) ? 'Remover' : 'Adicionar'}
                              </span>
                            </button>
                          </div>
                        );
                      })()}
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
