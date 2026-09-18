import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
  Leaf,
  BarChart3,
} from "lucide-react";

const features = [
  {
    title: "Easy Reporting",
    description: "Report civic issues in seconds with location and details.",
    icon: MessageSquarePlus,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Live Tracking",
    description: "Track your issue from submission to resolution.",
    icon: MapPin,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "AI Insights",
    description: "AI helps identify patterns and prioritize important issues.",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Community Driven",
    description: "Citizens and response teams work together for better cities.",
    icon: Users,
    color: "from-orange-400 to-amber-500",
  },
  {
    title: "Safe & Transparent",
    description: "Track progress with a clear and accountable process.",
    icon: ShieldCheck,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Sustainable Future",
    description: "Build cleaner, safer and more livable communities.",
    icon: Leaf,
    color: "from-cyan-500 to-blue-500",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#071d35] via-[#0b3046] to-[#073c45]">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200">
              <Sparkles size={16} />
              AI-Powered Civic Platform
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Together for a{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                Cleaner, Safer
              </span>{" "}
              & Smarter City
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              CivicPulse AI helps citizens report civic issues, track progress
              and create real change. Powered by AI, built for better
              communities.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/report"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-950/30 transition hover:-translate-y-1 hover:shadow-cyan-400/20"
              >
                Report an Issue
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/map"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/40 px-6 py-4 font-bold text-white transition hover:bg-white/10"
              >
                <MapPin size={19} />
                Explore Map
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={18} />
                Real-time tracking
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={18} />
                AI-powered insights
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={18} />
                Community driven
              </span>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-[3rem] bg-cyan-400/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-slate-950 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">CivicPulse AI</p>
                    <h3 className="text-xl font-bold text-white">
                      Live Command Center
                    </h3>
                  </div>

                  <div className="rounded-xl bg-emerald-400/15 p-3 text-emerald-300">
                    <Activity size={24} />
                  </div>
                </div>

                <div className="mb-4 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/10 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Active civic issues
                    </span>
                    <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300">
                      Live
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-2xl font-black text-white">24</p>
                      <p className="text-xs text-slate-400">Total</p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-2xl font-black text-amber-300">08</p>
                      <p className="text-xs text-slate-400">Pending</p>
                    </div>

                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-2xl font-black text-emerald-300">16</p>
                      <p className="text-xs text-slate-400">Resolved</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    ["Pothole on Main Road", "High Priority", "bg-orange-400"],
                    ["Water Leakage", "Critical", "bg-red-400"],
                    ["Garbage Overflow", "Medium", "bg-yellow-400"],
                  ].map(([title, priority, color]) => (
                    <div
                      key={title}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${color}`} />
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {title}
                          </p>
                          <p className="text-xs text-slate-400">
                            Civic issue report
                          </p>
                        </div>
                      </div>

                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-300">
                        {priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1500px] px-6 py-20 sm:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.5fr]">
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Why Choose CivicPulse AI?
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Smart Technology
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                for Real Change
              </span>
            </h2>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              We combine AI technology with community participation to make
              civic issue reporting faster, smarter and more effective.
            </p>

            <Link
              to="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border-2 border-blue-500 px-5 py-3 font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              Explore Platform
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
                >
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                  >
                    <Icon size={25} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="mx-6 mb-20 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#092743] via-[#07505c] to-[#063b45] sm:mx-10 lg:mx-16">
        <div className="grid gap-10 px-7 py-10 sm:px-12 lg:grid-cols-[1.1fr_2fr] lg:items-center lg:px-16">
          <div>
            <p className="font-semibold text-cyan-300">Our Impact</p>

            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Real People.
              <br />
              Real Issues.
              <br />
              Real Change.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["10+", "Total Reports", BarChart3],
              ["6", "Issue Categories", MapPin],
              ["5", "Response Teams", Users],
              ["92%", "Resolution Rate", CheckCircle2],
            ].map(([value, label, Icon]) => {
              const StatIcon = Icon as typeof BarChart3;

              return (
                <div key={label as string} className="text-center">
                  <StatIcon className="mx-auto mb-3 text-cyan-300" size={28} />
                  <p className="text-3xl font-black text-white">
                    {value as string}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    {label as string}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-20 text-center">
        <p className="font-semibold text-blue-600">
          A Cleaner City • A Safer Tomorrow • A Stronger Community
        </p>

        <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
          Your voice can build a better tomorrow.
        </h2>

        <Link
          to="/report"
          className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1"
        >
          Join the Movement
          <ArrowRight size={19} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#071d35] px-6 py-8 text-white sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-black">CivicPulse AI</h3>
            <p className="mt-1 text-sm text-slate-400">
              Smarter Cities • Stronger Communities
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <Link to="/" className="hover:text-cyan-300">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-cyan-300">
              Dashboard
            </Link>
            <Link to="/report" className="hover:text-cyan-300">
              Report Issue
            </Link>
            <Link to="/map" className="hover:text-cyan-300">
              Issue Map
            </Link>
            <Link to="/team" className="hover:text-cyan-300">
              Our Team
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}