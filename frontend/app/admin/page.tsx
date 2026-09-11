"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (!saved) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(saved));
  }, [router]);

  function logout() {
    localStorage.clear();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-8 py-5">
        <div className="mx-auto flex max-w-7xl justify-between">
          <div className="text-xl font-bold">
            Retina<span className="text-cyan-400">AI</span>
          </div>

          <button
            onClick={logout}
            className="text-sm text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-8 py-12">
        <p className="text-sm text-cyan-400">ADMIN</p>

        <h1 className="mt-2 text-4xl font-bold">
          System Overview
        </h1>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Users</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Screenings</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-500">Referrals</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>
        </div>
      </section>
    </main>
  );
}