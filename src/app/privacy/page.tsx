export const metadata = { title: "Privacy Policy — Plazo" };

export default function PrivacyPage() {
  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Privacy Policy</h1>

      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">This is a draft, not a finished legal document.</p>
        <p className="mt-1">
          Depending on where your users are, laws like the EU&apos;s GDPR or other regional data
          protection regulations may apply — these typically require a lawful basis for
          processing data, give users rights to access or delete their data, and set breach
          notification timelines. Since Plazo isn&apos;t limited to any one market, have a
          privacy lawyer review this before you launch, rather than relying on a copy-paste
          template.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-5 text-sm text-gray-700">
        <section>
          <h2 className="font-semibold text-gray-900">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Account info: email, username, and anything you add to your profile</li>
            <li>Listings you post: title, description, price, location, photos</li>
            <li>Messages you send through Plazo&apos;s messaging feature</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">How we use it</h2>
          <p className="mt-1">
            To run the marketplace: showing your listings to other users, connecting buyers and
            sellers through messaging, and keeping your account secure.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">Who processes it</h2>
          <p className="mt-1">
            Listing data, account data, and messages are stored with Supabase, our database and
            authentication provider. Uploaded photos are stored in Supabase Storage.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-gray-900">Your choices</h2>
          <p className="mt-1">
            You can edit or delete your own listings and photos at any time from your account.
            To delete your account entirely or request a copy of your data, contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
