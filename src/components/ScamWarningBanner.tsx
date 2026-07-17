const CATEGORY_TIPS: Record<string, string> = {
  vehicles:
    "Common scam: a \"seller\" asks you to send money for fuel, delivery, or transport before you've seen the vehicle in person. Never send money to view or collect a car.",
  housing:
    "Common scam: a \"landlord\" who can't meet in person asks for a deposit or first month's rent before showing the property. Never pay a deposit before viewing the place and meeting the landlord.",
};

export default function ScamWarningBanner({ categorySlug }: { categorySlug?: string }) {
  const specific = categorySlug ? CATEGORY_TIPS[categorySlug] : undefined;

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <p className="font-medium">⚠️ Stay safe</p>
      <p className="mt-0.5">
        {specific ?? "Never send money before you've seen the item or met the seller in person."}{" "}
        Meet in a public place, and report anything that feels off.
      </p>
    </div>
  );
}
