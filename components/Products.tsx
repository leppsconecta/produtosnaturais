import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const FALLBACK_PRODUCTS = [
  {
    id: 1,
    category: 'temperos',
    name: 'Açafrão da Terra',
    weight: '150g',
    desc: 'Puro e vibrante, ideal para dar cor e sabor.',
    price: 12.90,
    img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80',
    shopee_link: 'https://shopee.com.br/mda-acafrao-da-terra-puro',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-acafrao',
  },
  {
    id: 2,
    category: 'temperos',
    name: 'Chimichurri',
    weight: '100g',
    desc: 'O clássico argentino para o seu churrasco.',
    price: 15.00,
    img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=600&auto=format&fit=crop&q=80',
    shopee_link: 'https://shopee.com.br/mda-acafrao-da-terra-puro',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-acafrao',
  },
  {
    id: 3,
    category: 'temperos',
    name: 'Páprica Defumada',
    weight: '100g',
    desc: 'Sabor intenso e aroma defumado marcante.',
    price: 14.00,
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    shopee_link: '',
    mercadolivre_link: '',
  },
  {
    id: 5,
    category: 'chas',
    name: 'Flor de Camomila',
    weight: '50g',
    desc: 'Calmante natural para noites tranquilas.',
    price: 8.50,
    img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop&q=80',
    shopee_link: '',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-flor-de-camomila',
  },
  {
    id: 6,
    category: 'chas',
    name: 'Hibisco em Flor',
    weight: '100g',
    desc: 'Sabor marcante e propriedades antioxidantes.',
    price: 10.00,
    img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    shopee_link: '',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-flor-de-camomila',
  },
  {
    id: 8,
    category: 'graos',
    name: 'Castanha do Pará',
    weight: '150g',
    desc: 'Rica em selênio e fundamental para a saúde.',
    price: 25.00,
    img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80',
    shopee_link: 'https://shopee.com.br/mda-mix-castanhas-premium',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-mix-castanhas',
  },
  {
    id: 10,
    category: 'graos',
    name: 'Mix de Castanhas Premium',
    weight: '200g',
    desc: 'A combinação perfeita de energia e sabor.',
    price: 22.00,
    img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&auto=format&fit=crop&q=80',
    shopee_link: 'https://shopee.com.br/mda-mix-castanhas-premium',
    mercadolivre_link: 'https://produto.mercadolivre.com.br/MLB-mda-mix-castanhas',
  },
  {
    id: 11,
    category: 'desidratados',
    name: 'Damasco Turco',
    weight: '200g',
    desc: 'Doce e macio, rico em fibras e betacaroteno.',
    price: 26.90,
    img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=600&auto=format&fit=crop&q=80',
    shopee_link: 'https://shopee.com.br/mda-damasco-turco-premium',
    mercadolivre_link: '',
  },
];

const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80';

