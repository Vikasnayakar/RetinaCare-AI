import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#030817] text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            Retina<span className="text-cyan-400">AI</span>
          </Link>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to home
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
        <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="relative w-full max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Secure access
            </p>

            <h1 className="mt-4 text-4xl font-bold">
              Choose your workspace
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Select your role to access the appropriate RetinaAI workspace.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <LoginCard
              code="HW"
              title="Health Worker"
              text="Patient registration, retinal screening and referrals."
              href="/login/health-worker"
            />

            <LoginCard
              code="DR"
              title="Doctor"
              text="Clinical review, AI explanation and follow-up."
              href="/login/doctor"
            />

            <LoginCard
              code="AD"
              title="Administrator"
              text="Users, facilities, analytics and system monitoring."
              href="/login/admin"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function LoginCard({
  code,
  title,
  text,
  href,
}: {
  code: string;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-[#0a1527] p-7 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-950/30"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 font-bold text-cyan-300">
        {code}
      </div>

      <h2 className="mt-7 text-2xl font-semibold">{title}</h2>

      <p className="mt-3 min-h-[55px] text-sm leading-6 text-slate-400">
        {text}
      </p>

      <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center text-sm font-semibold transition group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 group-hover:text-cyan-300">
        Continue as {title} →
      </div>
    </Link>
  );
}