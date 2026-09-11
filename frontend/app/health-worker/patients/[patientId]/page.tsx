"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { getPatient, getPatientScreenings } from "@/lib/api";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
};

type Screening = {
  id: number;
  patient_id: number;
  image_path: string;
  quality: string;
  quality_score: number;
  dr_grade: number | null;
  severity: string | null;
  confidence: number | null;
  lesions: string | null;
  explanation: string | null;
  risk: string | null;
  referral_required: boolean;
  created_at: string;
};

const severityStyles: Record<string, string> = {
  "No DR":
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  Mild:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  Moderate:
    "border-orange-500/20 bg-orange-500/10 text-orange-400",
  Severe:
    "border-red-500/20 bg-red-500/10 text-red-400",
  "Proliferative DR":
    "border-red-500/20 bg-red-500/10 text-red-400",
};

export default function PatientPage() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);

  const [loading, setLoading] = useState(true);
  const [screeningsLoading, setScreeningsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.patientId);

    if (!id) {
      setError("Invalid patient.");
      setLoading(false);
      setScreeningsLoading(false);
      return;
    }

    getPatient(id)
      .then(setPatient)
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

    getPatientScreenings(id)
      .then(setScreenings)
      .catch(() => {
        setScreenings([]);
      })
      .finally(() => {
        setScreeningsLoading(false);
      });
  }, [params.patientId]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading patient...
      </main>
    );
  }

  if (error || !patient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Patient not found</h1>

          <Link
            href="/health-worker/patients"
            className="mt-4 inline-block text-cyan-400 hover:text-cyan-300"
          >
            Back to patients
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 px-6 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/health-worker"
            className="text-xl font-bold tracking-tight"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <Link
            href="/health-worker/patients"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Patients
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        {/* BACK */}
        <Link
          href="/health-worker/patients"
          className="text-sm text-slate-500 transition hover:text-cyan-400"
        >
          ← Back to patients
        </Link>

        {/* PATIENT HEADER */}
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium tracking-wide text-cyan-400">
              PATIENT PROFILE
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              {patient.name}
            </h1>

            <p className="mt-2 text-slate-400">
              Patient #{patient.id}
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                `/health-worker/patients/${patient.id}/screening`
              )
            }
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start Screening
          </button>
        </div>

        {/* PATIENT INFORMATION */}
        <div className="mt-10">
          <p className="mb-4 text-sm font-medium text-slate-500">
            Patient information
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">Age</p>

              <p className="mt-2 text-lg font-semibold">
                {patient.age} years
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">Gender</p>

              <p className="mt-2 text-lg font-semibold">
                {patient.gender}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">Phone</p>

              <p className="mt-2 text-lg font-semibold">
                {patient.phone}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-500">Location</p>

              <p className="mt-2 text-lg font-semibold">
                {patient.village}
              </p>
            </div>
          </div>
        </div>

        {/* SCREENING HISTORY */}
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium tracking-wide text-slate-500">
                SCREENING HISTORY
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Previous screenings
              </h2>
            </div>

            {!screeningsLoading && screenings.length > 0 && (
              <span className="text-sm text-slate-500">
                {screenings.length}{" "}
                {screenings.length === 1
                  ? "screening"
                  : "screenings"}
              </span>
            )}
          </div>

          {/* LOADING */}
          {screeningsLoading && (
            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-slate-400">
                Loading screening history...
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!screeningsLoading && screenings.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl text-cyan-400">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No screenings recorded yet
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Start a retinal screening for this patient by
                uploading a fundus image.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/health-worker/patients/${patient.id}/screening`
                  )
                }
                className="mt-5 text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                Begin first screening →
              </button>
            </div>
          )}

          {/* SCREENING HISTORY LIST */}
          {!screeningsLoading && screenings.length > 0 && (
            <div className="mt-5 space-y-4">
              {screenings.map((screening) => {
                let lesions: string[] = [];

                try {
                  if (screening.lesions) {
                    const parsed = JSON.parse(screening.lesions);

                    if (Array.isArray(parsed)) {
                      lesions = parsed;
                    }
                  }
                } catch {
                  lesions = [];
                }

                const hasGrade =
                  screening.dr_grade !== null &&
                  screening.dr_grade !== undefined;

                const hasSeverity =
                  screening.severity !== null &&
                  screening.severity !== undefined &&
                  screening.severity !== "Pending";

                return (
                  <div
                    key={screening.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                  >
                    {/* HEADER */}
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          Screening #{screening.id}
                        </p>

                        <p className="mt-2 font-medium text-white">
                          {formatDate(screening.created_at)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Image quality:{" "}
                          <span className="text-slate-300">
                            {screening.quality}
                          </span>{" "}
                          · {screening.quality_score}%
                        </p>
                      </div>

                      {/* RESULT BADGE */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                            hasSeverity
                              ? severityStyles[
                                  screening.severity as string
                                ] ||
                                "border-slate-700 bg-slate-800 text-slate-300"
                              : "border-slate-700 bg-slate-800 text-slate-300"
                          }`}
                        >
                          {hasGrade
                            ? `Grade ${screening.dr_grade}`
                            : "AI Result Pending"}
                        </span>

                        {hasSeverity && (
                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                              severityStyles[
                                screening.severity as string
                              ] ||
                              "border-slate-700 bg-slate-800 text-slate-300"
                            }`}
                          >
                            {screening.severity}
                          </span>
                        )}

                        {screening.referral_required && (
                          <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400">
                            Referral recommended
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-6 grid gap-5 border-t border-slate-800 pt-5 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-500">
                          Model confidence
                        </p>

                        <p className="mt-1 font-medium text-slate-200">
                          {screening.confidence !== null &&
                          screening.confidence !== undefined
                            ? `${(
                                screening.confidence * 100
                              ).toFixed(1)}%`
                            : "Pending"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Detected lesions
                        </p>

                        <p className="mt-1 font-medium text-slate-200">
                          {lesions.length > 0
                            ? lesions.join(", ")
                            : "Pending"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Risk
                        </p>

                        <p className="mt-1 font-medium capitalize text-slate-200">
                          {screening.risk || "Pending"}
                        </p>
                      </div>
                    </div>

                    {/* AI EXPLANATION */}
                    {screening.explanation && (
                      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                          AI explanation
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {screening.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* ANOTHER SCREENING */}
              <button
                onClick={() =>
                  router.push(
                    `/health-worker/patients/${patient.id}/screening`
                  )
                }
                className="w-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-sm font-medium text-cyan-400 transition hover:border-cyan-500/40 hover:bg-slate-900"
              >
                + Start another screening
              </button>
            </div>
          )}
        </div>

        {/* CLINICAL NOTICE */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Clinical notice
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            RetinaScreen provides AI-assisted screening support.
            AI results should be reviewed by a qualified healthcare
            professional before clinical decisions or referrals are
            finalized.
          </p>
        </div>
      </section>
    </main>
  );
}