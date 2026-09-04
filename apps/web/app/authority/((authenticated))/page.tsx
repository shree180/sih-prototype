'use client';

import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncidentMap, MapReport } from "@/features/map/IncidentMap";
import { scrollAnimations, easings, durations } from "@/lib/animations";
import { useAuthorityStats } from "@/hooks/use-authority-stats";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap, MapPin, RefreshCw, Activity } from "lucide-react";

const SEVERITY_LABEL: Record<string, string> = {
  unclear: 'Unclear',
  minor: 'Minor',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

const SEVERITY_COLOR: Record<string, string> = {
  unclear: 'bg-[var(--ink-50)] text-[var(--ink-600)] border-[var(--ink-200)]',
  minor: 'bg-[var(--success-50)] text-[var(--success-600)] border-[var(--success-100)]',
  moderate: 'bg-[var(--warning-50)] text-[var(--warning-600)] border-[var(--warning-100)]',
  severe: 'bg-[var(--danger-50)] text-[var(--danger-600)] border-[var(--danger-100)]',
  critical: 'bg-[var(--danger-50)] text-[var(--danger-600)] border-[var(--danger-100)]',
};

const VERIFICATION_LABEL: Record<string, string> = {
  unverified: 'Unverified',
  needs_review: 'Needs Review',
  verified: 'Verified',
  rejected: 'Rejected',
  escalated: 'Escalated',
};

function priorityBand(score: number | null) {
  if (score === null || score === undefined) return { label: 'None', color: 'bg-[var(--ink-100)] text-[var(--ink-600)] border-[var(--ink-200)]' };
  if (score >= 80) return { label: 'P1', color: 'bg-[var(--danger-50)] text-[var(--danger-600)] border-[var(--danger-100)]' };
  if (score >= 60) return { label: 'P2', color: 'bg-[var(--warning-50)] text-[var(--warning-600)] border-[var(--warning-100)]' };
  if (score >= 40) return { label: 'P3', color: 'bg-[var(--accent-50)] text-[var(--accent-600)] border-[var(--accent-100)]' };
  return { label: 'P4', color: 'bg-[var(--ink-100)] text-[var(--ink-600)] border-[var(--ink-200)]' };
}

export default function AuthorityDashboard() {
  const { data: stats, isLoading, refetch } = useAuthorityStats();
  
  const total = stats?.total ?? 0;
  const critical = stats?.critical ?? 0;
  const needsReview = stats?.needsReview ?? 0;
  const verified = stats?.verified ?? 0;
  const escalated = stats?.escalated ?? 0;
  const inProgress = stats?.inProgress ?? 0;

  const priorityQueue = stats?.priorityQueue ?? [];
  const mapReports = (stats?.mapReports ?? []).map(r => ({
    ...r,
    severity: r.severity as import('@/lib/types').Severity | null,
  }));

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

      {/* Mission Control Banner - Real-time Pulse */}
      <MissionControlBanner 
        stats={stats} 
        isLoading={isLoading}
        onRefresh={refetch}
      />

      {/* Enhanced KPI Row */}
      <section className="relative px-4 py-8">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={scrollAnimations.staggerContainer}
          >
            <EnhancedKpiCard 
              label="Total Incidents" 
              value={total} 
              icon={MapPin}
              color="primary"
              trend="+12%"
              trendLabel="vs 1hr ago"
            />
            <EnhancedKpiCard 
              label="Critical" 
              value={critical} 
              icon={AlertTriangle}
              color="danger"
              trend={critical > 0 ? "+3" : "0"}
              trendLabel="immediate action"
            />
            <EnhancedKpiCard 
              label="Needs Review" 
              value={needsReview} 
              icon={Clock}
              color="warning"
              trend="+5"
              trendLabel="awaiting triage"
            />
            <EnhancedKpiCard 
              label="Verified" 
              value={verified} 
              icon={CheckCircle2}
              color="success"
              trend="+18"
              trendLabel="confirmed"
            />
            <EnhancedKpiCard 
              label="Escalated" 
              value={escalated} 
              icon={Zap}
              color="danger"
              trend={escalated > 0 ? "+2" : "0"}
              trendLabel="priority queue"
            />
            <EnhancedKpiCard 
              label="In Progress" 
              value={inProgress} 
              icon={Activity}
              color="info"
              trend="+7"
              trendLabel="active response"
            />
          </motion.div>
        </div>
      </section>

      {/* Map + Priority Queue */}
      <section className="relative px-4 pb-8">
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            className="grid gap-4 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {/* Live Map */}
            <motion.div
              className="lg:col-span-2 space-y-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: durations.slow, ease: easings.apple }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <motion.h2 
                  className="text-base font-semibold text-[var(--ink-900)]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: durations.normal, ease: easings.apple }}
                >
                  Live Incident Map
                </motion.h2>
                <motion.div
                  className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--ink-500)]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: durations.normal, ease: easings.apple, delay: 0.1 }}
                >
                  <LegendDot color="var(--danger-500)" label="Critical" />
                  <LegendDot color="var(--warning-500)" label="Severe" />
                  <LegendDot color="var(--accent-500)" label="Moderate" />
                  <LegendDot color="var(--success-500)" label="Minor" />
                  <LegendDot color="var(--ink-400)" label="Unclear" />
                </motion.div>
              </div>
              
              <div className="relative rounded-2xl border border-[var(--ink-200)] bg-[var(--surface-primary)] overflow-hidden shadow-md">
                <IncidentMap reports={mapReports} height="h-[480px]" />

                {/* Map overlay stats — solid surface, no glass over the map */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-xl border border-[var(--ink-200)] bg-[var(--surface-primary)]/95 p-3 shadow-sm sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success-500)] opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success-600)]" />
                        </span>
                        <span className="text-sm font-semibold text-[var(--ink-900)]">Live</span>
                        <span className="text-xs text-[var(--ink-500)]">{mapReports.length} incidents on map</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--ink-500)]">
                        <RefreshCw className="h-3 w-3 text-[var(--accent-600)]" />
                        <span>Auto-refresh: 30s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Priority Queue */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: durations.slow, ease: easings.apple }}
            >
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.normal, ease: easings.apple }}
              >
                <h2 className="text-base font-semibold text-[var(--ink-900)] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[var(--accent-600)]" />
                  Priority Queue
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refetch}
                  disabled={isLoading}
                  className="gap-1 text-xs font-semibold text-[var(--accent-600)] hover:text-[var(--accent-600)]"
                >
                  <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                  Refresh
                </Button>
              </motion.div>

              <motion.div
                className="space-y-2 max-h-[480px] overflow-y-auto pr-1"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={scrollAnimations.staggerContainer}
              >
                {priorityQueue.length > 0 ? (
                  priorityQueue.map((r) => (
                    <motion.div
                      key={r.id}
                      variants={scrollAnimations.staggerItem}
                      className="transition-transform duration-200 hover:translate-x-1"
                    >
                      <PriorityQueueItem report={r} />
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-8 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-[var(--success-500)] mb-3" />
                    <p className="text-sm text-[var(--ink-500)]">No active incidents</p>
                    <p className="text-xs text-[var(--ink-400)] mt-1">All clear for now</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

interface MissionControlBannerProps {
  stats: any;
  isLoading: boolean;
  onRefresh: () => void;
}

function MissionControlBanner({ stats, isLoading, onRefresh }: MissionControlBannerProps) {
  const total = stats?.total ?? 0;
  const critical = stats?.critical ?? 0;
  const needsReview = stats?.needsReview ?? 0;
  const lastUpdate = stats?.lastUpdated ? new Date(stats.lastUpdated) : null;

  return (
    <div className="relative border-b border-[var(--ink-200)] bg-[var(--surface-primary)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--accent-500)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left: Title & Status */}
          <div className="animate-fade-in opacity-0 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-900)] sm:text-3xl">
                Mission Control
              </h1>
              <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success-500)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success-600)]" />
                </span>
                <span className="text-xs font-semibold">SYSTEM ACTIVE</span>
              </Badge>
            </div>
            <p className="text-sm text-[var(--ink-500)] max-w-xl">
              Real-time geospatial damage intelligence • {total} incidents tracked • Last updated {lastUpdate ? lastUpdate.toLocaleTimeString() : '—'}
            </p>
          </div>

          {/* Right: Critical Alerts & Quick Actions */}
          <div className="animate-fade-in opacity-0 stagger-2 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Critical Alert */}
            {critical > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--danger-500)]/30 bg-[var(--danger-50)]">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--danger-500)' }}
                >
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--danger-600)]">{critical} Critical Incident{critical > 1 ? 's' : ''}</p>
                  <p className="text-xs text-[var(--danger-600)]/80">Immediate attention required</p>
                </div>
              </div>
            )}

            {/* Needs Review Alert */}
            {needsReview > 0 && critical === 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--warning-500)]/30 bg-[var(--warning-50)]">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--warning-500)' }}
                >
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--warning-600)]">{needsReview} Awaiting Review</p>
                  <p className="text-xs text-[var(--warning-600)]/80">Triage needed</p>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[var(--ink-200)]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <StatusItem label="Incident Velocity" value={`${stats?.velocity ?? 0}/hr`} icon={TrendingUp} color="primary" />
            <StatusItem label="Avg Response" value={`${stats?.avgResponseTime ?? 0}s`} icon={Clock} color="info" />
            <StatusItem label="Verification Rate" value={`${stats?.verificationRate ?? 0}%`} icon={CheckCircle2} color="success" />
            <StatusItem label="System Health" value={`${stats?.systemHealth ?? 100}%`} icon={Activity} color="primary" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-500)]">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-500)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-600)]" />
            </span>
            <span>Live data stream active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  value: string;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

