import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenisInstance: Lenis | null = null;

export const getLenis = (): Lenis | null => lenisInstance;

export const smoothScrollTo = (target: any, options?: any) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options);
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function SmoothScroll() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
      return;
    }

    // Instancia o Lenis para efeito de scroll suave com desaceleração inercial nas páginas públicas
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

    lenisInstance = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [isAdminRoute]);

  return null;
}
