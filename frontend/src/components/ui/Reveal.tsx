'use client';

import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealProps {
  as?: 'div' | 'article' | 'figure' | 'section' | 'li';
  className?: string;
  /** Position inside a group, used to stagger the entrance. */
  index?: number;
  /** Adds a soft 3D tilt that follows the mouse (fine pointers only). */
  tilt?: boolean;
  children: ReactNode;
}

/** Fades an element up the first time it scrolls into view. Content is visible without JavaScript or with reduced motion. */
export default function Reveal({ as = 'div', className = '', index = 0, tilt = false, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !tilt) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-3px)`;
      });
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [tilt]);

  return createElement(
    as,
    {
      ref,
      className: `${className} ${seen ? 'is-in' : ''}`.trim(),
      'data-reveal': '',
      style: seen && index ? { transitionDelay: `${Math.min(index, 4) * 90}ms` } : undefined,
    },
    children,
  );
}
