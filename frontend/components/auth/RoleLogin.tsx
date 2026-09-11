"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { login } from "@/lib/api";

type Role = "health_worker" | "doctor" | "admin";

const roleConfig = {
  health_worker: {
    title: "Health Worker Login",
    description:
      "Register patients, perform retinal screenings and manage referrals.",
    short: "HW",
  },

  doctor: {
    title: "Doctor Login",
    description:
      "Review referred screenings and validate AI-assisted results.",
    short: "DR",
  },

  admin: {
    title: "Admin Login",
    description:
      "Monitor users, facilities, screenings, referrals and platform activity.",
    short: "AD",
  },
};

export default function RoleLogin({ role }: { role: Role }) {
  const config = roleConfig[role];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email,
        password,
      });

      if (result.user.role !== role) {
        setError(
          `This account is registered as ${formatRole(
            result.user.role,
          )}. Please use the correct login portal.`,
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.access_token);

      if (result.user.role === "health_worker") {
        window.location.href = "/health-worker";
      } else if (result.user.role === "doctor") {
        window.location.href = "/doctor";
      } else if (result.user.role === "admin") {
        window.location.href = "/admin";
      }
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please try again.");
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
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            <span>←</span>
            Back to Home
          </Link>
        </div>
      </header>

      {/* LOGIN AREA */}
      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-6 py-12">
        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.035] blur-[120px]" />

        <div className="relative w-full max-w-[560px]">
          {/* LOGIN CARD */}
          <div className="rounded-3xl border border-white/10 bg-[#0a1527] p-8 shadow-2xl shadow-black/30 sm:p-10">
            {/* ROLE ICON */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-300">
              {config.short}
            </div>

            {/* TITLE */}
            <h1 className="mt-7 text-4xl font-bold tracking-tight">
              {config.title}
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
              {config.description}
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
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
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-[#091628] focus:ring-2 focus:ring-cyan-400/10"
                />
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-[#071222] px-5 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:bg-[#091628] focus:ring-2 focus:ring-cyan-400/10"
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

              {/* SIGN IN */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            {/* SIGN UP */}
            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?
              </p>

              <Link
                href={`/login/signup?role=${role}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/[0.06] px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-cyan-400/10"
              >
                Create an Account →
              </Link>
            </div>

            {/* ROLE SWITCHER */}
            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="mb-4 text-center text-xs uppercase tracking-[0.18em] text-slate-600">
                Other portals
              </p>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/login/health-worker"
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                    role === "health_worker"
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
                  }`}
                >
                  Health Worker
                </Link>

                <Link
                  href="/login/doctor"
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                    role === "doctor"
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
                  }`}
                >
                  Doctor
                </Link>

                <Link
                  href="/login/admin"
                  className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition ${
                    role === "admin"
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-slate-300"
                  }`}
                >
                  Admin
                </Link>
              </div>
            </div>
          </div>

          {/* DISCLAIMER */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-600">
            Account access is role-based. Use the portal assigned to your
            healthcare role.
          </p>
        </div>
      </section>
    </main>
  );
}

function formatRole(role: string) {
  if (role === "health_worker") return "Health Worker";
  if (role === "doctor") return "Doctor";
  if (role === "admin") return "Admin";

  return role;
}