export default function Products() {
  const { addToCart, removeFromCart, cart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Data State
  const [products, setProducts] = useState<any[]>(FALLBACK_PRODUCTS);

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Falha ao buscar produtos');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedProducts = data
            .filter((item: any) => !item.hidden)
            .map((item: any) => ({
              id: item.id,
              category: item.category || 'temperos',
              name: item.name,
              desc: item.desc || '',
              price: parseFloat(item.price) || 0,
              img: item.img || DEFAULT_FALLBACK_IMG,
              weight: item.weight || 'Unid',
              favorito: Boolean(item.favorito),
              shopee_link: item.shopee_link || '',
              mercadolivre_link: item.mercadolivre_link || '',
              amazon_link: item.amazon_link || '',
              aliexpress_link: item.aliexpress_link || '',
            }));

          const favs = formattedProducts.filter((p: any) => p.favorito);
          setProducts((favs.length > 0 ? favs : formattedProducts).slice(0, 8));
        }
      } catch (e) {
        console.error('Erro ao carregar favoritos, usando catálogo padrão:', e);
      }
    };

    fetchFavoritos();
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 1) + delta)
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] ?? 1;
    if (quantity <= 0 || (product.price || 0) <= 0) return;
    addToCart(product, quantity);

    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <section id="produtos" className="py-10 md:py-16 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-olive-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-mustard-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-olive-900 mb-2">Produtos em Destaque</h2>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-earth-100 flex flex-col h-full"
              >
                <div className="relative h-36 md:h-48 overflow-hidden bg-earth-100">
                  {isInCart(product.id) && (
                    <div className="absolute top-2 left-2 z-10 bg-olive-900/90 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-lg flex items-center gap-1">
                      <ShoppingBag size={10} className="text-mustard-400" />
                      NO CARRINHO
                    </div>
                  )}
                  <img
                    src={product.img}
                    alt={product.name}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMG; }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-olive-900 shadow-sm whitespace-nowrap">
                    {product.weight}
                  </div>
                </div>
                <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-sm sm:text-base md:text-xl font-bold text-olive-900 mb-1 md:mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-earth-800 text-xs md:text-sm mb-2.5 line-clamp-2">{product.desc}</p>
                  </div>

                  <div className="mt-auto space-y-2.5">
                    {product.price > 0 && (
                      <div className="flex items-center">
                        <span className="text-base sm:text-xl font-black text-olive-900 leading-tight whitespace-nowrap inline-flex items-baseline gap-1">
                          <span>R$</span>
                          <span>{product.price.toFixed(2).replace('.', ',')}</span>
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-3 bg-earth-50 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-olive-900 w-6 text-center">{quantities[product.id] ?? 1}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-olive-900 hover:bg-earth-100 transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {(() => {
                      const qty = quantities[product.id] ?? 1;
                      const isAddDisabled = !isInCart(product.id) && (qty <= 0 || (product.price || 0) <= 0);

                      return (
                        <div className="flex flex-col md:flex-row-reverse items-center gap-2 w-full">
                          <button
                            disabled={isAddDisabled}
                            onClick={() => {
                              if (isInCart(product.id)) {
                                removeFromCart(product.id);
                              } else {
                                handleAddToCart(product);
                              }
                            }}
                            className={`w-full md:flex-1 min-w-0 h-10 md:h-11 px-3 md:px-4 flex items-center justify-center gap-1.5 md:gap-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap ${
                              isInCart(product.id)
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-mustard-500 hover:bg-mustard-600 text-olive-900'
                            } ${isAddDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                          >
                            {isInCart(product.id) ? <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" /> : <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />}
                            <span className="truncate">{isInCart(product.id) ? 'Remover' : 'Adicionar'}</span>
                          </button>

                          {!isInCart(product.id) && (product.shopee_link || product.mercadolivre_link) && (
                            <div className="flex items-center justify-center gap-2 w-full md:w-auto flex-shrink-0">
                              {product.shopee_link && (
                                <a
                                  href={product.shopee_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ver na Shopee"
                                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-black/10 hover:border-[#EE4D2D] shadow-sm flex items-center justify-center p-1 transition-all hover:scale-105"
                                >
                                  <img src="/shopee-logo.png" alt="Shopee" className="w-full h-full object-contain" />
                                </a>
                              )}
                              {product.mercadolivre_link && (
                                <a
                                  href={product.mercadolivre_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Ver no Mercado Livre"
                                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-black/10 hover:border-[#2D3277] shadow-sm flex items-center justify-center p-1 transition-all hover:scale-105"
                                >
                                  <img src="/mercadolivre-logo.png" alt="Mercado Livre" className="w-full h-full object-contain" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <Link
            to="/produtos"
            className="inline-flex items-center justify-center gap-2 bg-[#5A178A] hover:bg-[#4a1270] text-white px-7 py-3.5 md:px-8 md:py-4 rounded-full text-base md:text-lg font-medium transition-colors shadow-lg"
          >
            Ver mais produtos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
