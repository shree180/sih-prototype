'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientText } from "@/components/ui/gradient-text";
import { scrollAnimations, easings, durations } from "@/lib/animations";
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
  CheckCircle2,
  Lock,
  BarChart3,
  Cpu,
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
    icon: Lock,
    title: "Privacy-First Design",
    desc: "Original images stay restricted. Automated face redaction protects identity. Reviewers see only redacted derivatives.",
    gradient: "success",
  },
  {
    icon: Cpu,
    title: "AI-Assisted Triage",
    desc: "Vision model provides preliminary severity, confidence, and visual indicators. AI assists — humans decide.",
    gradient: "warning",
  },
  {
    icon: Globe,
    title: "Geospatial Intelligence",
    desc: "Location queries, heatmaps, and clustering transform scattered reports into an operational picture.",
    gradient: "info",
  },
  {
    icon: Zap,
    title: "Priority Scoring",
    desc: "Explainable priority based on severity, confidence, affected people, infrastructure impact, and recency.",
    gradient: "danger",
  },
  {
    icon: Users,
    title: "Human Verification",
    desc: "Authorities confirm, correct, or escalate AI assessments. Every override creates an audit event.",
    gradient: "accent",
  },
  {
    icon: BarChart3,
    title: "Operational Reporting",
    desc: "Filter and export incidents as CSV or PDF. Generate summary statistics for situational awareness.",
    gradient: "success",
  },
];

const ROLES = [
  { title: "Citizens", desc: "Report damage in under 2 minutes. Track status. Privacy protected by default.", icon: Users },
  { title: "Volunteers", desc: "Expanded reporting privileges. Help document damage in your area.", icon: Cpu },
  { title: "Authorities", desc: "Live map, priority queue, AI triage, verification tools, exports.", icon: Globe },
  { title: "Analysts", desc: "Aggregated data, trends, geographic patterns, severity distributions.", icon: BarChart3 },
];

const liveStats = {
  reportsToday: 1247,
  activeUsers: 342,
  avgResponseTime: "4.2s",
  uptime: "99.9%",
};

