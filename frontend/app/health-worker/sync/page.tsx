"use client";

import Link from "next/link";

export default function SyncPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#091525]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-cyan-400">RetinaAI</p>
            <h1 className="mt-1 text-2xl font-semibold">
              Offline & Sync
            </h1>
          </div>

          <Link
            href="/health-worker"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-2xl border border-white/10 bg-[#0b1829] p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              ✓
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Local data is available
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Screening data can be stored locally when connectivity is
                unavailable. Cloud synchronization will be enabled when the
                offline queue is connected to the backend sync service.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatusCard
            title="Connection"
            value="Online"
            description="Backend connection available"
          />

          <StatusCard
            title="Pending Sync"
            value="0"
            description="Records waiting to upload"
          />

          <StatusCard
            title="Last Sync"
            value="Not yet"
            description="No cloud synchronization performed"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1829] p-6">
          <h2 className="font-semibold">Sync Queue</h2>

          <p className="mt-2 text-sm text-slate-400">
            There are currently no records waiting for synchronization.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-white/10 px-6 py-10 text-center">
            <p className="text-sm text-slate-300">
              Sync queue is empty
            </p>

            <p className="mt-1 text-xs text-slate-500">
              New offline screening records will appear here.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatusCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1829] p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-2xl font-semibold">{value}</p>

      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}