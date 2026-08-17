export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function clampQty(qty: number, max: number): number {
  if (qty < 1) return 1
  if (qty > max) return max
  return qty
}
