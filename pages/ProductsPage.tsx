import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ShoppingCart, Search, ChevronLeft, ChevronRight, Plus, Minus, X, Trash2, ThumbsUp, MessageCircle, ThumbsDown, Send } from 'lucide-react';
<<<<<<< HEAD
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
import { useCart } from '../context/CartContext';

const ITEMS_PER_PAGE = 20;

export default function ProductsPage() {
<<<<<<< HEAD
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, removeFromCart, cart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [flyingImage, setFlyingImage] = useState<{ src: string, x: number, y: number } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'elogio' | 'sugestao' | 'reclamacao' | null>(null);
  const [reviewText, setReviewText] = useState('');

  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sabordaterra_categorias');
      if (saved) {
        const categoriasRaw = JSON.parse(saved);

        // Mapear categorias para o formato esperado:
        const formattedCategories = categoriasRaw.map((c: any) => ({
          id: c.id,
          name: c.nome
        }));
        setCategories(formattedCategories);

        // Mapear e preparar produtos:
        const todosItens = categoriasRaw.flatMap((c: any) =>
          c.itens.filter((i: any) => i.visivel !== false) // Exibir apenas visíveis
        );

        const formattedProducts = todosItens.map((item: any) => ({
          id: item.id,
          name: item.nome,
          desc: item.descricao,
          price: parseFloat(item.preco.replace('.', '').replace(',', '.')),
          img: item.foto || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
          weight: item.variacoes?.length ? 'Várias opções' : (item.unidade || 'Unid'),
          category: item.categoria_id || 'todos',
          // Links externos já virão do próprio produto do Cardápio se salvos lá,
          // ou manter os originais caso existam no objeto "item".
          shopee_link: item.shopee_link,
          mercadolivre_link: item.mercadolivre_link,
          amazon_link: item.amazon_link,
          aliexpress_link: item.aliexpress_link,
        }));

        // Ordenar alfabeticamente
        const sorted = formattedProducts.sort((a: any, b: any) => a.name.localeCompare(b.name));
        setProducts(sorted);
      }
    } catch (e) {
      console.error('Erro ao carregar cardápio:', e);
    }
  }, []);
=======
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
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
<<<<<<< HEAD
        product.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
