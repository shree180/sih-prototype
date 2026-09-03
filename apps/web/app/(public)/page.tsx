import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MapPinned,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  FileDown,
  Users,
  ArrowRight,
  Zap,
  Eye,
  Globe,
} from "lucide-react";

const STEPS = [
  { icon: Camera, label: "01", title: "Capture", desc: "Photograph disaster damage" },
  { icon: MapPinned, label: "02", title: "Locate", desc: "GPS or map pin placement" },
  { icon: ShieldCheck, label: "03", title: "Protect", desc: "Automatic face redaction" },
  { icon: Sparkles, label: "04", title: "Assess", desc: "AI severity + confidence" },
  { icon: BadgeCheck, label: "05", title: "Verify", desc: "Authority human review" },
  { icon: Globe, label: "06", title: "Map", desc: "Geospatial operations picture" },
  { icon: FileDown, label: "07", title: "Export", desc: "CSV + PDF reports" },
];

const CAPABILITIES = [
  {
    icon: Eye,
    title: "Privacy-First Design",
    desc: "Original images stay restricted. Automated face redaction protects identity. Reviewers see only redacted derivatives.",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Triage",
    desc: "Vision model provides preliminary severity, confidence, and visual indicators. AI assists — humans decide.",
  },
  {
    icon: MapPinned,
    title: "Geospatial Intelligence",
    desc: "Location queries, heatmaps, and clustering transform scattered reports into an operational picture.",
  },
  {
    icon: Zap,
    title: "Priority Scoring",
    desc: "Explainable priority based on severity, confidence, affected people, infrastructure impact, and recency.",
  },
  {
    icon: Users,
    title: "Human Verification",
    desc: "Authorities confirm, correct, or escalate AI assessments. Every override creates an audit event.",
  },
  {
    icon: FileDown,
    title: "Operational Reporting",
    desc: "Filter and export incidents as CSV or PDF. Generate summary statistics for situational awareness.",
  },
];

const ROLES = [
  { title: "Citizens", desc: "Report damage in under 2 minutes. Track status. Privacy protected by default." },
  { title: "Volunteers", desc: "Expanded reporting privileges. Help document damage in your area." },
  { title: "Authorities", desc: "Live map, priority queue, AI triage, verification tools, exports." },
  { title: "Analysts", desc: "Aggregated data, trends, geographic patterns, severity distributions." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-light border-b border-white/40">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-navy-900 tracking-tight">DisasterDamage.AI</span>
            <Badge variant="warning" className="hidden sm:inline-flex">SIH DRM04</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-navy-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-400/8 blur-[120px]" />
          <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <Badge variant="warning" className="mb-5">Smart India Hackathon · DRM04</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              From scattered citizen reports to verified disaster intelligence
            </h1>
            <p className="mt-6 max-w-xl text-base text-navy-600 leading-relaxed">
              Citizens photograph damage. We protect privacy, run AI-assisted triage, and give authorities a verified, geospatial operating picture.
            </p>
            <p className="mt-2 text-xs font-medium text-navy-500">
              The AI assists triage — a human makes the final decision.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/sign-up">
                <Button size="lg" className="px-7 group">
                  Report Damage
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button size="lg" variant="outline" className="px-7">
                  Authority Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3 max-w-2xl">
            {[
              { value: "< 2 min", label: "Report time" },
              { value: "< 5 sec", label: "AI assessment" },
              { value: "100%", label: "Privacy protected" },
            ].map((stat) => (
              <div key={stat.label} className="glass-light rounded-xl p-4 border border-white/40">
                <div className="text-2xl font-bold text-navy-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-navy-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              The Core Workflow
            </h2>
            <p className="mt-3 text-sm text-navy-500">
              From citizen photo to authority action in seven steps.
            </p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="group relative rounded-xl border border-navy-100/60 bg-white p-4 shadow-elevated hover:shadow-elevated-lg transition-all duration-200 animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
              >
                <div className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-2">{step.label}</div>
                <step.icon className="h-5 w-5 text-navy-700 mb-2" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-navy-900">{step.title}</h3>
                <p className="text-[11px] text-navy-500 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 sm:py-24 bg-white border-y border-navy-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              Built for Real Operations
            </h2>
            <p className="mt-3 text-sm text-navy-500">
              Every feature serves one purpose: turning citizen evidence into trustworthy operational intelligence.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.title}
                className="group rounded-xl border border-navy-100/60 bg-navy-50/50 p-5 hover:bg-white hover:shadow-elevated-lg transition-all duration-200 animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 border border-amber-100 mb-3">
                  <cap.icon className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-navy-900">{cap.title}</h3>
                <p className="text-xs text-navy-500 mt-1.5 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
              For Everyone in the Response Chain
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role, i) => (
              <div
                key={role.title}
                className="rounded-xl border border-navy-100/60 bg-white p-5 shadow-elevated hover:shadow-elevated-lg transition-all duration-200 animate-fade-in opacity-0"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
              >
                <h3 className="text-sm font-semibold text-navy-900">{role.title}</h3>
                <p className="text-xs text-navy-500 mt-2 leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Ready to make citizen evidence usable?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-navy-300 leading-relaxed">
            Join the platform turning scattered reports into actionable intelligence — while keeping privacy front and center.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-7 bg-amber-500 text-white hover:bg-amber-400 shadow-glow">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="lg" variant="outline" className="px-7 border-white/10 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-navy-900">DisasterDamage.AI</h3>
              <p className="mt-2 text-xs text-navy-500 leading-relaxed">
                Privacy-conscious, AI-assisted disaster damage assessment.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Platform</h4>
              <ul className="mt-2.5 space-y-1.5 text-xs text-navy-500">
                <li>Citizen Portal</li>
                <li>Authority Dashboard</li>
                <li>Analytics</li>
                <li>Exports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Resources</h4>
              <ul className="mt-2.5 space-y-1.5 text-xs text-navy-500">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Legal</h4>
              <ul className="mt-2.5 space-y-1.5 text-xs text-navy-500">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-navy-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-navy-400">SIH DRM04 · AI-assisted preliminary assessment</span>
            <span className="text-[11px] text-navy-300">Privacy-by-design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
