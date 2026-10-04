// src/helpers/sort.helper.ts
export type SortKind = 'text' | 'number';
export type SortDirection = 'asc' | 'desc';

// Numeric cells such as "£45 000" or "£34,000.50" are compared by their digits and decimal point.
function toNumber(value: string): number {
  return Number(value.replace(/[^\d.]/g, ''));
}

export function sortedCopy(
  values: string[],
  kind: SortKind,
  direction: SortDirection,
): string[] {
  const compare =
    kind === 'number'
      ? (a: string, b: string) => toNumber(a) - toNumber(b)
      : (a: string, b: string) => a.localeCompare(b);
  // Negate the comparator for descending so tied rows keep their original order (a reverse would flip them).
  const sign = direction === 'asc' ? 1 : -1;
  return [...values].sort((a, b) => sign * compare(a, b));
}
