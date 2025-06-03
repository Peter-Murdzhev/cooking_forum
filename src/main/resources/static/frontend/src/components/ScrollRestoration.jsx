import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const ScrollRestoration = () => {
  const location = useLocation();

  useEffect(() => {
    let scrollY = window.history.state?.scrollY ?? 0; // Try preserving from navigation state
    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 300);

    const handleScroll = () => {
      window.history.replaceState({ scrollY: window.scrollY }, "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return null;
}

export default ScrollRestoration;