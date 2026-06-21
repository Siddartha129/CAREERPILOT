const tones = {
  SAVED: "bg-ink/10 text-ink",
  PREPARING: "bg-gold/15 text-gold",
  APPLIED: "bg-moss/10 text-moss",
  INTERVIEW: "bg-blue-100 text-blue-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-coral/10 text-coral"
};

export function StatusPill({ status }) {
  return <span className={`rounded-md px-2 py-1 text-xs font-black ${tones[status] || tones.SAVED}`}>{status}</span>;
}
