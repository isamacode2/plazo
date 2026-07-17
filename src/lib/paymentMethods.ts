export const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "momo_mtn", label: "MTN Mobile Money" },
  { value: "momo_telecel", label: "Telecel Cash" },
  { value: "momo_airteltigo", label: "AirtelTigo Money" },
  { value: "bank_transfer", label: "Bank transfer" },
];

export function paymentMethodLabel(value: string): string {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;
}