=======
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredProducts.slice(
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

<<<<<<< HEAD
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ExternalLinkIcons = ({ product, isBig = false }: { product: any, isBig?: boolean }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const links = [
      { id: 'shopee', url: product.shopee_link, color: '#ffffff', textColor: '#EE4D2D', label: 'Shopee', iconSrc: '/shopee-logo.png' },
      { id: 'mercadolivre', url: product.mercadolivre_link, color: '#ffffff', textColor: '#2D3277', label: 'Mercado Livre', iconSrc: '/mercadolivre-logo.png' },
      { id: 'amazon', url: product.amazon_link, color: '#ffffff', textColor: '#000000', label: 'Amazon', iconSrc: '/amazon-logo.png' },
      { id: 'aliexpress', url: product.aliexpress_link, color: '#ffffff', textColor: '#E62E04', label: 'AliExpress', iconSrc: '/aliexpress-logo.png' },
    ].filter(l => l.url);

    if (links.length === 0) return null;

    const firstLink = links[0];
    const otherLinks = links.slice(1);

    return (
      <div className="relative">
        {/* Desktop View & Modal View: Show all icons in a row */}
        <div className={`${isBig ? 'flex' : 'hidden md:flex'} items-center ${isBig ? 'gap-3' : 'gap-2'}`}>
          {links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className={`flex items-center justify-center ${isBig ? 'rounded-2xl' : 'rounded-xl'} transition-transform hover:scale-105 shadow-sm border border-black/5 flex-shrink-0 bg-white overflow-hidden`}
              style={{
                width: isBig ? '56px' : '40px',
                height: isBig ? '56px' : '40px',
              }}
            >
              <img src={link.iconSrc} alt={link.label} className="w-full h-full object-contain p-1" />
            </a>
          ))}
        </div>

        {/* Mobile View (Small Card Only): Show only first link + toggle for others */}
        {!isBig && (
          <div className="md:hidden">
            <button
              onClick={() => {
                if (otherLinks.length > 0) {
                  setShowDropdown(!showDropdown);
                } else {
                  window.open(firstLink.url, '_blank', 'noopener,noreferrer');
                }
              }}
              className="flex items-center justify-center rounded-xl shadow-sm border border-black/5 flex-shrink-0 bg-white overflow-hidden"
              style={{
                width: '40px',
                height: '40px',
              }}
            >
              <img src={firstLink.iconSrc} alt={firstLink.label} className="w-full h-full object-contain p-1" />
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
                          className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm bg-white border border-earth-100 overflow-hidden"
                        >
                          <img src={link.iconSrc} alt={link.label} className="w-full h-full object-contain p-1" />
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
        )}
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
              className="relative w-full max-w-[360px] sm:max-w-md md:max-w-none md:w-[900px] md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px]"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <X className="w-6 h-6 text-olive-900" />
              </button>

              <div className="w-full md:w-1/2 h-52 md:h-full relative bg-earth-100 overflow-hidden flex-shrink-0">
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

              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col h-full overflow-y-auto">
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
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                    <span className="text-sm font-medium text-earth-600">Quantidade:</span>
                    <div className="flex items-center gap-3 bg-earth-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-olive-900 w-10 text-center text-xl">{quantities[selectedProduct.id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-3 w-full">
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
                            className={`flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl group font-black rounded-2xl text-lg ${numLinks > 0 && !isInCart(selectedProduct.id)
                              ? 'w-14 h-14 md:flex-grow md:h-14 px-6'
                              : 'flex-grow h-14 px-6'
                              } ${isInCart(selectedProduct.id)
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-mustard-500 hover:bg-mustard-600 text-olive-900'
                              }`}
                          >
                            {isInCart(selectedProduct.id) ? <Trash2 className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                            <span className={`${(numLinks > 0 && !isInCart(selectedProduct.id)) ? 'hidden md:inline' : 'inline'}`}>
                              {isInCart(selectedProduct.id) ? 'Remover' : (numLinks >= 2 ? 'Adicionar' : 'Adicionar ao Carrinho')}
                            </span>
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  {/* Avaliar Produto Link */}
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="text-xs font-semibold text-earth-500 hover:text-mustard-600 transition-colors underline decoration-earth-300 hover:decoration-mustard-600 underline-offset-4"
                    >
                      Avalie este produto
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
=======
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
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
<<<<<<< HEAD
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-earth-100">
                <h3 className="text-xl font-bold text-olive-900">Avaliar Produto</h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 bg-earth-50 hover:bg-earth-100 rounded-full transition-colors text-earth-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {/* Product Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-earth-100 flex-shrink-0">
                    <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-olive-900">{selectedProduct.name}</h4>
                    <p className="text-sm text-earth-500">Compartilhe sua experiência</p>
                  </div>
                </div>

                {/* Tipo de Avaliação */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-earth-500 uppercase tracking-wider mb-3">
                    Tipo de avaliação
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setReviewType('elogio')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${reviewType === 'elogio'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-earth-100 bg-white text-earth-500 hover:border-green-200 hover:bg-green-50/50'
                        }`}
                    >
                      <ThumbsUp className={`w-6 h-6 ${reviewType === 'elogio' ? 'text-green-500' : ''}`} />
                      <span className="text-[10px] font-bold">ELOGIO</span>
                    </button>

                    <button
                      onClick={() => setReviewType('sugestao')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${reviewType === 'sugestao'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-earth-100 bg-white text-earth-500 hover:border-blue-200 hover:bg-blue-50/50'
                        }`}
                    >
                      <MessageCircle className={`w-6 h-6 ${reviewType === 'sugestao' ? 'text-blue-500' : ''}`} />
                      <span className="text-[10px] font-bold">SUGESTÃO</span>
                    </button>

                    <button
                      onClick={() => setReviewType('reclamacao')}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${reviewType === 'reclamacao'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-earth-100 bg-white text-earth-500 hover:border-red-200 hover:bg-red-50/50'
                        }`}
                    >
                      <ThumbsDown className={`w-6 h-6 ${reviewType === 'reclamacao' ? 'text-red-500' : ''}`} />
                      <span className="text-[10px] font-bold">RECLAMAÇÃO</span>
                    </button>
                  </div>
                </div>

                {/* Sua Avaliação */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-earth-500 uppercase tracking-wider mb-3">
                    Sua avaliação
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="O que você achou deste produto? Sabor, apresentação, etc..."
                    className="w-full h-32 p-4 bg-white border border-earth-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-mustard-500/20 focus:border-mustard-500 resize-none shadow-sm placeholder:text-earth-400"
                  />
                </div>

                {/* Submit */}
                <button
                  disabled={!reviewType || !reviewText.trim()}
                  onClick={() => {
                    // MOCK submit action
                    setIsReviewModalOpen(false);
                    setReviewType(null);
                    setReviewText('');
                    alert('Avaliação enviada com sucesso!');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-mustard-500 hover:bg-mustard-600 disabled:opacity-50 disabled:cursor-not-allowed text-olive-900 font-bold rounded-2xl transition-colors shadow-sm"
                >
                  <Send className="w-5 h-5" />
                  Enviar Avaliação
                </button>
=======
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
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

<<<<<<< HEAD
      <Navbar />

      {/* Search and Filter - Fixed Sub-Header */}
      <div className="fixed top-[64px] left-0 right-0 z-40 bg-offwhite border-b border-earth-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
          {/* Categories - Horizontal Scroll on Mobile */}
=======
      {/* Search and Filter - Fixed Sub-Header */}
      <div className="fixed top-[64px] left-0 right-0 z-40 bg-offwhite border-b border-earth-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
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

<<<<<<< HEAD
          {/* Search */}
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
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
<<<<<<< HEAD

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
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-olive-900 shadow-sm z-10">
                      {product.weight}
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-2 right-2 bg-[#8cc63f] text-white px-2 py-1 rounded-lg shadow-md border border-[#76a832] font-black tracking-tight flex items-baseline gap-0.5 z-20">
                      <span className="text-[9px] font-bold">R$</span>
                      <span className="text-lg leading-none">{(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-grow pt-5">
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
=======
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
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
<<<<<<< HEAD
          <div className="flex justify-center items-center mt-16 gap-4">
=======
          <div className="mt-16 flex justify-center items-center gap-6">
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
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
<<<<<<< HEAD

      <FloatingWhatsApp />
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
    </div>
  );
}