function StatusItem({ label, value, icon: Icon, color }: StatusItemProps) {
  const colorMap = {
    primary: 'var(--accent-500)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    danger: 'var(--danger-500)',
    info: 'var(--info-500)',
  };

  return (
    <div className="flex items-center gap-2" style={{ color: colorMap[color] }}>
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[var(--ink-500)]">{label}</span>
      <span className="font-semibold text-[var(--ink-900)]">{value}</span>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}

interface EnhancedKpiCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend: string;
  trendLabel: string;
}

function EnhancedKpiCard({ label, value, icon: Icon, color, trend, trendLabel }: EnhancedKpiCardProps) {
  const colorMap = {
    primary: { bg: 'var(--accent-50)', border: 'var(--accent-100)', text: 'var(--accent-600)', iconBg: 'var(--accent-100)', iconText: 'var(--accent-600)', trendColor: 'var(--accent-600)' },
    success: { bg: 'var(--success-50)', border: 'var(--success-100)', text: 'var(--success-600)', iconBg: 'var(--success-100)', iconText: 'var(--success-600)', trendColor: 'var(--success-600)' },
    warning: { bg: 'var(--warning-50)', border: 'var(--warning-100)', text: 'var(--warning-600)', iconBg: 'var(--warning-100)', iconText: 'var(--warning-600)', trendColor: 'var(--warning-600)' },
    danger: { bg: 'var(--danger-50)', border: 'var(--danger-100)', text: 'var(--danger-600)', iconBg: 'var(--danger-100)', iconText: 'var(--danger-600)', trendColor: 'var(--danger-600)' },
    info: { bg: 'var(--info-50)', border: 'var(--info-100)', text: 'var(--info-600)', iconBg: 'var(--info-100)', iconText: 'var(--info-600)', trendColor: 'var(--info-600)' },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      variants={scrollAnimations.staggerItem}
      className="group relative rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: colors.iconBg }}
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

      <div
        className="text-3xl font-bold tracking-tight"
        style={{ color: colors.text }}
      >
        {value.toLocaleString()}
      </div>

      <div
        className="text-xs font-medium mt-1"
        style={{ color: colors.text }}
      >
        {label}
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <TrendingUp className="h-3 w-3" style={{ color: colors.trendColor }} />
        <span className="text-xs font-semibold" style={{ color: colors.trendColor }}>{trend}</span>
        <span className="text-[10px]" style={{ color: colors.trendColor }}>{trendLabel}</span>
      </div>
    </motion.div>
  );
}

