'use client';

import { useId, useState } from 'react';
import Icon from './Icon';
import type { Faq } from '@/lib/types';

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const base = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });

  return (
    <div className="faq-list">
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        return (
          <div key={i} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3 className="faq-h">
              <button className="faq-q" type="button" aria-expanded={isOpen} aria-controls={`${base}-a-${i}`} id={`${base}-q-${i}`} onClick={() => toggle(i)}>
                <span>{f.q}</span>
                <Icon name="plus" size={22} />
              </button>
            </h3>
            <div className="faq-a" id={`${base}-a-${i}`} role="region" aria-labelledby={`${base}-q-${i}`}>
              <div><p>{f.a}</p></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
