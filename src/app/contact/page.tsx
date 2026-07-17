export const metadata = { title: "Contact — Plazo" };

export default function ContactPage() {
  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="text-2xl font-semibold text-gray-900">Contact</h1>
      <div className="mt-6 flex flex-col gap-4 text-gray-700">
        <p>Questions, feedback, or something that needs reporting? Reach out any time.</p>
        <a href="mailto:hello@plazo.app" className="text-lg font-medium text-brand-600">
          hello@plazo.app
        </a>
        <p className="text-sm text-gray-500">
          (Placeholder address — swap this for a real support inbox before launch.)
        </p>
        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-medium text-gray-800">Reporting a scam or a bad listing?</p>
          <p className="mt-1">
            Include the listing link or the other user&apos;s username so we can look into it
            quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
