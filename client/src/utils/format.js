export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
