// helpers/currency.helper.ts
export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}
