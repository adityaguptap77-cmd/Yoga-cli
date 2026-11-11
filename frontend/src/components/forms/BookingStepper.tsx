'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Icon from '../ui/Icon';
import type { FormOptions } from '@/lib/types';

type Values = {
  name: string; phone: string; email: string; interest: string; level: string; mode: string;
  preferred_time: string; message: string; consent: boolean; website: string;
};
type Key = keyof Omit<Values, 'consent' | 'website'> | 'review';

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]{1,79}$/u;

function normalisePhone(v: string) {
  const d = String(v || '').replace(/[^\d+]/g, '').replace(/^\+?91/, '').replace(/^0+/, '');
  return /^[6-9]\d{9}$/.test(d) ? d : '';
}

/** One question per card. The backend re-validates everything, so these checks are for speed and kindness. */
function validate(key: Key, v: Values): string {
  switch (key) {
    case 'name': return NAME_RE.test(v.name.trim().replace(/\s+/g, ' ')) ? '' : 'Please enter your name (letters only, at least 2 characters).';
    case 'phone': return normalisePhone(v.phone) ? '' : 'Enter a valid 10-digit Indian mobile number.';
    case 'email': return EMAIL_RE.test(v.email.trim().toLowerCase()) ? '' : 'Enter a valid email address, like name@example.com.';
    case 'interest': return v.interest ? '' : 'Please choose a class to continue.';
    case 'level': return v.level ? '' : 'Please choose your experience level.';
    case 'mode': return v.mode ? '' : 'Please choose how you would like to attend.';
    case 'preferred_time': return v.preferred_time ? '' : 'Please choose a preferred time.';
    case 'review': return v.consent ? '' : 'Please tick the box so we can contact you about your class.';
    default: return '';
  }
}

interface StepDef {
  key: Exclude<Key, 'review'>;
  title: string;
  help: string;
  label: string;
  kind: 'text' | 'tel' | 'email' | 'chips' | 'textarea';
  options?: keyof FormOptions;
}

const STEPS: StepDef[] = [
  { key: 'name', title: 'What should we call you?', help: 'Your first name is enough, but your full name helps us find your booking.', label: 'Your name', kind: 'text' },
  { key: 'phone', title: 'Which number can we reach you on?', help: 'An Indian mobile number. We will call or WhatsApp you to fix the class.', label: 'Mobile number', kind: 'tel' },
  { key: 'email', title: 'Where should we send your confirmation?', help: 'We will email you a copy of your request straight away.', label: 'Email address', kind: 'email' },
  { key: 'interest', title: 'Which class would you like to try?', help: 'Not sure? Choose the last option and a teacher will help you pick.', label: 'Class', kind: 'chips', options: 'interests' },
  { key: 'level', title: 'How much yoga have you done?', help: 'There is no wrong answer. It only helps us suggest the right room.', label: 'Experience', kind: 'chips', options: 'levels' },
  { key: 'mode', title: 'Studio or online?', help: 'Online classes are live on video, so the teacher can still see you.', label: 'Format', kind: 'chips', options: 'modes' },
  { key: 'preferred_time', title: 'When suits you best?', help: 'Pick the slot you would most like. We will confirm exact timings with you.', label: 'Time', kind: 'chips', options: 'times' },
  { key: 'message', title: 'Anything we should know?', help: 'Optional. Injuries, pregnancy, goals or questions all help the teacher prepare.', label: 'Your message', kind: 'textarea' },
];

const SUMMARY: { label: string; key: StepDef['key'] }[] = [
  { label: 'Name', key: 'name' }, { label: 'Mobile', key: 'phone' }, { label: 'Email', key: 'email' }, { label: 'Class', key: 'interest' },
  { label: 'Experience', key: 'level' }, { label: 'Format', key: 'mode' }, { label: 'Time', key: 'preferred_time' }, { label: 'Message', key: 'message' },
];

const REVIEW_INDEX = STEPS.length;       // the confirm card
const DONE_INDEX = STEPS.length + 1;     // the thank-you card
const QUESTION_COUNT = STEPS.length + 1; // eight answers plus the confirm step

