export function daysUntil(dateString: string): number {
  const diffMs = new Date(dateString).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function expiryLabel(expiresAt: string): string {
  const days = daysUntil(expiresAt);
  if (days <= 0) return "Expired";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}
