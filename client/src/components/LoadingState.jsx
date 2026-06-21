export function LoadingState({ label = "Loading..." }) {
  return <div className="rounded-md border border-ink/10 bg-white p-4 text-sm font-semibold text-ink/70">{label}</div>;
}
