"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getPatients } from "@/lib/api";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  village: string;
};

export default function PatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "health_worker") {
        router.replace("/");
        return;
      }

      getPatients(user.id)
        .then(setPatients)
        .catch((err) => {
          setError(err.message || "Unable to load patients.");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.replace("/");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading patient records...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 px-6 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/health-worker"
            className="text-xl font-bold tracking-tight"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/health-worker"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Dashboard
            </Link>

            <Link
              href="/health-worker/patients/new"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              New Patient
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div>
          <p className="text-sm font-medium tracking-wide text-cyan-400">
            PATIENTS
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Patient records
              </h1>

              <p className="mt-2 text-slate-400">
                Manage registered patients and access their screening
                history.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-xs text-slate-500">
                Total patients
              </p>

              <p className="mt-1 text-xl font-semibold">
                {patients.length}
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && patients.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
              +
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No patients registered
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Register your first patient to begin retinal screening.
            </p>

            <Link
              href="/health-worker/patients/new"
              className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Register New Patient
            </Link>
          </div>
        )}

        {/* PATIENT LIST */}
        {!error && patients.length > 0 && (
          <div className="mt-10 space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/health-worker/patients/${patient.id}`}
                      className="text-xl font-semibold transition hover:text-cyan-400"
                    >
                      {patient.name}
                    </Link>

                    <p className="mt-2 text-sm text-slate-400">
                      {patient.age} years · {patient.gender} ·{" "}
                      {patient.village}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Patient #{patient.id}
                    </p>
                  </div>

                  <Link
                    href={`/health-worker/patients/${patient.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 border-t border-slate-800 pt-6">
          <p className="text-xs leading-5 text-slate-600">
            RetinaScreen provides AI-assisted screening support.
            Clinical decisions should be made by qualified healthcare
            professionals.
          </p>
        </div>
      </section>
    </main>
  );
}