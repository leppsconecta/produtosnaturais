import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Wholesale from '../components/Wholesale';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

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
