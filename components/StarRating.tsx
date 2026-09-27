const STAR_PATH = "M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 8.9l7.1-.6L12 2z";

function Star({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className="flex-none">
      <path d={STAR_PATH} />
    </svg>
  );
}

export default function StarRating({
  score,
  size = 14,
  showValue = true,
}: {
  score: number;
  size?: number;
  showValue?: boolean;
}) {
  const rating = (score / 100) * 5;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className="inline-flex items-center" style={{ gap: 6 }}>
      <span className="relative inline-flex" style={{ width: size * 5, height: size }}>
        <span className="absolute inset-0 flex">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} color="#E5EBEE" size={size} />
          ))}
        </span>
        <span className="absolute inset-0 flex overflow-hidden" style={{ width: `${pct}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} color="#E8A200" size={size} />
          ))}
        </span>
      </span>
      {showValue && (
        <span style={{ fontSize: size, color: "#0F1A1C", fontWeight: 700 }}>{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
