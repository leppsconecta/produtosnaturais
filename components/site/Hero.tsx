import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/hero-1.jpg',
    alt: 'Temperos e Especiarias Selecionados MDA'
  },
  {
    id: 2,
    image: '/hero-2.jpg',
    alt: 'Chás e Ervas Naturais MDA'
  },
  {
    id: 3,
    image: '/hero-3.jpg',
    alt: 'Castanhas e Alimentos 100% Naturais MDA'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section id="inicio" className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] w-full flex items-end justify-center overflow-hidden group">
      {/* Carousel Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url("${slides[currentSlide].image}")` }}
            role="img"
            aria-label={slides[currentSlide].alt}
          />
          {/* Suave degradê apenas na base para contraste dos indicadores */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Base: Indicadores do Carousel */}
      <div className="relative z-10 w-full pb-6 md:pb-8 flex justify-center">
        <div className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`h-2 transition-all rounded-full ${
                currentSlide === idx ? 'w-8 bg-mustard-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Lateral Arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 z-20 p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-sm transition-all duration-200 focus:outline-none"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 z-20 p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white/70 hover:text-white backdrop-blur-sm transition-all duration-200 focus:outline-none"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" />
      </button>
    </section>
  );
}