export default function BookingStepper({ options, preselect, siteName }: { options: FormOptions; preselect: string; siteName: string }) {
  const [values, setValues] = useState<Values>({
    name: '', phone: '', email: '', interest: preselect, level: '', mode: '', preferred_time: '', message: '', consent: false, website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState('');
  const [done, setDone] = useState<{ name: string; email: string; emailConfigured: boolean } | null>(null);
  const [announce, setAnnounce] = useState('');
  const cards = useRef<(HTMLFieldSetElement | HTMLDivElement | null)[]>([]);
  const form = useRef<HTMLFormElement | null>(null);
  const mounted = useRef(false);
  const [ready, setReady] = useState(false); // inert until hydrated, so an early Enter cannot submit natively
  useEffect(() => setReady(true), []);

  const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const set = <K extends keyof Values>(k: K, v: Values[K]) => setValues((prev) => ({ ...prev, [k]: v }));
  const clearError = (k: string) => setErrors((e) => (e[k] ? { ...e, [k]: '' } : e));

  // Move focus into the new card and keep it in view on small screens.
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const card = cards.current[current];
    const key = current === DONE_INDEX ? 'done' : current === REVIEW_INDEX ? 'review' : STEPS[current].key;
    setAnnounce(current === DONE_INDEX ? 'Request sent.' : `Question ${Math.min(current + 1, QUESTION_COUNT)} of ${QUESTION_COUNT}.`);
    const t = window.setTimeout(() => {
      if (!card) return;
      const target = card.querySelector<HTMLElement>('input:checked, input:not([type=hidden]):not([tabindex="-1"]), textarea') || (card as HTMLElement);
      try { target.focus({ preventScroll: true }); } catch { /* ignore */ }
    }, reduce() ? 0 : 280);
    const top = form.current?.getBoundingClientRect().top ?? 0;
    if (key && (top < 0 || top > window.innerHeight * 0.4)) window.scrollTo({ top: window.scrollY + top - 110, behavior: reduce() ? 'auto' : 'smooth' });
    return () => window.clearTimeout(t);
  }, [current]);

  const go = (i: number) => setCurrent(Math.max(0, Math.min(DONE_INDEX, i)));

  const next = () => {
    const key: Key = current === REVIEW_INDEX ? 'review' : STEPS[current].key;
    const msg = validate(key, values);
    setErrors((e) => ({ ...e, [key]: msg }));
    if (msg) {
      const input = cards.current[current]?.querySelector<HTMLElement>('input.input, textarea');
      input?.focus();
      return;
    }
    go(current + 1);
  };

  const choose = (key: StepDef['key'], value: string, index: number) => {
    set(key, value as never);
    clearError(key);
    // A short beat so the choice registers, then the next card slides in.
    window.setTimeout(() => setCurrent((c) => (c === index ? c + 1 : c)), reduce() ? 0 : 320);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setAlert('');
    for (let i = 0; i < STEPS.length; i++) {
      const m = validate(STEPS[i].key, values);
      if (m) { setErrors((er) => ({ ...er, [STEPS[i].key]: m })); go(i); return; }
    }
    const consentMsg = validate('review', values);
    if (consentMsg) { setErrors((er) => ({ ...er, review: consentMsg })); return; }

    setBusy(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.replace(/\s+/g, ' ').trim(), phone: values.phone, email: values.email.trim().toLowerCase(),
          interest: values.interest, level: values.level, mode: values.mode, preferred_time: values.preferred_time,
          message: values.message.trim(), consent: values.consent, website: values.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setDone({ name: values.name.trim().split(' ')[0], email: values.email.trim().toLowerCase(), emailConfigured: Boolean(data.emailConfigured) });
        go(DONE_INDEX);
      } else if (res.status === 422 && data.errors) {
        const firstIdx = STEPS.findIndex((s) => data.errors[s.key]);
        if (firstIdx >= 0) { setErrors((er) => ({ ...er, [STEPS[firstIdx].key]: data.errors[STEPS[firstIdx].key] })); go(firstIdx); }
        else setAlert(data.message || 'Please check your answers and try again.');
      } else {
        setAlert(data.message || 'We could not send your request. Please try again in a moment.');
      }
    } catch {
      setAlert('We could not reach the server. Check your connection and try again. Your answers are still here.');
    } finally {
      setBusy(false);
    }
  };

  const cardClass = (i: number, extra = '') =>
    `step-card ${extra} ${i === current ? 'is-active' : i < current ? 'is-before' : 'is-after'}`.replace(/\s+/g, ' ').trim();

  const pct = current === DONE_INDEX ? 100 : Math.round((current / QUESTION_COUNT) * 100);
  const lastCard = current >= REVIEW_INDEX;

  const actions = (i: number, nextLabel: ReactNode = (<>Next <Icon name="arrow" size={18} /></>)) => (
    <div className="step-actions">
      {i === 0 ? <span /> : <button className="btn btn-ghost btn-back" type="button" onClick={() => go(i - 1)}>Back</button>}
      <button className="btn btn-primary step-next" type="button" onClick={next}>{nextLabel}</button>
    </div>
  );

  return (
    <form ref={form} className="stepper" id="lead-form" noValidate inert={!ready} aria-label="Free trial class request" onSubmit={submit}>
      <div className="step-progress" aria-hidden="true">
        <span>{current === DONE_INDEX ? 'All done' : `Question ${Math.min(current + 1, QUESTION_COUNT)} of ${QUESTION_COUNT}`}</span>
        <div className="step-bar"><i style={{ width: `${Math.max(pct, 6)}%` }} /></div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>

      <div className={`step-stage ${lastCard ? 'is-last' : ''}`}>
        {STEPS.map((s, i) => {
          const err = errors[s.key];
          const errId = `e-${s.key}`;
          return (
            <fieldset key={s.key} className={cardClass(i)} ref={(el) => { cards.current[i] = el; }} inert={i !== current}>
              <legend>{s.title}</legend>
              <p className="step-help">{s.help}</p>

              {s.kind === 'chips' ? (
                <div className="chips" role="radiogroup" aria-label={s.label}>
                  {options[s.options!].map((o) => (
                    <label className="chip" key={o}>
                      <input type="radio" name={s.key} value={o} checked={values[s.key] === o} onChange={() => choose(s.key, o, i)} />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="field">
                  <label className="label" htmlFor={`f-${s.key}`}>{s.label}</label>
                  {s.kind === 'textarea' ? (
                    <textarea className="textarea" id={`f-${s.key}`} name={s.key} maxLength={600} rows={4} value={values.message}
                      onChange={(e) => set('message', e.target.value)} aria-describedby={errId} />
                  ) : (
                    <input
                      className="input" id={`f-${s.key}`} name={s.key} type={s.kind}
                      inputMode={s.kind === 'tel' ? 'tel' : undefined}
                      autoComplete={s.key === 'name' ? 'name' : s.key === 'phone' ? 'tel-national' : 'email'}
                      maxLength={s.key === 'name' ? 80 : s.key === 'phone' ? 18 : 120}
                      placeholder={s.key === 'phone' ? '98765 43210' : undefined}
                      value={values[s.key]} required={s.key !== 'message'}
                      aria-invalid={err ? true : undefined} aria-describedby={errId}
                      onChange={(e) => { set(s.key, e.target.value as never); if (err) clearError(s.key); }}
                      onBlur={(e) => { if (e.target.value) setErrors((er) => ({ ...er, [s.key]: validate(s.key, values) })); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); next(); } }}
                    />
                  )}
                  {s.key === 'phone' ? <span className="hint">Format hint: 10 digits, starting with 6, 7, 8 or 9.</span> : null}
                  <p className="field-error" id={errId}>{err}</p>
                </div>
              )}
              {s.kind === 'chips' ? <p className="field-error" id={errId}>{err}</p> : null}
              {actions(i, i === STEPS.length - 1 ? (<>Review my answers <Icon name="arrow" size={18} /></>) : undefined)}
            </fieldset>
          );
        })}

        <fieldset className={cardClass(REVIEW_INDEX)} ref={(el) => { cards.current[REVIEW_INDEX] = el; }} inert={current !== REVIEW_INDEX}>
          <legend>Does everything look right?</legend>
          <p className="step-help">Check your answers. Use Change to fix anything, then send.</p>
          <dl className="summary">
            {SUMMARY.map((r, i) => {
              const raw = values[r.key];
              const shown = r.key === 'phone' && normalisePhone(raw) ? `+91 ${normalisePhone(raw)}` : r.key === 'message' ? (raw.trim() || 'None') : raw.trim();
              return (
                <div className="summary-row" key={r.key}>
                  <dt>{r.label}</dt>
                  <dd>{shown}</dd>
                  <button type="button" className="summary-edit" aria-label={`Change ${r.label.toLowerCase()}`} onClick={() => go(i)}>Change</button>
                </div>
              );
            })}
          </dl>
          <label className="consent">
            <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => { set('consent', e.target.checked); clearError('review'); }} />
            <span>I agree that {siteName} may contact me about my class, as described in the <Link href="/privacy-policy" target="_blank" rel="noopener">privacy policy</Link>.</span>
          </label>
          <p className="field-error" id="e-consent">{errors.review}</p>
          <div className="hp" aria-hidden="true">
            <label>Leave this empty <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} /></label>
          </div>
          {alert ? <div className="form-alert" role="alert">{alert}</div> : null}
          <div className="step-actions">
            <button className="btn btn-ghost btn-back" type="button" onClick={() => go(REVIEW_INDEX - 1)}>Back</button>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? (<><span className="spinner" aria-hidden="true" /> Sending</>) : 'Send my request'}
            </button>
          </div>
        </fieldset>

        <div className={cardClass(DONE_INDEX, 'step-success')} ref={(el) => { cards.current[DONE_INDEX] = el; }} tabIndex={-1} aria-live="polite" inert={current !== DONE_INDEX}>
          <div className="checkmark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h2 className="step-title" style={{ float: 'none' }}>Thank you, {done?.name || 'friend'}.</h2>
          <p>
            {done?.emailConfigured
              ? `Your request is in. We have emailed a confirmation to ${done.email}, and a teacher will contact you within one working day to fix your free trial class.`
              : 'Your request is in. A teacher will contact you within one working day to fix your free trial class.'}
          </p>
          <Link className="btn btn-ghost" href="/blog">Read the journal while you wait</Link>
        </div>
      </div>
    </form>
  );
}
