"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  createReferral,
  createScreening,
} from "@/lib/api";

type Result = {
  id: number;
  quality: string;
  quality_score: number;
  quality_reason?: string;
  dr_grade: number | null;
  severity: string | null;
  confidence: number | null;
  lesions: string[];
  explanation: string;
  risk: string | null;
  referral_required: boolean;
};

const severityDescriptions: Record<string, string> = {
  "No DR":
    "No diabetic retinopathy detected by the current screening model.",
  Mild:
    "Mild diabetic retinopathy pattern estimated by the screening model.",
  Moderate:
    "Moderate diabetic retinopathy pattern estimated by the screening model.",
  Severe:
    "Severe diabetic retinopathy pattern estimated by the screening model.",
  "Proliferative DR":
    "Proliferative diabetic retinopathy pattern estimated by the screening model.",
};

export default function ScreeningPage() {
  const params = useParams();
  const router = useRouter();

  const patientId = Number(params.patientId);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [creatingReferral, setCreatingReferral] =
    useState(false);

  const [referralCreated, setReferralCreated] =
    useState(false);

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

      if (!patientId) {
        setError("Invalid patient.");
      }

      setCheckingAuth(false);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [patientId, router]);

  function handleImage(file: File | undefined) {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, JPEG, PNG or WEBP image.",
      );
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Image size must be less than 15 MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setReferralCreated(false);
    setError("");
  }

  function removeImage() {
    setImage(null);
    setPreview("");
    setResult(null);
    setReferralCreated(false);
    setError("");
  }

  async function analyze() {
    if (!image) {
      setError("Please select a fundus image.");
      return;
    }

    if (!patientId) {
      setError("Invalid patient.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);
      setReferralCreated(false);

      const data = await createScreening(
        patientId,
        image,
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Screening failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateReferral() {
    if (!result?.id) {
      setError(
        "A completed screening is required before creating a referral.",
      );
      return;
    }

    try {
      setCreatingReferral(true);
      setError("");

      const savedUser = localStorage.getItem("user");

      let referredBy: number | undefined;

      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);

          if (user.id) {
            referredBy = Number(user.id);
          }
        } catch {
          referredBy = undefined;
        }
      }

      await createReferral(result.id, {
        reason:
          "Specialist review recommended based on retinal screening.",
        priority:
          result.risk === "high" ||
          result.risk === "urgent"
            ? "high"
            : "routine",
        referred_by: referredBy,
      });

      setReferralCreated(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create referral.",
      );
    } finally {
      setCreatingReferral(false);
    }
  }

  function getQualityStyle(quality: string) {
    if (quality === "good") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (quality === "borderline") {
      return "border-amber-400/20 bg-amber-400/10 text-amber-300";
    }

    return "border-red-400/20 bg-red-400/10 text-red-300";
  }

  function getSeverityStyle(severity: string | null) {
    if (!severity) {
      return "border-slate-700 bg-slate-800/50 text-slate-400";
    }

    const value = severity.toLowerCase();

    if (
      value.includes("proliferative") ||
      value.includes("severe")
    ) {
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/health-worker"
            className="text-xl font-bold tracking-tight"
          >
            Retina<span className="text-cyan-400">Screen</span>
          </Link>

          <Link
            href={`/health-worker/patients/${patientId}`}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            ← Back to Patient
          </Link>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Retinal Screening
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Fundus Image Analysis
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Upload a clear fundus photograph to assess image
            quality and run the available AI-assisted diabetic
            retinopathy screening pipeline.
          </p>
        </div>

        {/* WORKSPACE */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          {/* IMAGE PANEL */}
          <div className="rounded-3xl border border-white/10 bg-[#071222] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Fundus Image
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload the patient's retinal photograph.
                </p>
              </div>

              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Step 1
              </span>
            </div>

            {/* UPLOAD */}
            <label className="mt-6 flex min-h-[380px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[#030817] p-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.02]">
              {preview ? (
                <div className="flex h-full w-full items-center justify-center">
                  <img
                    src={preview}
                    alt="Fundus image preview"
                    className="max-h-[350px] max-w-full rounded-xl object-contain"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
                    ↑
                  </div>

                  <p className="mt-5 font-medium text-slate-300">
                    Upload fundus image
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    JPG, JPEG, PNG or WEBP
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Maximum file size: 15 MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) =>
                  handleImage(e.target.files?.[0])
                }
              />
            </label>

            {/* FILE INFO */}
            {image && (
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-300">
                    {image.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {(image.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  className="shrink-0 text-sm text-slate-500 transition hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3.5">
                <p className="text-sm leading-6 text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* ANALYZE */}
            <button
              type="button"
              onClick={analyze}
              disabled={!image || loading}
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-cyan-400 py-3.5 font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  Analyzing Image...
                </>
              ) : (
                "Analyze Fundus Image →"
              )}
            </button>

            {/* PROCESS INFO */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <PipelineStep
                number="1"
                title="Quality"
              />

              <PipelineStep
                number="2"
                title="AI Analysis"
              />

              <PipelineStep
                number="3"
                title="Referral"
              />
            </div>
          </div>

          {/* RESULT PANEL */}
          <div className="rounded-3xl border border-white/10 bg-[#071222] p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Screening Result
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  AI-assisted assessment
                </p>
              </div>

              {result && (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getQualityStyle(
                    result.quality,
                  )}`}
                >
                  {result.quality}
                </span>
              )}
            </div>

            {/* EMPTY */}
            {!result && !loading && (
              <div className="flex min-h-[520px] items-center justify-center text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-semibold text-slate-600">
                    AI
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-300">
                    Ready for screening
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Upload a fundus image and select{" "}
                    <span className="text-slate-300">
                      Analyze Fundus Image
                    </span>{" "}
                    to begin.
                  </p>
                </div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-[520px] items-center justify-center text-center">
                <div>
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />

                  <h3 className="mt-6 font-semibold text-slate-300">
                    Processing fundus image
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Assessing image quality and running the
                    available screening model.
                  </p>
                </div>
              </div>
            )}

            {/* RESULT */}
            {result && !loading && (
              <div className="mt-6 space-y-4">
                {/* QUALITY */}
                <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Image Quality
                      </p>

                      <p className="mt-2 text-lg font-semibold capitalize">
                        {result.quality}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-cyan-400">
                        {result.quality_score}%
                      </p>

                      <p className="text-xs text-slate-600">
                        quality score
                      </p>
                    </div>
                  </div>

                  {result.quality_reason && (
                    <p className="mt-4 border-t border-white/5 pt-4 text-sm leading-6 text-slate-500">
                      {result.quality_reason}
                    </p>
                  )}
                </div>

                {/* POOR QUALITY */}
                {result.quality === "poor" && (
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                        !
                      </div>

                      <div>
                        <p className="font-semibold text-amber-300">
                          Image needs improvement
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          The image quality is not sufficient for
                          reliable screening. Please capture or
                          upload a clearer fundus image.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                    >
                      Upload Another Image
                    </button>
                  </div>
                )}

                {/* AI RESULT */}
                {result.quality !== "poor" && (
                  <>
                    {/* GRADE */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          DR Grade
                        </p>

                        <p className="mt-2 text-2xl font-bold">
                          {result.dr_grade !== null
                            ? `Grade ${result.dr_grade}`
                            : "Pending"}
                        </p>

                        {result.dr_grade !== null && (
                          <p className="mt-1 text-xs text-slate-600">
                            Scale 0–4
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-600">
                          Severity
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getSeverityStyle(
                              result.severity,
                            )}`}
                          >
                            {result.severity || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SEVERITY DESCRIPTION */}
                    {result.severity &&
                      severityDescriptions[result.severity] && (
                        <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                          <p className="text-sm leading-6 text-slate-400">
                            {
                              severityDescriptions[
                                result.severity
                              ]
                            }
                          </p>
                        </div>
                      )}

                    {/* CONFIDENCE */}
                    <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                          Model Confidence
                        </p>

                        <p className="font-semibold text-cyan-400">
                          {result.confidence !== null
                            ? `${Math.round(
                                result.confidence * 100,
                              )}%`
                            : "Pending"}
                        </p>
                      </div>

                      {result.confidence !== null && (
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  result.confidence * 100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* LESIONS */}
                    <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-300">
                          Detected Lesions
                        </p>

                        <span className="text-xs text-slate-600">
                          Segmentation
                        </span>
                      </div>

                      {result.lesions &&
                      result.lesions.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {result.lesions.map((lesion) => (
                            <span
                              key={lesion}
                              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300"
                            >
                              {lesion}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          Lesion segmentation is not available
                          until the trained lesion model is
                          connected.
                        </p>
                      )}
                    </div>

                    {/* EXPLANATION */}
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-sm font-bold text-cyan-300">
                          XAI
                        </div>

                        <div>
                          <p className="font-medium text-cyan-300">
                            Explainable AI
                          </p>

                          <p className="text-xs text-slate-600">
                            Model reasoning
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-slate-300">
                        {result.explanation}
                      </p>

                      {result.lesions.length === 0 && (
                        <p className="mt-3 text-xs leading-5 text-slate-600">
                          Grad-CAM and lesion localization
                          visualizations will become available
                          when the trained XAI and segmentation
                          models are integrated.
                        </p>
                      )}
                    </div>

                    {/* RISK */}
                    <div className="rounded-2xl border border-white/5 bg-[#030817] p-5">
                      <p className="text-xs uppercase tracking-wider text-slate-600">
                        Risk Assessment
                      </p>

                      <p className="mt-2 text-lg font-semibold capitalize">
                        {result.risk || "Pending"}
                      </p>
                    </div>

                    {/* REFERRAL */}
                    <div className="rounded-2xl border border-white/10 bg-[#030817] p-5">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-600">
                            Specialist Referral
                          </p>

                          <h3 className="mt-2 font-semibold text-slate-200">
                            Ophthalmologist review
                          </h3>

                          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Create a referral for this screening so
                            a doctor can review the retinal image,
                            AI assessment and supporting information.
                          </p>
                        </div>

                        {!referralCreated ? (
                          <button
                            type="button"
                            onClick={handleCreateReferral}
                            disabled={creatingReferral}
                            className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {creatingReferral
                              ? "Creating..."
                              : "Create Referral →"}
                          </button>
                        ) : (
                          <div className="shrink-0 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-semibold text-emerald-300">
                            ✓ Referral Created
                          </div>
                        )}
                      </div>

                      {referralCreated && (
                        <div className="mt-5 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3">
                          <p className="text-sm leading-6 text-emerald-300">
                            This screening has been added to the
                            specialist referral queue.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/health-worker/patients/${patientId}`,
                          )
                        }
                        className="rounded-xl border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                      >
                        ← Back to Patient
                      </button>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="rounded-xl border border-white/10 bg-white/[0.02] py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
                      >
                        Start New Screening
                      </button>
                    </div>

                    {/* NOTICE */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.015] px-4 py-3">
                      <p className="text-xs leading-5 text-slate-600">
                        <span className="font-semibold text-slate-500">
                          Clinical notice:
                        </span>{" "}
                        RetinaScreen provides AI-assisted screening
                        support. This result is not a definitive
                        diagnosis and must be reviewed by a qualified
                        healthcare professional before clinical
                        decisions are finalized.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function PipelineStep({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-2 py-3 text-center">
      <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-bold text-cyan-300">
        {number}
      </div>

      <p className="mt-2 text-[10px] text-slate-600">
        {title}
      </p>
    </div>
  );
}