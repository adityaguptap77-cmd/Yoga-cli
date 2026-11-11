'use client';

import { useEffect, useRef, useState } from 'react';

const PHASES = [
  { name: 'inhale', text: 'Breathe in', secs: 4 },
  { name: 'hold', text: 'Hold', secs: 4 },
  { name: 'exhale', text: 'Breathe out', secs: 6 },
] as const;

/** The hero's one authored moment: a guided 4-4-6 breathing orb. Pauses for reduced-motion visitors. */
export default function BreathOrb() {
  const [state, setState] = useState<{ idx: number; left: number }>({ idx: 0, left: PHASES[0].secs });
  const [running, setRunning] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = () =>
      setState((st) => {
        if (st.left > 1) return { idx: st.idx, left: st.left - 1 };
        const next = (st.idx + 1) % PHASES.length;
        return { idx: next, left: PHASES[next].secs };
      });
    timer.current = setInterval(tick, 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running]);

  const phase = PHASES[state.idx];
  const left = state.left;

  return (
    <div
      className="breath"
      data-phase={phase.name}
      style={{ ['--dur' as string]: `${phase.secs}s` }}
      aria-label="A guided breathing animation you can follow"
    >
      <div className="breath-stage" aria-hidden="true">
        <svg className="breath-petals" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1">
          <g>
            {Array.from({ length: 12 }, (_, i) => (
              <ellipse key={i} cx="100" cy="42" rx="11" ry="34" transform={`rotate(${i * 30} 100 100)`} />
            ))}
          </g>
        </svg>
        <span className="breath-halo" /><span className="breath-halo" /><span className="breath-halo" />
        <div className="breath-orb">
          <div className="breath-inner">
            <span className="breath-deva" lang="hi">श्वास</span>
            <span className="breath-label">{phase.text}</span>
            <span className="breath-count">{running ? left : ''}</span>
          </div>
        </div>
      </div>
      <div className="breath-caption">
        <span>Try four slow breaths with us.</span>
        <button className="breath-toggle" type="button" aria-pressed={!running} onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
}
