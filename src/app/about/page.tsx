import Link from "next/link";

export const metadata = { title: "About — Plazo" };

export default function AboutPage() {
  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-gray-900">About Plazo</h1>

      <div className="mt-6 flex flex-col gap-5 text-gray-700">
        <div className="flex flex-col gap-3">
          <p>
            Plazo is a local classifieds marketplace where people can buy and sell directly with
            one another.
          </p>
          <p>
            Create an account to post items for free, browse available listings, contact sellers
            and share listings with others.
          </p>
          <p>
            Plazo is not an online shop and does not sell products itself. It provides one
            marketplace where any user can buy, sell or do both using the same account.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How Plazo works</h2>
          <div className="mt-3 flex flex-col gap-3">
            <div>
              <h3 className="font-medium text-gray-900">Find something</h3>
              <p className="mt-1">
                Browse or search listings by category and location. Open a listing to view its
                photos, description, price and seller information.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Contact the seller</h3>
              <p className="mt-1">
                Use the Contact seller button to speak directly with the person who posted the
                listing, ask questions and arrange the next steps.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Sell something</h3>
              <p className="mt-1">
                Create an account, add your item details and photos, set your price and publish
                your listing for free.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Share your listing</h3>
              <p className="mt-1">
                Every listing includes a Share button, allowing users to send it through
                WhatsApp, social media or any other supported app.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">One marketplace for everyone</h2>
          <p className="mt-1">Plazo does not separate people into buyers and sellers.</p>
          <p className="mt-2">The same account can be used to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>browse and contact sellers;</li>
            <li>post items for sale;</li>
            <li>manage listings;</li>
            <li>communicate with other users;</li>
            <li>leave or receive reviews where applicable.</li>
          </ul>
          <p className="mt-2">You may be buying something today and selling something tomorrow.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Free local listings</h2>
          <p className="mt-1">Posting a listing on Plazo is free.</p>
          <p className="mt-1">
            Our aim is to make it simple for people to advertise what they have, discover items
            available around them and communicate directly without unnecessary barriers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Staying safe</h2>
          <p className="mt-1">
            Plazo connects buyers and sellers but does not inspect products, process payments,
            arrange delivery or participate in transactions.
          </p>
          <p className="mt-2">Before completing a purchase:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>inspect the item in person where possible;</li>
            <li>meet in a safe public location;</li>
            <li>confirm the seller and product details;</li>
            <li>avoid sending money before seeing the item;</li>
            <li>report anything that appears misleading or suspicious.</li>
          </ul>
          <p className="mt-2">
            Users are responsible for deciding whether to proceed with a transaction.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">What we are building</h2>
          <p className="mt-1">
            Plazo is being developed as a simple and accessible marketplace for local buying and
            selling.
          </p>
          <p className="mt-2">We are focused on making it easier to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>create clear listings;</li>
            <li>discover relevant items;</li>
            <li>communicate directly;</li>
            <li>share listings beyond the platform;</li>
            <li>build confidence between people using the marketplace.</li>
          </ul>
          <p className="mt-2">
            Plazo is still being improved, and the product will continue to develop based on how
            people use it and the feedback we receive.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Ready to get started?</h2>
          <p className="mt-1">
            <Link href="/" className="text-brand-600 underline">
              Browse listings
            </Link>{" "}
            or{" "}
            <Link href="/listings/new" className="text-brand-600 underline">
              post your first listing
            </Link>{" "}
            for free.
          </p>
        </section>
      </div>
    </div>
  );
}
