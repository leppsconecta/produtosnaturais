import Hero from '../../components/site/Hero';
import Products from '../../components/site/Products';
import Wholesale from '../../components/site/Wholesale';
import Testimonials from '../../components/site/Testimonials';
import Contact from '../../components/site/Contact';

export default function Home() {
  return (
    <div className="font-sans text-earth-800 selection:bg-mustard-500/30 selection:text-olive-900">
      <Hero />
      <Products />
      <Testimonials />
      <Wholesale />
      <Contact />
    </div>
  );
}
