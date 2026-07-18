export const metadata = { title: "Terms of Service — Plazo" };

export default function TermsPage() {
  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Terms of Service</h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">This is a draft, not a finished legal document.</p>
        <p className="mt-1">
          It&apos;s a reasonable starting point, but since Plazo isn&apos;t limited to any one
          country, the specific legal requirements that apply depend on where your users
          actually are. Have a lawyer review and finalize this for the jurisdictions you launch
          in before relying on it.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-5 text-sm text-gray-700">
        <section>
          <h2 className="font-semibold text-gray-900">1. Using Plazo</h2>
          <p className="mt-1">
            You must be at least 18 years old to create an account. You&apos;re responsible for
            the accuracy of anything you post and for keeping your account credentials secure.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">2. Prohibited listings</h2>
          <p className="mt-1">You may not post listings for, or use Plazo to arrange:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Sexual services, escort services, or adult companionship of any kind</li>
            <li>Illegal goods, stolen property, or counterfeit items</li>
            <li>Weapons, explosives, or hazardous materials where prohibited by law</li>
            <li>Content that exploits or endangers minors</li>
            <li>Fraudulent, deceptive, or scam listings</li>
          </ul>
          <p className="mt-2">
            We reserve the right to remove any listing and suspend any account that violates
            these terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">3. Transactions between users</h2>
          <p className="mt-1">
            Plazo connects buyers and sellers but is not a party to any transaction between
            them. We don&apos;t verify listings, inspect items, or process payments. Meet safely,
            verify what you&apos;re buying before you pay, and use good judgment.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">4. Limitation of liability</h2>
          <p className="mt-1">
            Plazo is provided &quot;as is&quot; without warranties of any kind. We are not liable
            for losses arising from transactions, interactions, or content between users.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">5. Changes</h2>
          <p className="mt-1">
            We may update these terms as the product evolves. Continued use after changes means
            you accept the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
