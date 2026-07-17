import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center">
      <div className="card w-full max-w-sm p-6">
        <h1 className="mb-1 text-xl font-semibold">Create an account</h1>
        <p className="mb-5 text-sm text-gray-500">
          Post listings and message other users.
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p>
        )}

        <form action={signup} className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input className="input" id="username" name="username" required />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input className="input" id="email" name="email" type="email" required />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
