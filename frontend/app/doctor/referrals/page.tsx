"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getReferrals } from "@/lib/api";

type Referral = {
  id: number;
  patient_id: number;
  screening_id: number;
  referred_by: number | null;
  reason: string;
  priority: string;
  status: string;
  doctor_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

export default function DoctorReferralsPage() {
  const router = useRouter();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "doctor") {
        router.replace("/");
        return;
      }

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

  function handleLogout() {
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
    const value = priority.toLowerCase();

    if (value === "high" || value === "urgent") {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    if (value === "routine") {
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-400";
  }

  function getStatusStyle(status: string) {
    const value = status.toLowerCase();

    if (value === "pending") {
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    if (value === "under_review") {
      return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
    }

    if (value === "completed" || value === "confirmed") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-400";
  }

  function formatStatus(status: string) {
    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading referral queue...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* NAVBAR */}
      <header className="border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/doctor"
            className="text-xl font-bold tracking-tight"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/doctor"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Specialist Review
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Referral Queue
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Review patients referred from retinal screening and
              access their screening information before making a
              clinical decision.
            </p>
          </div>

          <button
            onClick={loadReferrals}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
          >
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total referrals"
            value={referrals.length}
          />

          <StatCard
            label="Pending review"
            value={
              referrals.filter(
                (item) => item.status === "pending",
              ).length
            }
          />

          <StatCard
            label="High priority"
            value={
              referrals.filter(
                (item) =>
                  item.priority === "high" ||
                  item.priority === "urgent",
              ).length
            }
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3.5">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!error && referrals.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-[#071222] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl font-bold text-cyan-300">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No referrals yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Referrals created by health workers will appear here
              for specialist review.
            </p>
          </div>
        )}

        {/* REFERRAL LIST */}
        {referrals.length > 0 && (
          <div className="mt-8 space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="rounded-3xl border border-white/10 bg-[#071222] p-6 transition hover:border-white/15"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* PATIENT */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
                        Referral #{referral.id}
                      </p>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getPriorityStyle(
                          referral.priority,
                        )}`}
                      >
                        {referral.priority}
                      </span>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                          referral.status,
                        )}`}
                      >
                        {formatStatus(referral.status)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-semibold">
                      Patient #{referral.patient_id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Screening #{referral.screening_id}
                    </p>
                  </div>

                  {/* ACTION */}
                  <Link
                    href={`/doctor/referrals/${referral.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Review Referral →
                  </Link>
                </div>

                {/* DETAILS */}
                <div className="mt-6 grid gap-5 border-t border-white/5 pt-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Referral reason
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {referral.reason}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Created
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {formatDate(referral.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTICE */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.015] px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            <span className="font-semibold text-slate-500">
              Clinical notice:
            </span>{" "}
            Referral information is provided for specialist review.
            Final clinical decisions should be made by a qualified
            healthcare professional.
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