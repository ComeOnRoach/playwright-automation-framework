// helpers/currency.helper.ts
export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

// Matches a whole-pound amount whatever thousands separator the browser locale renders,
// e.g. 34000 matches "£34,000", "£34 000" and "£34.000".
export function gbpAmountPattern(amount: number): RegExp {
  const digits = String(amount);
  const head = digits.slice(0, -3);
  const tail = digits.slice(-3);
  return new RegExp(`^£${head}\\D?${tail}$`);
}
