import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();
  const scrollPositions = useRef({});
  const isInitialLoad = useRef(true);
  const scrollLock = useRef(false);

  // Store scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollLock.current) {
        scrollPositions.current[location.key] = window.scrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.key]);

  // Restore scroll position
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    const scrollY = scrollPositions.current[location.key] || 0;
    scrollLock.current = true;

    const restoreScroll = (attempt = 0) => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });

      const verify = () => {
        const currentPos = window.scrollY;
        const delta = Math.abs(currentPos - scrollY);

        if (delta > 5 && attempt < 4) {
          setTimeout(() => restoreScroll(attempt + 1), [0, 50, 100, 200][attempt]);
        } else {
          scrollLock.current = false;
        }
      };

      requestAnimationFrame(verify);
    };

    restoreScroll();
  }, [location.key]);

  return null;
};

export default ScrollRestoration;