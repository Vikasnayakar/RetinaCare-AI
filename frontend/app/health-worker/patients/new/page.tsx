"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createPatient } from "@/lib/api";

export default function NewPatientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Female");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.replace("/login/health-worker");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "health_worker") {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/login/health-worker");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      router.push("/login/health-worker");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      router.push("/login/health-worker");
      return;
    }

    if (user.role !== "health_worker") {
      router.push("/login");
      return;
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedVillage = village.trim();
    const numericAge = Number(age);

    if (!trimmedName) {
      setError("Please enter the patient's full name.");
      return;
    }

    if (!age || !Number.isInteger(numericAge)) {
      setError("Please enter a valid age.");
      return;
    }

    if (numericAge < 1 || numericAge > 120) {
      setError("Age must be between 1 and 120 years.");
      return;
    }

    if (!trimmedPhone) {
      setError("Please enter the patient's phone number.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!trimmedVillage) {
      setError("Please enter the patient's village or location.");
      return;
    }

    try {
      setLoading(true);

      const patient = await createPatient({
        name: trimmedName,
        age: numericAge,
        gender,
        phone: trimmedPhone,
        village: trimmedVillage,
        health_worker_id: user.id,
      });

      router.push(`/health-worker/patients/${patient.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register patient. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Checking access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* NAVBAR */}
      <header className="border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/health-worker"
            className="text-xl font-bold tracking-tight"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <Link
            href="/health-worker/patients"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            Patient Records
          </Link>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        {/* PAGE HEADER */}
        <div>
          <Link
            href="/health-worker"
            className="text-sm text-slate-500 transition hover:text-cyan-400"
          >
            ← Back to Dashboard
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            New Patient
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Register Patient
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Create a patient record before starting their retinal screening.
            The information will be stored securely in the screening system.
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-white/10 bg-[#071222] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >
          {/* SECTION HEADER */}
          <div className="border-b border-white/10 pb-5">
            <h2 className="text-lg font-semibold">
              Patient Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the patient's basic demographic and contact details.
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter patient's full name"
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>

            {/* AGE + GENDER */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Age
                </label>

                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  className="w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                />

                <p className="mt-2 text-xs text-slate-600">
                  Age must be between 1 and 120 years.
                </p>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                autoComplete="tel"
                className="w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-600">
                Used for patient contact and follow-up.
              </p>
            </div>

            {/* VILLAGE */}
            <div>
              <label
                htmlFor="village"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Village / Location
              </label>

              <input
                id="village"
                name="village"
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Enter village, town or location"
                autoComplete="address-level2"
                className="w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3.5">
              <p className="text-sm leading-6 text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/health-worker"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  Registering...
                </>
              ) : (
                "Register Patient →"
              )}
            </button>
          </div>
        </form>

        {/* INFO */}
        <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-4">
          <p className="text-xs leading-6 text-slate-500">
            <span className="font-semibold text-slate-400">
              Next step:
            </span>{" "}
            After registration, you will be taken to the patient's profile,
            where you can start a retinal screening and upload a fundus image.
          </p>
        </div>
      </section>
    </main>
  );
}