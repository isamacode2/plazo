export const metadata = { title: "About — Plazo" };

export default function AboutPage() {
  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-gray-900">About Plazo</h1>
      <div className="mt-6 flex flex-col gap-4 text-gray-700">
        <p>
          Plazo is a local classifieds marketplace built for communities everywhere. It&apos;s a
          place to buy and sell items, find local services, discover housing and jobs, and
          connect with people organizing meetups and community events nearby.
        </p>
        <p>
          Posting is free, listings stay visible without paying to be seen, and every
          conversation happens through secure in-app messaging rather than exposing your phone
          number to strangers.
        </p>
        <p>
          Plazo is early — we&apos;re building it out with our community, category by category.
          If there&apos;s something you&apos;d like to see, or something that isn&apos;t working
          the way it should,{" "}
          <a href="/contact" className="text-brand-600 underline">
            get in touch
          </a>
          .
        </p>
      </div>
    </div>
  );
}
