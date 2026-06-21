export function Field({ label, error, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-bold text-ink">{label}</span>
      {children}
      {error ? <span className="block text-sm text-coral">{error}</span> : null}
    </label>
  );
}

export const inputClass = "w-full rounded-md border border-ink/15 bg-white px-3 py-2 outline-none focus:border-moss focus:ring-2 focus:ring-moss/15";
