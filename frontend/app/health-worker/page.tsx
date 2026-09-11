"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPatients, getPatientScreenings } from "@/lib/api";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
  created_at?: string;
};

type Screening = {
  id: number;
  patient_id: number;
  quality: string;
  quality_score: number;
  dr_grade: number | null;
  severity: string | null;
  confidence: number | null;
  risk: string | null;
  referral_required: boolean;
  created_at: string;
};

export default function HealthWorkerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login/health-worker";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.role !== "health_worker") {
        window.location.href = "/login";
        return;
      }

      setUser(parsedUser);
      loadDashboard(parsedUser.id);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login/health-worker";
    }
  }, []);

  async function loadDashboard(healthWorkerId: number) {
    try {
      setLoading(true);
      setError("");

      const patientData = await getPatients(healthWorkerId);
      const patientList = Array.isArray(patientData) ? patientData : [];

      setPatients(patientList);

      const screeningResults = await Promise.all(
        patientList.map(async (patient) => {
          try {
            const data = await getPatientScreenings(patient.id);
            return Array.isArray(data) ? data : [];
          } catch {
            return [];
          }
        }),
      );

      setScreenings(screeningResults.flat());
    } catch (err: any) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const completed = screenings.filter(
      (screening) => screening.dr_grade !== null,
    ).length;

    const referrals = screenings.filter(
      (screening) => screening.referral_required,
    ).length;

    const poorQuality = screenings.filter(
      (screening) => screening.quality === "poor",
    ).length;

    return {
      patients: patients.length,
      screenings: screenings.length,
      completed,
      referrals,
      poorQuality,
    };
  }, [patients, screenings]);

  const recentPatients = patients.slice(0, 5);

  const recentScreenings = [...screenings]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  function getPatientName(patientId: number) {
    return (
      patients.find((patient) => patient.id === patientId)?.name ||
      `Patient #${patientId}`
    );
  }

  function getSeverityStyle(severity: string | null) {
    if (!severity) {
      return "border-slate-700 bg-slate-800/50 text-slate-400";
    }

    const value = severity.toLowerCase();

    if (value.includes("proliferative") || value.includes("severe")) {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    if (value.includes("moderate")) {
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    if (value.includes("mild")) {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    }

    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">Health Worker</p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Health Worker Portal
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Welcome back, {user.name?.split(" ")[0] || "Health Worker"}.
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Manage patients, perform retinal screenings and track referrals
              from one place.
            </p>
          </div>

          <Link
            href="/health-worker/patients/new"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            + Register Patient
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4">
            <p className="text-sm text-red-300">{error}</p>

            <button
              onClick={() => user && loadDashboard(user.id)}
              className="rounded-lg border border-red-400/20 px-4 py-2 text-sm text-red-300 hover:bg-red-400/10"
            >
              Retry
            </button>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <section className="mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/health-worker/patients/new"
              className="group rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.12] to-transparent p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                  +
                </div>

                <span className="text-cyan-400 transition group-hover:translate-x-1">
                  →
                </span>
              </div>

              <h2 className="mt-6 text-lg font-semibold">
                Register Patient
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create a new patient record and begin their screening journey.
              </p>
            </Link>

            <Link
              href="/health-worker/patients"
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/10 text-xl">
                  ◉
                </div>

                <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                  →
                </span>
              </div>

              <h2 className="mt-6 text-lg font-semibold">
                Patient Records
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View registered patients, screening history and patient
                details.
              </p>
            </Link>

            <Link
              href="/health-worker/referrals"
              className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-xl">
                  !
                </div>

                <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                  →
                </span>
              </div>

              <h2 className="mt-6 text-lg font-semibold">Referrals</h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track patients requiring specialist review and follow-up.
              </p>
            </Link>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold">Screening Overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current activity from your registered patients.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Patients"
              value={stats.patients}
              description="Registered records"
              icon="P"
            />

            <StatCard
              label="Screenings"
              value={stats.screenings}
              description="Screening sessions"
              icon="S"
            />

            <StatCard
              label="Completed"
              value={stats.completed}
              description="AI assessments"
              icon="✓"
            />

            <StatCard
              label="Referrals"
              value={stats.referrals}
              description="Need specialist review"
              icon="!"
            />
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* RECENT PATIENTS */}
          <div className="rounded-2xl border border-white/10 bg-[#071222]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="font-semibold">Recent Patients</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest registered patient records
                </p>
              </div>

              <Link
                href="/health-worker/patients"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {loading ? (
                <LoadingRows />
              ) : recentPatients.length === 0 ? (
                <EmptyState
                  title="No patients yet"
                  text="Register your first patient to begin screening."
                />
              ) : (
                recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/health-worker/patients/${patient.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/[0.025]"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 font-semibold text-cyan-300">
                        {patient.name?.charAt(0)?.toUpperCase() || "P"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {patient.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          ID #{patient.id} · {patient.age} years ·{" "}
                          {patient.gender}
                        </p>
                      </div>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-500">Village</p>
                      <p className="mt-1 max-w-[130px] truncate text-sm text-slate-300">
                        {patient.village || "—"}
                      </p>
                    </div>

                    <span className="text-slate-600">→</span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* SCREENING ACTIVITY */}
          <div className="rounded-2xl border border-white/10 bg-[#071222]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">Recent Screening Activity</h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest AI-assisted screening results
              </p>
            </div>

            <div className="divide-y divide-white/5">
              {loading ? (
                <LoadingRows />
              ) : recentScreenings.length === 0 ? (
                <EmptyState
                  title="No screenings yet"
                  text="Start a screening from a patient record."
                />
              ) : (
                recentScreenings.map((screening) => (
                  <div key={screening.id} className="px-6 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium">
                          {getPatientName(screening.patient_id)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(screening.created_at)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getSeverityStyle(
                          screening.severity,
                        )}`}
                      >
                        {screening.severity || "Pending"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs">
                      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-400">
                        Grade{" "}
                        {screening.dr_grade !== null
                          ? screening.dr_grade
                          : "Pending"}
                      </span>

                      <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-slate-400">
                        Quality {screening.quality_score}%
                      </span>

                      {screening.referral_required && (
                        <span className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-red-300">
                          Referral required
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* OFFLINE STATUS */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#071222] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
              </div>

              <div>
                <p className="font-medium">System connected</p>
                <p className="mt-1 text-xs text-slate-500">
                  Your dashboard is connected to the screening backend.
                </p>
              </div>
            </div>

            <Link
              href="/health-worker/sync"
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
            >
              Sync & Offline →
            </Link>
          </div>
        </section>

        {/* DISCLAIMER */}
        <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-4">
          <p className="text-xs leading-6 text-slate-500">
            <span className="font-semibold text-slate-400">
              Screening support:
            </span>{" "}
            AI results are intended to assist screening and referral workflows.
            They are not a definitive diagnosis. Clinical review is required
            for medical decision-making.
          </p>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071222] p-5 transition hover:border-cyan-400/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="mt-3 text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 text-sm font-bold text-cyan-300">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-600">{description}</p>
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse px-6 py-5">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="mt-3 h-3 w-48 rounded bg-white/5" />
        </div>
      ))}
    </>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-500">
        —
      </div>

      <p className="mt-4 font-medium text-slate-300">{title}</p>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}