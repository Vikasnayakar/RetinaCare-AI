"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  getReferrals,
  getDoctorReview,
} from "@/lib/api";

type Referral = {
  id: number;
  patient_id: number;
  screening_id: number;
  reason: string;
  priority: string;
  status: string;
  created_at: string;
  doctor_notes?: string | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
};

type DoctorReview = {
  id: number;
  referral_id: number;
  doctor_id: number;
  decision: string;
  final_grade: number | null;
  clinical_notes: string | null;
  reviewed_at: string;
};

const gradeLabels: Record<number, string> = {
  0: "Grade 0 — No Diabetic Retinopathy",
  1: "Grade 1 — Mild NPDR",
  2: "Grade 2 — Moderate NPDR",
  3: "Grade 3 — Severe NPDR",
  4: "Grade 4 — Proliferative DR",
};

export default function HealthWorkerReferralsPage() {
  const router = useRouter();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [reviews, setReviews] = useState<Record<number, DoctorReview>>({});
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

      if (user.role !== "health_worker") {
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

      const referralList: Referral[] = data || [];

      setReferrals(referralList);

      // Load detailed doctor reviews
      const completedReferrals = referralList.filter(
        (referral) => referral.status === "completed",
      );

      const results = await Promise.all(
        completedReferrals.map(async (referral) => {
          try {
            const review = await getDoctorReview(
              referral.id,
            );

            return {
              referralId: referral.id,
              review,
            };
          } catch {
            return null;
          }
        }),
      );

      const reviewMap: Record<
        number,
        DoctorReview
      > = {};

      results.forEach((item) => {
        if (item) {
          reviewMap[item.referralId] = item.review;
        }
      });

      setReviews(reviewMap);
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
    if (
      priority === "high" ||
      priority === "urgent"
    ) {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  }

  function getStatusStyle(status: string) {
    if (status === "pending") {
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    if (status === "completed") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    return "border-slate-700 bg-slate-800/50 text-slate-400";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading referrals...
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
            href="/health-worker"
            className="text-xl font-bold tracking-tight"
          >
            Retina
            <span className="text-cyan-400">
              Screen
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/health-worker"
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

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Specialist Referrals
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Referral History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Track patients referred for specialist review
              after retinal screening.
            </p>
          </div>

          <button
            onClick={loadReferrals}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total referrals"
            value={referrals.length}
          />

          <StatCard
            label="Pending"
            value={
              referrals.filter(
                (referral) =>
                  referral.status === "pending",
              ).length
            }
          />

          <StatCard
            label="Completed"
            value={
              referrals.filter(
                (referral) =>
                  referral.status === "completed",
              ).length
            }
          />
        </div>

        {/* EMPTY */}
        {!error && referrals.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-[#071222] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-300">
              ✓
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No referrals yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Referrals created from patient screenings
              will appear here.
            </p>
          </div>
        )}

        {/* REFERRALS */}
        {referrals.length > 0 && (
          <div className="mt-8 space-y-4">
            {referrals.map((referral) => {
              const review = reviews[referral.id];

              return (
                <div
                  key={referral.id}
                  className="rounded-3xl border border-white/10 bg-[#071222] p-6"
                >
                  {/* HEADER */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-slate-600">
                          Referral #{referral.id}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getPriorityStyle(
                            referral.priority,
                          )}`}
                        >
                          {referral.priority}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyle(
                            referral.status,
                          )}`}
                        >
                          {referral.status}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-semibold">
                        Patient #{referral.patient_id}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Screening #{referral.screening_id}
                      </p>
                    </div>
                  </div>

                  {/* BASIC INFORMATION */}
                  <div className="mt-5 grid gap-5 border-t border-white/5 pt-5 md:grid-cols-2">
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
                        {formatDate(
                          referral.created_at,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* PENDING */}
                  {referral.status === "pending" && (
                    <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/[0.05] px-5 py-4">
                      <p className="text-sm font-medium text-amber-300">
                        Awaiting specialist review
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-200/60">
                        The referred screening has not yet
                        been reviewed by a specialist.
                      </p>
                    </div>
                  )}

                  {/* DOCTOR REVIEW */}
                  {referral.status === "completed" && (
                    <div className="mt-6 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                          ✓
                        </div>

                        <div>
                          <h3 className="font-semibold text-emerald-300">
                            Specialist Review Completed
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Doctor&apos;s clinical assessment
                          </p>
                        </div>
                      </div>

                      {review ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          {/* DECISION */}
                          <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                            <p className="text-[11px] uppercase tracking-wider text-slate-600">
                              Doctor&apos;s decision
                            </p>

                            <p className="mt-2 text-sm font-semibold capitalize text-slate-200">
                              {review.decision}
                            </p>
                          </div>

                          {/* FINAL GRADE */}
                          <div className="rounded-2xl border border-white/5 bg-black/10 p-4">
                            <p className="text-[11px] uppercase tracking-wider text-slate-600">
                              Final DR grade
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-200">
                              {review.final_grade !== null &&
                              review.final_grade !== undefined
                                ? gradeLabels[
                                    review.final_grade
                                  ]
                                : "Not recorded"}
                            </p>
                          </div>

                          {/* NOTES */}
                          <div className="rounded-2xl border border-white/5 bg-black/10 p-4 md:col-span-2">
                            <p className="text-[11px] uppercase tracking-wider text-slate-600">
                              Doctor&apos;s clinical notes
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                              {review.clinical_notes ||
                                referral.doctor_notes ||
                                "No clinical notes recorded."}
                            </p>
                          </div>

                          {/* REVIEW DATE */}
                          <div className="md:col-span-2">
                            <p className="text-xs text-slate-600">
                              Reviewed by Doctor #
                              {review.doctor_id} ·{" "}
                              {formatDate(
                                review.reviewed_at,
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-xl border border-white/5 bg-black/10 p-4">
                          <p className="text-sm text-slate-500">
                            The referral is completed, but
                            detailed doctor review information
                            could not be loaded.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NOTICE */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.015] px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            Referral status and specialist feedback are
            displayed for healthcare workflow purposes.
            Final clinical decisions remain the responsibility
            of a qualified healthcare professional.
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