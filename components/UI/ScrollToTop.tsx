import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from './SmoothScroll';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's default scroll restoration to ensure we always start at the top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    smoothScrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
