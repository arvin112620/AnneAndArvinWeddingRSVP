'use client';

import { useEffect } from 'react';

export function ScrollEffects() {
  useEffect(() => {
    document.body.classList.add('reveal-ready');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal], section:not(#top), footer'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' });

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.body.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
