import { cx } from "../utils/format.js";

export function Button({ className = "", variant = "primary", ...props }) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" ? "bg-moss text-white hover:bg-moss/90" : "border border-ink/15 bg-white text-ink hover:bg-ink/5",
        className
      )}
      {...props}
    />
  );
}
