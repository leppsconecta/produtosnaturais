import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    // Instancia o Lenis para efeito de scroll suave com desaceleração inercial
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return null;
}
