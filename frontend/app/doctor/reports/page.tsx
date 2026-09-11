"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getReferrals,
  downloadScreeningReport,
} from "@/lib/api";

type Referral = {
  id: number;
  patient_id: number;
  screening_id: number;
  reason: string;
  priority: string;
  status: string;
  created_at: string;
};

export default function DoctorReportsPage() {
  const router = useRouter();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    loadReports();
  }, [router]);

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const data = await getReferrals();

      setReferrals(data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load screening reports.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(screeningId: number) {
    try {
      setDownloadingId(screeningId);
      setError("");

      const blob = await downloadScreeningReport(screeningId);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `retinascreen_screening_${screeningId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to download the screening report.");
      }
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              RetinaScreen
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Screening Reports
            </p>
          </div>

          <button
            onClick={() => router.push("/doctor")}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-900 hover:text-white"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Screening Reports
          </h2>

          <p className="mt-2 text-slate-400">
            Download AI-assisted diabetic retinopathy screening reports
            for reviewed cases.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">
              Loading reports...
            </p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="text-4xl">📄</div>

            <h3 className="mt-4 text-lg font-semibold">
              No screening reports
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Reports will appear here when screening cases are available.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Report
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Screening
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-white">
                          Report #{referral.screening_id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Referral #{referral.id}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-200">
                          Patient #{referral.patient_id}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-300">
                          Screening #{referral.screening_id}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {referral.reason}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            referral.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {referral.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() =>
                            handleDownload(referral.screening_id)
                          }
                          disabled={
                            downloadingId === referral.screening_id
                          }
                          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {downloadingId === referral.screening_id
                            ? "Generating..."
                            : "Download PDF"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notice */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4">
          <p className="text-xs leading-5 text-slate-500">
            RetinaScreen reports are AI-assisted screening documents.
            They support clinical review and do not replace a definitive
            diagnosis by a qualified ophthalmologist.
          </p>
        </div>
      </section>
    </main>
  );
}