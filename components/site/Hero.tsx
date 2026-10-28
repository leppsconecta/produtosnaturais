import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/hero-1.jpg',
    title: 'Temperos & Especiarias que Transformam',
    subtitle: 'Sabor autêntico, pureza e qualidade artesanal para enriquecer suas receitas.',
    highlight: 'Transformam'
  },
  {
    id: 2,
    image: '/hero-2.jpg',
    title: 'Chás & Ervas para o Corpo e a Mente',
    subtitle: 'Bem-estar, serenidade e equilíbrio direto da terra para seu dia a dia.',
    highlight: 'Corpo e a Mente'
  },
  {
    id: 3,
    image: '/hero-3.jpg',
    title: 'Alimentos 100% Naturais Selecionados',
    subtitle: 'Grãos, sementes e castanhas nobres com a máxima pureza e frescor.',
    highlight: '100% Naturais'
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
    <section id="inicio" className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between overflow-hidden group">
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
          />
          {/* Subtle gradient overlay to keep food colors appetizing while protecting text contrast */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Spacing spacer for top navbar */}
      <div className="pt-24 md:pt-32" />

      {/* Center Content: Title and Subtitle */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-wider mb-5 border border-white/20">
              🌱 Empórios MDA Produtos Naturais
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-md tracking-tight">
              {slides[currentSlide].title.split(slides[currentSlide].highlight)[0]}
              <span className="text-mustard-400 italic underline decoration-mustard-400/40 underline-offset-8">
                {slides[currentSlide].highlight}
              </span>
              {slides[currentSlide].title.split(slides[currentSlide].highlight)[1]}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal drop-shadow leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Base of Hero: Compact CTA Buttons & Slide Indicators */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 md:pb-12 text-center">
        {/* Compact CTA Buttons at the base */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://wa.me/5511940546968"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-mustard-500 hover:bg-mustard-400 text-olive-950 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md shadow-mustard-500/25"
          >
            <MessageCircle className="w-4 h-4 text-olive-950" />
            Fale Conosco
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="#produtos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#5A1788] hover:bg-[#48126e] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-950/30 border border-white/20"
          >
            Ver Produtos
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              className={`h-1.5 transition-all rounded-full ${
                currentSlide === idx ? 'w-8 bg-mustard-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Lateral Arrows */}
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 z-20 p-2 text-white/50 hover:text-white transition-colors duration-200 focus:outline-none"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 z-20 p-2 text-white/50 hover:text-white transition-colors duration-200 focus:outline-none"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />
      </button>
    </section>
  );
}
