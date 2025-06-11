import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();
  const scrollPositions = useRef({});
  const isInitialLoad = useRef(true);
  const scrollLock = useRef(false);
  const shouldRestore = !location.pathname.startsWith('/recipe/');

  // Store scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollLock.current) {
        scrollPositions.current[location.pathname] = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Restore scroll position
  useEffect(() => {
    if (isInitialLoad.current || !shouldRestore) {
      isInitialLoad.current = false;
      return;
    }

    const scrollY = scrollPositions.current[location.pathname] || 0;
    scrollLock.current = true;

    // Mobile-optimized restoration sequence
    const restoreScroll = (attempt = 0) => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });

      const verify = () => {
        const currentPos = window.scrollY;
        const delta = Math.abs(currentPos - scrollY);

        if (delta > 5 && attempt < 4) {
          setTimeout(() => restoreScroll(attempt + 1), [0, 50, 100, 150][attempt]);
        } else {
          scrollLock.current = false;
        }
      };

      requestAnimationFrame(verify);
    };

    restoreScroll();
  }, [location.key, shouldRestore]);

  return null;
};

export default ScrollRestoration;