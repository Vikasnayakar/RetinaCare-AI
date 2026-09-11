"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getReferrals } from "@/lib/api";

type Referral = {
  id: number;
  patient_id: number;
  screening_id: number;
  reason: string;
  priority: string;
  status: string;
  created_at: string;
};

export default function DoctorDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (!saved) {
      router.replace("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(saved);

      if (parsedUser.role !== "doctor") {
        router.replace("/");
        return;
      }

      setUser(parsedUser);
      loadReferrals();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router]);

  async function loadReferrals() {
    try {
      setLoading(true);
      setError("");

      const data = await getReferrals();

      setReferrals(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load referrals.",
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.replace("/");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getPriorityStyle(priority: string) {
    if (
      priority === "high" ||
      priority === "urgent"
    ) {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  if (!user) {
    return null;
  }

  const pendingReferrals = referrals.filter(
    (referral) =>
      referral.status === "pending",
  );

  const completedReferrals = referrals.filter(
    (referral) =>
      referral.status === "completed",
  );

  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/doctor"
            className="text-xl font-bold tracking-tight"
          >
            Retina
            <span className="text-cyan-400">
              Screen
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/doctor/referrals"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Referral Queue
            </Link>

            <Link
              href="/doctor/reports"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Reports
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Doctor Workspace
        </p>

        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome, {user.name}.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review referred screenings and validate
              AI-assisted results.
            </p>
          </div>

          <button
            onClick={loadReferrals}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Pending reviews"
            value={pendingReferrals.length}
          />

          <StatCard
            label="Completed reviews"
            value={completedReferrals.length}
          />

          <StatCard
            label="Total referrals"
            value={referrals.length}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3.5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* PENDING REVIEWS */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#071222] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-600">
                Specialist Review
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Pending Reviews
              </h2>
            </div>

            <Link
              href="/doctor/referrals"
              className="text-sm text-cyan-400 transition hover:text-cyan-300"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

              <p className="text-sm text-slate-500">
                Loading referrals...
              </p>
            </div>
          ) : pendingReferrals.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                ✓
              </div>

              <h3 className="mt-4 font-medium">
                No pending reviews
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                New specialist referrals will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {pendingReferrals
                .slice(0, 5)
                .map((referral) => (
                  <div
                    key={referral.id}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-white/10"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-600">
                            Referral #{referral.id}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getPriorityStyle(
                              referral.priority,
                            )}`}
                          >
                            {referral.priority}
                          </span>

                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                            Pending
                          </span>
                        </div>

                        <h3 className="mt-3 font-semibold">
                          Patient #{referral.patient_id}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Screening #
                          {referral.screening_id}
                        </p>

                        <p className="mt-2 text-xs text-slate-600">
                          {formatDate(
                            referral.created_at,
                          )}
                        </p>
                      </div>

                      <Link
                        href={`/doctor/referrals/${referral.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* QUICK ACCESS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/doctor/referrals"
            className="rounded-2xl border border-white/10 bg-[#071222] p-6 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.02]"
          >
            <p className="text-sm font-semibold">
              Referral Queue
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View all referred patients and open their
              screening records.
            </p>

            <p className="mt-4 text-sm font-medium text-cyan-400">
              Open queue →
            </p>
          </Link>

          <Link
            href="/doctor/reports"
            className="rounded-2xl border border-white/10 bg-[#071222] p-6 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.02]"
          >
            <p className="text-sm font-semibold">
              Screening Reports
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Generate and download complete screening
              reports with clinical review details.
            </p>

            <p className="mt-4 text-sm font-medium text-cyan-400">
              Open reports →
            </p>
          </Link>

          <Link
            href="/doctor/follow-ups"
            className="rounded-2xl border border-white/10 bg-[#071222] p-6 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.02]"
          >
            <p className="text-sm font-semibold">
              Follow-ups
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Track patients requiring continued clinical
              follow-up.
            </p>

            <p className="mt-4 text-sm font-medium text-cyan-400">
              View follow-ups →
            </p>
          </Link>
        </div>

        {/* NOTICE */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.015] px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            RetinaScreen provides AI-assisted screening
            support. Final clinical decisions remain with
            qualified healthcare professionals.
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071222] p-5">
      <p className="text-xs uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-100">
        {value}
      </p>
    </div>
  );
}