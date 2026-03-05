import Navbar from '../../src/components/Navbar';
import Hero from '../../src/components/Hero';
import Products from '../../src/components/Products';
import Wholesale from '../../src/components/Wholesale';
import Contact from '../../src/components/Contact';
import Footer from '../../src/components/Footer';
import FloatingWhatsApp from '../../src/components/FloatingWhatsApp';

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Wholesale />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
