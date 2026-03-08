import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, Search, ChevronLeft, ChevronRight, Plus, Minus, X, Trash2, ThumbsUp, MessageCircle, ThumbsDown, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
  const { addToCart, cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const categories = [
    { id: 'chas', name: 'Chás Naturais' },
    { id: 'temperos', name: 'Temperos Selecionados' },
    { id: 'capsulas', name: 'Cápsulas e Suplementos' },
    { id: 'graos', name: 'Grãos e Sementes' },
    { id: 'farinhas', name: 'Farinhas e Integrais' },
    { id: 'oleos', name: 'Óleos e Essências' },
  ];

  const products = [
    {
      id: 1,
      name: 'Chá de Camomila Premium',
      category: 'chas',
      price: 15.90,
      image: 'https://images.unsplash.com/photo-1544787210-2213d249250b?auto=format&fit=crop&q=80&w=800',
      description: 'Camomila selecionada de colheita manual, perfeita para momentos de relaxamento.',
      benefits: ['Ação calmante', 'Melhora o sono', 'Combate a ansiedade'],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Cúrcuma Pura em Pó',
      category: 'temperos',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800',
      description: 'Cúrcuma com alto teor de curcumina, ideal para saúde anti-inflamatória.',
      benefits: ['Anti-inflamatório', 'Antioxidante', 'Imunidade'],
      rating: 4.9,
      reviews: 56
    },
    {
      id: 3,
      name: 'Ora-pro-nóbis em Cápsulas',
      category: 'capsulas',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1626202340534-802526fd2565?auto=format&fit=crop&q=80&w=800',
      description: 'Super alimento em cápsulas, rico em proteínas e fibras essenciais.',
      benefits: ['Rico em ferro', 'Proteína vegetal', 'Saúde intestinal'],
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: 'Chia Premium',
      category: 'graos',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800',
      description: 'Sementes de chia ricas em Ômega 3 e fibras para saciedade.',
      benefits: ['Ômega 3', 'Controle do apetite', 'Efeito detox'],
      rating: 4.6,
      reviews: 72
    },
    {
      id: 5,
      name: 'Farinha de Amêndoas Fina',
      category: 'farinhas',
      price: 32.00,
      image: 'https://images.unsplash.com/photo-1533727937480-da3a97967e95?auto=format&fit=crop&q=80&w=800',
      description: 'Farinha Low Carb premium, ideal para receitas saudáveis e nutritivas.',
      benefits: ['Baixo carbo', 'Rica em vitamina E', 'Sem glúten'],
      rating: 4.9,
      reviews: 145
    },
    {
      id: 6,
      name: 'Óleo Essencial de Lavanda',
      category: 'oleos',
      price: 35.00,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
      description: '100% puro e natural, para aromaterapia e bem-estar profundo.',
      benefits: ['Relaxamento', 'Sono reparador', 'Alívio de estresse'],
      rating: 4.8,
      reviews: 112
    },
    {
      id: 7,
      name: 'Mix de Castanhas Premium',
      category: 'graos',
      price: 25.90,
      image: 'https://images.unsplash.com/photo-1536592202742-628c447eff4a?auto=format&fit=crop&q=80&w=800',
      description: 'Castanha de caju, do pará, amêndoas e nozes selecionadas.',
      benefits: ['Gorduras boas', 'Energia natural', 'Saúde do coração'],
      rating: 4.7,
      reviews: 94
    },
    {
      id: 8,
      name: 'Mel de Flor de Laranjeira',
      category: 'farinhas',
      price: 28.00,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
      description: 'Mel puro de flor de laranjeira, leve e extremamente aromático.',
      benefits: ['Adoçante natural', 'Energético', 'Saúde respiratória'],
      rating: 4.9,
      reviews: 203
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900">
      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-olive-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-olive-900 hover:bg-white transition-colors border border-olive-100 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 relative bg-offwhite">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-mustard-500 text-olive-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                  {categories.find(c => c.id === selectedProduct.category)?.name}
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-mustard-500">
                    {[...Array(5)].map((_, i) => (
                      <ThumbsUp key={i} className={`w-3 h-3 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-earth-500 uppercase tracking-widest">{selectedProduct.reviews} Avaliações</span>
                </div>

                <h2 className="text-3xl font-black text-olive-900 mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-sm font-bold text-earth-400">R$</span>
                  <span className="text-4xl font-black text-olive-800">{selectedProduct.price.toFixed(2)}</span>
                </div>

                <p className="text-earth-600 mb-8 leading-relaxed italic border-l-4 border-mustard-500 pl-4 py-1">
                  "{selectedProduct.description}"
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-olive-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-mustard-500"></span> Benefícios
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.benefits.map((benefit: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-offwhite border border-earth-100 rounded-lg text-xs font-bold text-olive-800 shadow-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-4 bg-olive-900 hover:bg-olive-800 text-mustard-500 font-black rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:shadow-olive-900/20 active:scale-95 group"
                  >
                    <ShoppingBag className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
                    ADICIONAR AO CARRINHO
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Search and Filter - Fixed Sub-Header */}
      <div className="fixed top-[64px] left-0 right-0 z-40 bg-offwhite border-b border-earth-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-olive-900 tracking-tighter">
              {activeCategory === 'todos' ? 'Nossos Produtos' : categories.find(c => c.id === activeCategory)?.name}
            </h1>
            <p className="text-earth-500 mt-2 font-medium">Encontramos {filteredProducts.length} itens especiais para você</p>
          </div>
        </div>

        {/* Products Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentItems.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-earth-100 shadow-sm hover:shadow-2xl hover:shadow-olive-900/10 transition-all duration-500 flex flex-col h-full"
              >
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white text-xs font-black tracking-widest uppercase">Ver Detalhes</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-olive-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {categories.find(c => c.id === product.category)?.name}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-mustard-500">
                      <ThumbsUp className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold text-earth-400 uppercase tracking-widest">{product.rating} (56)</span>
                  </div>

                  <h3 className="text-xl font-black text-olive-900 group-hover:text-mustard-600 transition-colors mb-2 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-earth-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-earth-50">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-[10px] font-bold text-earth-400">R$</span>
                      <span className="text-2xl font-black text-olive-800">{product.price.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="p-3 bg-olive-900 hover:bg-olive-800 text-mustard-500 rounded-2xl transition-all shadow-lg active:scale-90 group/btn"
                    >
                      <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-earth-100">
            <div className="bg-mustard-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-mustard-500" />
            </div>
            <h3 className="text-2xl font-black text-olive-900 mb-2">Ops! Nenhum produto encontrado</h3>
            <p className="text-earth-500 font-medium">Tente buscar por termos diferentes ou selecione outra categoria.</p>
            <button
              onClick={() => { setActiveCategory('todos'); setSearchQuery(''); }}
              className="mt-8 px-6 py-3 bg-olive-900 text-mustard-500 font-black rounded-xl hover:bg-olive-800 transition-colors shadow-lg"
            >
              Ver todos os produtos
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-6">
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
    </div>
  );
}
