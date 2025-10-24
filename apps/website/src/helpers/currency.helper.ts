const currencySymbol = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KRW: "₩",
  VND: "₫",
  THB: "฿",
  PHP: "₱",
  MYR: "RM",
  IDR: "Rp",
};

/**
 * Formats a number or numeric string into Indian currency format with ₹ and commas.
 * Examples:
 *   formatAmount(10235)       => "₹ 10,235"
 *   formatAmount("1500000")   => "₹ 15,00,000"
 */

export function formatAmount(
  value: number | string,
  currency: keyof typeof currencySymbol = "INR"
): string {
  if (value === null || value === undefined || value === "") return `${currencySymbol[currency]} 0`;

  // Convert string to number safely
  const num = typeof value === "string" ? Number(value.replace(/,/g, "")) : value;

  if (isNaN(num)) return `${currencySymbol[currency]} 0`;

  // Format number with Indian comma style
  const formatted = num.toLocaleString("en-IN");

  return formatted.startsWith("-")
    ? `- ${currencySymbol[currency]} ${formatted.replace("-", "")}`
    : `${currencySymbol[currency]} ${formatted}`;
}
