"use client";

import { useEffect, useState } from "react";
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
  reviewed_at?: string | null;
  doctor_notes?: string | null;
};

export default function DoctorFollowUpsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/";
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "doctor") {
        window.location.href = "/";
        return;
      }
    } catch {
      window.location.href = "/";
      return;
    }

    loadFollowUps();
  }, []);

  async function loadFollowUps() {
    try {
      setLoading(true);
      setError("");

      const data = await getReferrals();
      setReferrals(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load follow-up records."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const completed = referrals.filter(
    (referral) => referral.status === "completed"
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/doctor"
            className="text-xl font-bold tracking-tight"
          >
            RetinaScreen
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/doctor"
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>

            <Link
              href="/doctor/referrals"
              className="text-slate-600 hover:text-slate-900"
            >
              Referral Queue
            </Link>

            <button
              onClick={logout}
              className="font-medium text-slate-700 hover:text-slate-950"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Doctor Workspace
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Follow-ups
          </h1>

          <p className="mt-2 text-slate-600">
            Review completed specialist assessments and follow-up records.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total referrals</p>
            <p className="mt-2 text-3xl font-bold">{referrals.length}</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed reviews</p>
            <p className="mt-2 text-3xl font-bold">{completed.length}</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending reviews</p>
            <p className="mt-2 text-3xl font-bold">
              {referrals.length - completed.length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">
                Completed Specialist Reviews
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Patients whose referrals have already been reviewed.
              </p>
            </div>

            <button
              onClick={loadFollowUps}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Loading follow-ups...
            </div>
          ) : completed.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-800">
                No completed follow-ups
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Completed specialist reviews will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {completed.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        Referral #{referral.id}
                      </span>

                      <span className="text-sm text-slate-500">
                        · Patient #{referral.patient_id}
                      </span>

                      <span className="text-sm text-slate-500">
                        · Screening #{referral.screening_id}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        Completed
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      {referral.reason}
                    </p>

                    {referral.doctor_notes && (
                      <p className="mt-2 text-sm text-slate-500">
                        Doctor notes: {referral.doctor_notes}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400">
                      Reviewed{" "}
                      {referral.reviewed_at
                        ? new Date(
                            referral.reviewed_at
                          ).toLocaleString()
                        : "—"}
                    </p>
                  </div>

                  <Link
                    href={`/doctor/referrals/${referral.id}`}
                    className="shrink-0 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                  >
                    View Review →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}