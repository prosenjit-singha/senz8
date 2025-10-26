export function formatINRAmount(value: number | string): string {
  if (value === null || value === undefined || value === "") return "₹ 0";

  // Convert string to number safely
  const num =
    typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

  if (isNaN(num)) return "₹ 0";

  // Format number with Indian comma style
  const formatted = num.toLocaleString("en-IN");

  return formatted.startsWith("-")
    ? `- ₹ ${formatted.replace("-", "")}`
    : `₹ ${formatted}`;
}
