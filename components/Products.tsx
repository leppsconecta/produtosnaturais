import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, products } from '../../produtosnaturais/data/products';
import { useCart } from '../../produtosnaturais/context/CartContext';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('temperos');
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [flyingImage, setFlyingImage] = useState<{ src: string, x: number, y: number } | null>(null);

  const filteredProducts = products
    .filter(p => p.category === activeCategory)
    .slice(0, 10); // Limit to 10 products

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

  return (
    <section id="produtos" className="py-24 relative">
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

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-olive-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-mustard-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-olive-900 mb-4">Nossos Produtos</h2>
            <p className="text-lg text-earth-800 max-w-2xl mx-auto">
              Selecionamos os melhores ingredientes da natureza para levar sabor, saúde e bem-estar para o seu dia a dia.
            </p>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-olive-700 text-white shadow-md scale-105'
                  : 'bg-white text-earth-800 hover:bg-earth-100 border border-earth-200'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-olive-700'}`} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-earth-100 flex flex-col h-full"
              >
                <div className="relative h-32 md:h-48 overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-olive-900 shadow-sm">
                    {product.weight}
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-base md:text-xl font-bold text-olive-900 mb-1 md:mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-earth-800 text-xs md:text-sm mb-4 md:mb-6 flex-grow line-clamp-3">{product.desc}</p>

                  <div className="mt-auto space-y-3">
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

        <div className="mt-16 text-center">
          <Link
            to="/produtos"
            className="inline-flex items-center justify-center gap-2 bg-[#5A178A] hover:bg-[#4a1270] text-white px-8 py-4 rounded-full text-lg font-medium transition-colors shadow-lg"
          >
            Ver mais produtos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
