<<<<<<< HEAD
import Navbar from '../components/Navbar';
=======
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
import Hero from '../components/Hero';
import Products from '../components/Products';
import Wholesale from '../components/Wholesale';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
<<<<<<< HEAD
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900">
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Testimonials />
        <Wholesale />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
=======

export default function Home() {
  return (
    <div className="font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900">
      <Hero />
      <Products />
      <Testimonials />
      <Wholesale />
      <Contact />
>>>>>>> 47ad34f4e89d90b2c4542364948ec5a39214d924
    </div>
  );
}