interface PriorityQueueItemProps {
  report: {
    id: string;
    disaster_type: string;
    asset_type: string | null;
    description: string | null;
    final_severity: string | null;
    priority_score: number | null;
    verification_status: string;
    operational_status: string;
    submitted_at: Date;
  };
}

function PriorityQueueItem({ report }: PriorityQueueItemProps) {
  const sev = report.final_severity || 'unclear';
  const band = priorityBand(report.priority_score);
  const timeAgo = getTimeAgo(new Date(report.submitted_at));

  return (
    <a
      href={`/authority/incidents/${report.id}`}
      className="relative block rounded-xl border border-[var(--ink-200)] bg-[var(--surface-primary)] p-3.5 shadow-xs hover:shadow-lg transition-all duration-300 group"
      style={{ borderLeftWidth: '3px', borderLeftColor: 'var(--accent-500)', borderLeftStyle: 'solid' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-[var(--ink-900)] capitalize group-hover:text-[var(--accent-600)] transition-colors">
            {report.disaster_type.replace("_", " ")}
          </span>
          <span className="text-[10px] text-[var(--ink-400)] ml-1.5">{report.asset_type || ""}</span>
          {report.description && (
            <p className="text-[11px] text-[var(--ink-500)] line-clamp-1 mt-0.5">{report.description}</p>
          )}
        </div>
        <Badge className={`${SEVERITY_COLOR[sev]} text-[10px] flex-shrink-0`}>{SEVERITY_LABEL[sev]}</Badge>
      </div>
      <div className="mt-2 flex items-center justify-between pt-2 border-t border-[var(--ink-200)]/60 text-[10px]">
        <Badge className={`${band.color} px-1.5 py-0 text-[9px]`}>{band.label} {report.priority_score ?? "—"}</Badge>
        <span className="text-[var(--accent-600)] font-semibold group-hover:underline flex items-center gap-1">
          <ArrowRight className="h-2.5 w-2.5" />
          Review
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--ink-400)]">
        <span className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {timeAgo}
        </span>
        <span className="font-mono">
          {VERIFICATION_LABEL[report.verification_status] || report.verification_status}
        </span>
      </div>
    </a>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}