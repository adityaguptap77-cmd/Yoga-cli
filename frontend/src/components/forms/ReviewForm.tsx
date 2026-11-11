'use client';

import { useEffect, useState, type FormEvent } from 'react';

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [ready, setReady] = useState(false); // inert until hydrated, so an early submit cannot fall back to a native GET
  useEffect(() => setReady(true), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (body.trim().length < 20) return setError('Please write at least a couple of sentences (20+ characters).');
    setBusy(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, city, rating, body, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSent(true);
        setName(''); setCity(''); setBody(''); setRating(5);
      } else {
        const first = data.errors ? Object.values(data.errors as Record<string, string>)[0] : '';
        setError(first || data.message || 'We could not send your review. Please try again.');
      }
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="review-form" noValidate inert={!ready} onSubmit={submit}>
      <h2 id="write-title">Share your experience</h2>
      <p className="step-help">Attended a class? Tell others what it was like. Reviews are checked before they are published.</p>

      {sent ? <div className="notice" role="status">Thank you. Your review has been received and will appear once our team has read it.</div> : null}
      {error ? <div className="form-alert" role="alert">{error}</div> : null}

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 1.1rem' }}>
        <legend className="label">Your rating</legend>
        <div className="rating-input">
          {[5, 4, 3, 2, 1].map((i) => (
            <span key={i} style={{ display: 'contents' }}>
              <input type="radio" name="rating" id={`rate-${i}`} value={i} checked={rating === i} onChange={() => setRating(i)} />
              <label htmlFor={`rate-${i}`} title={`${i} star${i > 1 ? 's' : ''}`}>
                <span className="sr-only">{i} star{i > 1 ? 's' : ''}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z" fill="currentColor" /></svg>
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      <div className="field"><label className="label" htmlFor="r-name">Your name</label><input className="input" id="r-name" name="name" type="text" maxLength={60} autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="field"><label className="label" htmlFor="r-city">City <span className="hint">(optional)</span></label><input className="input" id="r-city" name="city" type="text" maxLength={60} autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} /></div>
      <div className="field"><label className="label" htmlFor="r-body">Your review</label><textarea className="textarea" id="r-body" name="body" rows={5} maxLength={700} required value={body} onChange={(e) => setBody(e.target.value)} /><span className="hint">At least a couple of sentences, please.</span></div>
      <div className="hp" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Sending' : 'Submit my review'}</button>
    </form>
  );
}
