export function ErrorBanner({ error }) {
  if (!error) return null;
  return <div className="rounded-md border border-coral/20 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">{error.response?.data?.message || error.message}</div>;
}
