"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  getReferral,
  getPatient,
  getPatientScreenings,
  getDoctorReview,
  submitDoctorReview,
} from "@/lib/api";

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
};

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

type DoctorReview = {
  id: number;
  referral_id: number;
  doctor_id: number;
  decision: string;
  final_grade: number | null;
  clinical_notes: string | null;
  reviewed_at: string;
};

const API_URL = "http://127.0.0.1:8000";

const gradeLabels = [
  "No Diabetic Retinopathy",
  "Mild NPDR",
  "Moderate NPDR",
  "Severe NPDR",
  "Proliferative DR",
];

export default function ReferralReviewPage() {
  const params = useParams();
  const router = useRouter();

  const referralId = Number(params.referralId);

  const [referral, setReferral] =
    useState<Referral | null>(null);

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [screening, setScreening] =
    useState<Screening | null>(null);

  const [doctorReview, setDoctorReview] =
    useState<DoctorReview | null>(null);

  const [decision, setDecision] =
    useState("confirmed");

  const [finalGrade, setFinalGrade] =
    useState<number | null>(null);

  const [clinicalNotes, setClinicalNotes] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      loadReferral();
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router, referralId]);

  async function loadReferral() {
    try {
      setLoading(true);
      setError("");

      const referralData = await getReferral(
        referralId,
      );

      setReferral(referralData);

      const patientData = await getPatient(
        referralData.patient_id,
      );

      setPatient(patientData);

      const screeningsData =
        await getPatientScreenings(
          referralData.patient_id,
        );

      const selectedScreening =
        screeningsData.find(
          (item: Screening) =>
            item.id === referralData.screening_id,
        );

      setScreening(
        selectedScreening || null,
      );

      if (selectedScreening?.dr_grade !== null) {
        setFinalGrade(
          selectedScreening.dr_grade,
        );
      }

      try {
        const reviewData =
          await getDoctorReview(
            referralId,
          );

        setDoctorReview(reviewData);

        setDecision(reviewData.decision);

        setFinalGrade(
          reviewData.final_grade,
        );

        setClinicalNotes(
          reviewData.clinical_notes || "",
        );
      } catch {
        // No review exists yet.
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load referral.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview() {
    setError("");
    setSuccess("");

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      router.replace("/");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      router.replace("/");
      return;
    }

    const doctorId = Number(user.id);

    if (!doctorId) {
      setError(
        "Doctor account information is missing.",
      );
      return;
    }

    if (decision === "modified" && finalGrade === null) {
      setError(
        "Please select the final DR grade.",
      );
      return;
    }

    try {
      setSubmitting(true);

      const review =
        await submitDoctorReview(
          referralId,
          {
            doctor_id: doctorId,
            decision,
            final_grade: finalGrade,
            clinical_notes:
              clinicalNotes.trim() || null,
          },
        );

      setDoctorReview(review);

      setSuccess(
        "Doctor review submitted successfully.",
      );

      await loadReferral();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit doctor review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    router.replace("/");
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  function getSeverityLabel(
    grade: number | null,
  ) {
    if (grade === null) {
      return "Pending";
    }

    return (
      gradeLabels[grade] || "Unknown"
    );
  }

  function parseLesions(
    value: string | null,
  ) {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030817] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-400">
            Loading referral...
          </p>
        </div>
      </main>
    );
  }

  if (error && !referral) {
    return (
      <main className="min-h-screen bg-[#030817] px-6 py-12 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-400/20 bg-red-400/5 p-8">
          <h1 className="text-xl font-semibold">
            Referral unavailable
          </h1>

          <p className="mt-3 text-sm text-red-300">
            {error}
          </p>

          <Link
            href="/doctor/referrals"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            ← Back to referrals
          </Link>
        </div>
      </main>
    );
  }

  if (!referral) {
    return null;
  }

  const lesions = parseLesions(
    screening?.lesions || null,
  );

  const alreadyReviewed =
    doctorReview !== null;

  return (
    <main className="min-h-screen bg-[#030817] text-white">
      {/* NAVBAR */}
      <header className="border-b border-white/10 bg-[#030817]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/doctor"
            className="text-xl font-bold tracking-tight"
          >
            Retina
            <span className="text-cyan-400">
              Screen
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/doctor/referrals"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Referral Queue
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

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/doctor/referrals"
              className="text-sm text-slate-500 transition hover:text-cyan-300"
            >
              ← Referral Queue
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Referral Review
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Referral #{referral.id} · Screening #
              {referral.screening_id}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-medium capitalize text-amber-300">
              {referral.status.replaceAll(
                "_",
                " ",
              )}
            </span>

            <span className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-medium capitalize text-red-300">
              {referral.priority}
            </span>

            {alreadyReviewed && (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                Reviewed
              </span>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3.5">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3.5">
            <p className="text-sm text-emerald-300">
              {success}
            </p>
          </div>
        )}

        {/* PATIENT */}
        {patient && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#071222] p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Patient
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {patient.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Patient ID #{patient.id}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-4">
                <PatientInfo
                  label="Age"
                  value={`${patient.age} years`}
                />

                <PatientInfo
                  label="Gender"
                  value={patient.gender}
                />

                <PatientInfo
                  label="Phone"
                  value={patient.phone}
                />

                <PatientInfo
                  label="Village"
                  value={patient.village}
                />
              </div>
            </div>
          </div>
        )}

        {/* SCREENING */}
        {screening ? (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* IMAGE */}
              <div className="rounded-3xl border border-white/10 bg-[#071222] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-600">
                      Fundus Image
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Screening #{screening.id}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                    {screening.quality} ·{" "}
                    {screening.quality_score}%
                  </span>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img
                    src={`${API_URL}/${screening.image_path.replaceAll(
                      "\\",
                      "/",
                    )}`}
                    alt="Patient fundus screening"
                    className="h-auto max-h-[560px] w-full object-contain"
                  />
                </div>
              </div>

              {/* AI RESULT */}
              <div className="rounded-3xl border border-white/10 bg-[#071222] p-6">
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  AI Screening Result
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  {screening.dr_grade !==
                  null
                    ? `Grade ${screening.dr_grade}`
                    : "Result Pending"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {getSeverityLabel(
                    screening.dr_grade,
                  )}
                </p>

                <div className="mt-6 space-y-4">
                  <ResultRow
                    label="Model confidence"
                    value={
                      screening.confidence !==
                      null
                        ? `${screening.confidence}%`
                        : "Pending"
                    }
                  />

                  <ResultRow
                    label="Risk"
                    value={
                      screening.risk
                        ? screening.risk.toUpperCase()
                        : "Pending"
                    }
                  />

                  <ResultRow
                    label="Referral required"
                    value={
                      screening.referral_required
                        ? "Yes"
                        : "No"
                    }
                  />

                  <ResultRow
                    label="Screening date"
                    value={formatDate(
                      screening.created_at,
                    )}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                    AI Explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {screening.explanation ||
                      "No explanation is currently available."}
                  </p>
                </div>
              </div>
            </div>

            {/* LESIONS */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#071222] p-6">
              <p className="text-xs uppercase tracking-wider text-slate-600">
                Detected Lesions
              </p>

              {lesions.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {lesions.map(
                    (lesion, index) => (
                      <span
                        key={`${lesion}-${index}`}
                        className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
                      >
                        {typeof lesion ===
                        "string"
                          ? lesion
                          : JSON.stringify(
                              lesion,
                            )}
                      </span>
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-5 py-6">
                  <p className="text-sm text-slate-500">
                    No lesion segmentation
                    result is currently
                    available.
                  </p>
                </div>
              )}
            </div>

            {/* EXPLAINABILITY */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ExplanationCard
                title="Lesion Localization"
                description="Lesion segmentation will highlight retinal regions that contribute to the screening assessment once the trained segmentation model is connected."
              />

              <ExplanationCard
                title="Grad-CAM Explanation"
                description="Grad-CAM will provide a visual explanation of the regions influencing the DR grading model once the trained grading checkpoint is integrated."
              />
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6">
            <p className="text-sm text-amber-300">
              The screening associated with
              this referral could not be loaded.
            </p>
          </div>
        )}

        {/* REFERRAL */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#071222] p-6">
          <p className="text-xs uppercase tracking-wider text-slate-600">
            Referral Information
          </p>

          <h2 className="mt-3 text-lg font-semibold">
            Specialist Review Requested
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {referral.reason}
          </p>

          <p className="mt-4 text-xs text-slate-600">
            Referred on{" "}
            {formatDate(
              referral.created_at,
            )}
          </p>
        </div>

        {/* DOCTOR REVIEW */}
        <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-[#071222] p-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Clinical Review
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Doctor validation
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review the AI-assisted screening
              information and record the final
              clinical assessment.
            </p>
          </div>

          {alreadyReviewed ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
              <p className="text-xs uppercase tracking-wider text-emerald-400">
                Review Completed
              </p>

              <h3 className="mt-2 text-lg font-semibold capitalize">
                {doctorReview?.decision}
              </h3>

              {doctorReview?.final_grade !==
                null &&
                doctorReview?.final_grade !==
                  undefined && (
                  <p className="mt-2 text-sm text-slate-400">
                    Final DR Grade:{" "}
                    <span className="font-medium text-white">
                      Grade{" "}
                      {
                        doctorReview.final_grade
                      }
                    </span>{" "}
                    —{" "}
                    {
                      gradeLabels[
                        doctorReview
                          .final_grade
                      ]
                    }
                  </p>
                )}

              {doctorReview?.clinical_notes && (
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-xs uppercase tracking-wider text-slate-600">
                    Clinical Notes
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {
                      doctorReview.clinical_notes
                    }
                  </p>
                </div>
              )}

              <p className="mt-4 text-xs text-slate-600">
                Reviewed on{" "}
                {doctorReview
                  ? formatDate(
                      doctorReview.reviewed_at,
                    )
                  : ""}
              </p>
            </div>
          ) : (
            <>
              {/* DECISION */}
              <div className="mt-6">
                <label className="text-sm font-medium text-slate-300">
                  Clinical decision
                </label>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <DecisionButton
                    active={
                      decision ===
                      "confirmed"
                    }
                    onClick={() =>
                      setDecision(
                        "confirmed",
                      )
                    }
                    title="Confirm"
                    description="AI assessment accepted"
                  />

                  <DecisionButton
                    active={
                      decision ===
                      "modified"
                    }
                    onClick={() =>
                      setDecision(
                        "modified",
                      )
                    }
                    title="Modify"
                    description="Change final assessment"
                  />

                  <DecisionButton
                    active={
                      decision ===
                      "rejected"
                    }
                    onClick={() =>
                      setDecision(
                        "rejected",
                      )
                    }
                    title="Reject"
                    description="Assessment not accepted"
                  />
                </div>
              </div>

              {/* GRADE */}
              <div className="mt-6">
                <label
                  htmlFor="final-grade"
                  className="text-sm font-medium text-slate-300"
                >
                  Final DR grade
                </label>

                <select
                  id="final-grade"
                  value={
                    finalGrade === null
                      ? ""
                      : finalGrade
                  }
                  onChange={(event) =>
                    setFinalGrade(
                      event.target.value ===
                        ""
                        ? null
                        : Number(
                            event.target.value,
                          ),
                    )
                  }
                  className="mt-3 w-full rounded-xl border border-white/10 bg-[#030817] px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-400/40"
                >
                  <option value="">
                    Select final grade
                  </option>

                  {gradeLabels.map(
                    (label, index) => (
                      <option
                        key={index}
                        value={index}
                      >
                        Grade {index} —{" "}
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* NOTES */}
              <div className="mt-6">
                <label
                  htmlFor="clinical-notes"
                  className="text-sm font-medium text-slate-300"
                >
                  Clinical notes
                </label>

                <textarea
                  id="clinical-notes"
                  value={clinicalNotes}
                  onChange={(event) =>
                    setClinicalNotes(
                      event.target.value,
                    )
                  }
                  rows={5}
                  maxLength={5000}
                  placeholder="Add clinical observations, recommendations or follow-up instructions..."
                  className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#030817] px-4 py-3 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 transition focus:border-cyan-400/40"
                />

                <p className="mt-2 text-right text-xs text-slate-700">
                  {clinicalNotes.length}/5000
                </p>
              </div>

              {/* SUBMIT */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xl text-xs leading-5 text-slate-600">
                  Submitting this review records
                  the doctor's assessment and
                  marks the referral as completed.
                </p>

                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Clinical Review"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* NOTICE */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.015] px-5 py-4">
          <p className="text-xs leading-5 text-slate-600">
            <span className="font-semibold text-slate-500">
              Clinical notice:
            </span>{" "}
            RetinaScreen provides AI-assisted
            screening support. The final clinical
            assessment remains the responsibility of
            a qualified healthcare professional.
          </p>
        </div>
      </section>
    </main>
  );
}

function PatientInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-slate-200">
        {value}
      </span>
    </div>
  );
}

function ExplanationCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#071222] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
        AI
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function DecisionButton({
  active,
  onClick,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-cyan-400/40 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          active
            ? "text-cyan-300"
            : "text-slate-300"
        }`}
      >
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {description}
      </p>
    </button>
  );
}