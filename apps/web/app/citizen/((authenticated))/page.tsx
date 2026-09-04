'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { scrollAnimations, easings, durations } from "@/lib/animations";
import { Camera, ArrowRight, ShieldCheck, Zap, BadgeCheck, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useSessionStats } from "@/hooks/use-session-stats";

const PILLARS = [
  { icon: ShieldCheck, title: "Privacy by Default", desc: "Automated face redaction. Originals stay restricted.", gradient: "success" },
  { icon: Zap, title: "AI-Assisted Triage", desc: "Instant severity estimation and confidence scores.", gradient: "warning" },
  { icon: BadgeCheck, title: "Human Verification", desc: "Authorities verify before emergency dispatch.", gradient: "info" },
];

export default function CitizenHome() {
  const { data: stats, isLoading } = useSessionStats();
  


  const reports = stats?.reports ?? [];
  const totalReports = reports.length;
  const verifiedCount = reports.filter(r => r.verification_status === 'verified').length;
  const pendingCount = reports.filter(r => r.verification_status === 'needs_review' || r.verification_status === 'unverified').length;

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

      {/* Hero Section — light card, static, one-time entrance */}
      <section className="relative overflow-hidden border-b border-[var(--ink-200)] bg-[var(--surface-primary)]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 right-[15%] h-72 w-72 rounded-full bg-[var(--accent-100)] blur-3xl" />
        </div>

        <div className="relative px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in opacity-0 relative z-10 rounded-3xl border border-[var(--ink-200)] border-t-4 border-t-[var(--accent-500)] bg-[var(--surface-primary)] p-6 sm:p-8 shadow-sm">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Text Content */}
                <div className="max-w-2xl">
                  <Badge variant="warning" className="mb-4 inline-flex gap-2 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-600)]" aria-hidden="true" />
                    <span className="text-sm font-medium">Citizen Portal</span>
                  </Badge>

                  <h1 className="text-3xl font-bold tracking-tight text-[var(--ink-900)] sm:text-4xl leading-[1.1]">
                    Report Damage.{' '}
                    <span className="text-[var(--accent-600)]">Protect Your Community.</span>
                  </h1>

                  <p className="mt-3 text-base text-[var(--ink-600)] leading-relaxed max-w-lg">
                    Upload incident photos and location evidence. Privacy redaction and AI triage deliver verified intelligence to authorities.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    href="/citizen/report"
                    className={buttonVariants({ size: "lg", className: "w-full sm:w-auto px-8 group" })}
                  >
                    <Camera className="h-4 w-4" />
                    Report Damage
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/citizen/my-reports"
                    className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto px-8" })}
                  >
                    My Reports
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent-500)] px-1 text-xs font-bold text-white">
                      {totalReports}
                    </span>
                  </Link>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="mt-8 pt-6 border-t border-[var(--ink-200)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <ProgressIndicator
                    icon={CheckCircle2}
                    label="Submitted"
                    value={totalReports}
                    color="primary"
                  />
                  <ProgressIndicator
                    icon={TrendingUp}
                    label="Verified"
                    value={verifiedCount}
                    color="success"
                  />
                  <ProgressIndicator
                    icon={Clock}
                    label="Pending Review"
                    value={pendingCount}
                    color="warning"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="relative py-12">
        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollAnimations.staggerContainer}
          >
            {PILLARS.map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={scrollAnimations.staggerItem}
                className="group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: `var(--${pillar.gradient}-50)`,
                  borderColor: `var(--${pillar.gradient}-100)`,
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl mb-3 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: `var(--${pillar.gradient}-100)`,
                  }}
                >
                  <pillar.icon className="h-5 w-5" style={{ color: `var(--${pillar.gradient}-600)` }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--ink-900)]">{pillar.title}</h3>
                <p className="text-xs text-[var(--ink-500)] mt-1 leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Reports */}
      <section className="relative py-8 lg:py-12">
        <div className="relative mx-auto max-w-5xl px-4">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: durations.normal, ease: easings.apple }}
          >
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--ink-900)]">Recent Submissions</h2>
              <p className="text-sm text-[var(--ink-500)]">Status and AI triage results</p>
            </div>
            {totalReports > 0 && (
              <Link href="/citizen/my-reports" className="text-sm font-semibold text-[var(--accent-600)] hover:text-[var(--accent-500)] transition-colors flex items-center gap-1">
                View all
                <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </motion.div>

          {isLoading ? (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: durations.normal }}
            >
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-4">
                  <div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-4 w-full mt-2" />
                  <div className="skeleton h-4 w-1/3 mt-2" />
                </div>
              ))}
            </motion.div>
          ) : reports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, ease: easings.apple }}
            >
              <EmptyState
                icon={<Camera className="h-8 w-8" />}
                title="No reports yet"
                description="Submit your first damage report to get started. Your evidence helps authorities respond faster."
                action={
                  <Link href="/citizen/report">
                    <Button size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Submit First Report
                    </Button>
                  </Link>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-4 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={scrollAnimations.staggerContainer}
            >
              {reports.map((r) => (
                <motion.div
                  key={r.id}
                  variants={scrollAnimations.staggerItem}
                  className="transition-all duration-200 hover:-translate-y-1"
                >
                  <Link href={`/citizen/my-reports`} className="block">
                    <ReportCard report={r} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ProgressIndicatorProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

function ProgressIndicator({ icon: Icon, label, value, color }: ProgressIndicatorProps) {
  const colorMap = {
    primary: { bg: 'rgba(217, 119, 6, 0.1)', border: 'var(--accent-200)', text: 'var(--accent-500)', iconBg: 'var(--accent-100)', iconText: 'var(--accent-600)' },
    success: { bg: 'rgba(22, 163, 74, 0.1)', border: 'var(--success-100)', text: 'var(--success-500)', iconBg: 'var(--success-100)', iconText: 'var(--success-600)' },
    warning: { bg: 'rgba(217, 119, 6, 0.1)', border: 'var(--warning-100)', text: 'var(--warning-500)', iconBg: 'var(--warning-100)', iconText: 'var(--warning-600)' },
    danger: { bg: 'rgba(220, 38, 38, 0.1)', border: 'var(--danger-100)', text: 'var(--danger-500)', iconBg: 'var(--danger-100)', iconText: 'var(--danger-600)' },
    info: { bg: 'rgba(2, 132, 199, 0.1)', border: 'var(--info-100)', text: 'var(--info-500)', iconBg: 'var(--info-100)', iconText: 'var(--info-600)' },
  };

  const colors = colorMap[color];

  return (
    <div
      className="relative rounded-xl border p-4 text-center transition-transform duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: colors.bg, borderColor: colors.border }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto mb-3"
        style={{ backgroundColor: colors.iconBg }}
      >
        <Icon className="h-5 w-5" style={{ color: colors.iconText }} />
      </div>

      <span
        className="text-3xl font-bold tracking-tight block"
        style={{ color: colors.text }}
      >
        {value}
      </span>

      <span
        className="text-xs font-medium mt-1 block"
        style={{ color: colors.text }}
      >
        {label}
      </span>
    </div>
  );
}

interface ReportCardProps {
  report: {
    id: string;
    disaster_type: string;
    description: string | null;
    final_severity: string | null;
    ai_confidence: number | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    submitted_at: Date;
  };
}

function ReportCard({ report }: ReportCardProps) {
  const severityLabels: Record<string, string> = {
    unclear: 'Unclear',
    minor: 'Minor',
    moderate: 'Moderate',
    severe: 'Severe',
    critical: 'Critical',
  };
  
  const severityColors: Record<string, { bg: string; text: string; border: string }> = {
    unclear: { bg: 'var(--ink-50)', text: 'var(--ink-600)', border: 'var(--ink-200)' },
    minor: { bg: 'var(--success-50)', text: 'var(--success-600)', border: 'var(--success-100)' },
    moderate: { bg: 'var(--warning-50)', text: 'var(--warning-600)', border: 'var(--warning-100)' },
    severe: { bg: 'var(--danger-50)', text: 'var(--danger-600)', border: 'var(--danger-100)' },
    critical: { bg: 'var(--danger-50)', text: 'var(--danger-600)', border: 'var(--danger-100)' },
  };

  const verificationLabels: Record<string, string> = {
    unverified: 'Unverified',
    needs_review: 'Needs Review',
    verified: 'Verified',
    rejected: 'Rejected',
    escalated: 'Escalated',
  };

  const sev = report.final_severity || 'unclear';
  const colors = severityColors[sev] || severityColors.unclear;

  return (
    <div className="rounded-xl border bg-[var(--surface-primary)] p-4 shadow-xs hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-semibold text-[var(--ink-900)] capitalize">
            {report.disaster_type.replace("_", " ")}
          </span>
          <p className="text-[11px] text-[var(--ink-400)] mt-0.5">
            {new Date(report.submitted_at).toLocaleDateString()}
          </p>
        </div>
        <Badge 
          className="font-medium px-3 py-1"
          style={{ 
            backgroundColor: colors.bg, 
            color: colors.text, 
            borderColor: colors.border 
          }}
        >
          {severityLabels[sev]}
        </Badge>
      </div>
      {report.description && (
        <p className="mt-2 text-xs text-[var(--ink-600)] line-clamp-2">{report.description}</p>
      )}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-[var(--ink-200)]/60 text-[11px]">
        <span className="text-[var(--ink-500)] flex items-center gap-1">
          <span className="relative flex h-2 w-2 rounded-full" style={{ backgroundColor: report.verification_status === 'verified' ? 'var(--success-500)' : 'var(--warning-500)' }} />
          {verificationLabels[report.verification_status] || report.verification_status}
        </span>
        <span className="font-mono text-[var(--ink-400)] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-500)' }} />
          P:{report.priority_score ?? "—"}
        </span>
      </div>
    </div>
  );
}