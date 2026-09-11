"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signup } from "@/lib/api";

type Role = "health_worker" | "doctor" | "admin";

const roleLabels: Record<Role, string> = {
  health_worker: "Health Worker",
  doctor: "Doctor",
  admin: "Admin",
};

export default function SignupPage() {
  const searchParams = useSearchParams();

  const requestedRole = searchParams.get("role") as Role | null;

  const initialRole: Role =
    requestedRole && requestedRole in roleLabels
      ? requestedRole
      : "health_worker";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !organization || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await signup({
        name,
        email,
        password,
        role,
        organization,
      });

      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setName("");
      setEmail("");
      setOrganization("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(
        err.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020611] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight transition hover:opacity-80"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            ← Back to Login
          </Link>
        </div>
      </header>

      {/* SIGNUP AREA */}
      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div className="relative w-full max-w-[620px]">
          {/* CARD */}
          <div className="rounded-3xl border border-white/10 bg-[#0a1527] p-8 shadow-2xl shadow-black/30 sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
              RS
            </div>

            <h1 className="mt-7 text-4xl font-bold tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Create a RetinaScreen account to access the screening platform.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* ORGANIZATION */}
              <div>
                <label
                  htmlFor="organization"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Organization / PHC
                </label>

                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  placeholder="Enter PHC, hospital or organization"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* ROLE */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Platform Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as Role)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                >
                  <option value="health_worker">Health Worker</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
                  <p className="text-sm leading-6 text-red-300">
                    {error}
                  </p>
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <p className="text-sm leading-6 text-emerald-300">
                    {success}
                  </p>

                  <Link
                    href={`/login/${role === "health_worker" ? "health-worker" : role}`}
                    className="mt-3 inline-block text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Continue to Sign In →
                  </Link>
                </div>
              )}

              {/* CREATE ACCOUNT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            {/* LOGIN */}
            <div className="mt-7 border-t border-white/10 pt-7 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="mt-2 inline-block text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Sign in to RetinaScreen →
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-600">
            RetinaScreen provides AI-assisted screening support. Clinical
            decisions remain with qualified healthcare professionals.
          </p>
        </div>
      </section>
    </main>
  );
}