export default function HomePage() {

  return (
    <div className="min-h-screen bg-[var(--surface-page)] relative overflow-x-hidden">
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-light border-b border-[var(--ink-200)]/40">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GradientText variant="primary" as="span" className="text-base font-bold tracking-tight">
              DisasterDamage.AI
            </GradientText>
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

      {/* Hero Section — static light surface, one-time entrance only */}
      <section className="relative overflow-hidden border-b border-[var(--ink-200)] bg-[var(--surface-primary)]">
        {/* Static accent wash (pure CSS, no animation, no scroll linkage) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-32 right-[10%] h-96 w-96 rounded-full bg-[var(--accent-100)] blur-3xl" />
          <div className="absolute bottom-0 left-[5%] h-72 w-72 rounded-full bg-[var(--surface-secondary)] blur-3xl" />
        </div>

        {/* Main Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="mb-6 animate-fade-in opacity-0">
              <Badge variant="warning" className="gap-2 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-600)]" aria-hidden="true" />
                <span className="text-sm font-medium">Smart India Hackathon · DRM04</span>
                <span className="text-xs opacity-80">Privacy-by-design · AI-assisted</span>
              </Badge>
            </div>

            {/* Headline — solid ink, one amber accent phrase */}
            <h1 className="animate-fade-in opacity-0 text-4xl font-bold tracking-tight text-[var(--ink-900)] sm:text-5xl lg:text-6xl leading-[1.05] max-w-4xl stagger-1">
              From scattered citizen reports to{' '}
              <span className="text-[var(--accent-600)]">verified disaster intelligence</span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-in opacity-0 stagger-2 mt-6 max-w-2xl text-lg text-[var(--ink-600)] leading-relaxed">
              Citizens photograph damage. We protect privacy, run AI-assisted triage, and give authorities a verified, geospatial operating picture.
            </p>

            {/* Philosophy Tagline */}
            <p className="animate-fade-in opacity-0 stagger-3 mt-4 text-sm font-medium text-[var(--ink-500)]">
              The AI assists triage — <span className="text-[var(--accent-600)]">a human makes the final decision.</span>
            </p>

            {/* CTAs */}
            <div className="animate-fade-in opacity-0 stagger-4 mt-10 flex flex-wrap gap-4">
              <Link href="/auth/sign-up" className={buttonVariants({ size: "lg", className: "px-8 group" })}>
                Report Damage
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth/sign-in"
                className={buttonVariants({ variant: "outline", size: "lg", className: "px-8" })}
              >
                Authority Sign In
              </Link>
            </div>

            {/* Live Stats */}
            <div className="animate-fade-in opacity-0 stagger-5 mt-16 grid gap-4 sm:grid-cols-4 max-w-3xl">
              <LiveStatCard 
                value={liveStats.reportsToday} 
                label="Reports Today" 
                icon={CheckCircle2}
                color="success"
                delay={0}
              />
              <LiveStatCard 
                value={liveStats.activeUsers} 
                label="Active Users" 
                icon={Users}
                color="info"
                delay={0.1}
              />
              <LiveStatCard 
                value={liveStats.avgResponseTime} 
                label="Avg AI Response" 
                icon={Cpu}
                color="warning"
                delay={0.2}
              />
              <LiveStatCard 
                value={liveStats.uptime} 
                label="Platform Uptime" 
                icon={Globe}
                color="primary"
                delay={0.3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: durations.slow, ease: easings.apple }}
          >
            <Badge variant="muted" className="mb-4 inline-flex">Core Workflow</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              From citizen photo to authority action in seven steps
            </h2>
            <p className="mt-4 text-base text-[var(--ink-500)]">
              Every step is designed for speed, privacy, and trust.
            </p>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollAnimations.staggerContainer}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                variants={scrollAnimations.staggerItem}
                className="group relative rounded-2xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[var(--accent-600)] tracking-widest uppercase">{step.label}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-100)] border border-[var(--accent-300)]/40 transition-transform duration-200 group-hover:scale-110">
                    <step.icon className="h-5 w-5 text-[var(--accent-600)]" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink-900)]">{step.title}</h3>
                <p className="text-[11px] text-[var(--ink-500)] mt-1.5 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-[var(--surface-secondary)] border-y border-[var(--ink-200)]">
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: durations.slow, ease: easings.apple }}
          >
            <Badge variant="muted" className="mb-4 inline-flex">Capabilities</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              Built for real operations
            </h2>
            <p className="mt-4 text-base text-[var(--ink-500)]">
              Every feature serves one purpose: turning citizen evidence into trustworthy operational intelligence.
            </p>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollAnimations.staggerContainer}
          >
            {CAPABILITIES.map((cap) => (
              <motion.div
                key={cap.title}
                variants={scrollAnimations.staggerItem}
                className="group relative rounded-2xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `var(--${cap.gradient}-100)`,
                    borderColor: `var(--${cap.gradient}-500)`,
                  }}
                >
                  <cap.icon className="h-5 w-5" style={{ color: `var(--${cap.gradient}-600)` }} />
                </div>
                <h3 className="text-base font-semibold text-[var(--ink-900)]">{cap.title}</h3>
                <p className="text-sm text-[var(--ink-500)] mt-2 leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            className="max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: durations.slow, ease: easings.apple }}
          >
            <Badge variant="muted" className="mb-4 inline-flex">Roles</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--ink-900)] sm:text-4xl">
              For everyone in the response chain
            </h2>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollAnimations.staggerContainer}
          >
            {ROLES.map((role) => (
              <motion.div
                key={role.title}
                variants={scrollAnimations.staggerItem}
                className="group relative rounded-2xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-100)] border border-[var(--accent-300)]/40 mb-4 transition-transform duration-200 group-hover:scale-110">
                  <role.icon className="h-6 w-6 text-[var(--accent-600)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--ink-900)]">{role.title}</h3>
                <p className="text-sm text-[var(--ink-500)] mt-2 leading-relaxed">{role.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section — light amber-tinted panel, dark text */}
      <section className="relative py-20 sm:py-24 overflow-hidden border-t border-[var(--ink-200)] bg-[var(--accent-50)]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--accent-100)] blur-3xl" />
        </div>

        <motion.div
          className="relative mx-auto max-w-4xl px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: durations.slow, ease: easings.apple }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-[var(--ink-900)] sm:text-4xl">
            Ready to make citizen evidence usable?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--ink-600)] leading-relaxed">
            Join the platform turning scattered reports into actionable intelligence — while keeping privacy front and center.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/sign-up" className={buttonVariants({ size: "lg", className: "px-8 group" })}>
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/sign-in"
              className={buttonVariants({ variant: "outline", size: "lg", className: "px-8" })}
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--ink-200)] bg-[var(--surface-primary)] py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <GradientText variant="primary" as="h3" className="text-sm font-semibold tracking-tight">
                DisasterDamage.AI
              </GradientText>
              <p className="mt-3 text-sm text-[var(--ink-500)] leading-relaxed">
                Privacy-conscious, AI-assisted disaster damage assessment.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--ink-900)] uppercase tracking-wider">Platform</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-500)]">
                <li>Citizen Portal</li>
                <li>Authority Dashboard</li>
                <li>Analytics</li>
                <li>Exports</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--ink-900)] uppercase tracking-wider">Resources</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-500)]">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--ink-900)] uppercase tracking-wider">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-500)]">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-[var(--ink-200)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-[var(--ink-400)]">SIH DRM04 · AI-assisted preliminary assessment</span>
            <span className="text-[11px] text-[var(--ink-300)]">Privacy-by-design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface LiveStatCardProps {
  value: number | string;
  label: string;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  delay: number;
}

function LiveStatCard({ value, label, icon: Icon, color, delay }: LiveStatCardProps) {
  const colorMap = {
    primary: { bg: 'var(--accent-50)', border: 'var(--accent-100)', text: 'var(--accent-600)', iconBg: 'var(--accent-100)', iconText: 'var(--accent-600)' },
    success: { bg: 'var(--success-50)', border: 'var(--success-100)', text: 'var(--success-600)', iconBg: 'var(--success-100)', iconText: 'var(--success-600)' },
    warning: { bg: 'var(--warning-50)', border: 'var(--warning-100)', text: 'var(--warning-600)', iconBg: 'var(--warning-100)', iconText: 'var(--warning-600)' },
    danger: { bg: 'var(--danger-50)', border: 'var(--danger-100)', text: 'var(--danger-600)', iconBg: 'var(--danger-100)', iconText: 'var(--danger-600)' },
    info: { bg: 'var(--info-50)', border: 'var(--info-100)', text: 'var(--info-600)', iconBg: 'var(--info-100)', iconText: 'var(--info-600)' },
  };

  const colors = colorMap[color];

  return (
    <div
      className="group relative rounded-2xl p-5 border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{
            backgroundColor: colors.iconBg,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: colors.iconText }} />
        </div>
        <span
          className="text-[10px] font-bold tracking-widest uppercase"
          style={{ color: colors.text }}
        >
          LIVE
        </span>
      </div>
      <div className="text-3xl font-bold tracking-tight" style={{ color: colors.text }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs font-medium mt-1" style={{ color: colors.text }}>
        {label}
      </div>
    </div>
  );
}