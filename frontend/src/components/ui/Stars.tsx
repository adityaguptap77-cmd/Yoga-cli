export default function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating) || 0));
  return (
    <span className="stars" role="img" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={i <= r ? 'on' : 'off'}>
          <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
