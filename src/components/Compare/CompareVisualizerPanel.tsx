import { ArrowRight, Info, Activity, Eye, MoveRight } from 'lucide-react';
import type { CompareStepState } from '../../types';
import LinkedListCanvas from './LinkedListCanvas';

interface CompareVisualizerPanelProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeColorClass: string;
  state: CompareStepState | null;
  emptyMessage?: string;
  accentColor: string;
}

export default function CompareVisualizerPanel({
  title,
  subtitle,
  badgeLabel,
  badgeColorClass,
  state,
  emptyMessage,
  accentColor,
}: CompareVisualizerPanelProps) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-black/20 animate-fade-in">
      {/* Panel Top Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <h3 className="text-sm font-bold text-text-primary tracking-tight">
                {title}
              </h3>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeColorClass}`}
            >
              {state?.phase || badgeLabel}
            </span>
            {state && (
              <span className="text-[11px] font-mono text-text-muted bg-bg-primary px-2 py-0.5 rounded border border-border">
                {state.stepNumber}/{state.totalSteps}
              </span>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 px-1 text-[11px]">
          {title.includes('Two-Pass') ? (
            <>
              <LegendItem color="#a78bfa" label="head" />
              <LegendItem color="#38bdf8" label="curr" />
              <LegendItem color="#ef4444" label="target" />
              <LegendItem color="#334155" label="node" />
            </>
          ) : (
            <>
              <LegendItem color="#8b5cf6" label="dummy" />
              <LegendItem color="#22d3ee" label="slow" />
              <LegendItem color="#f472b6" label="fast" />
              <LegendItem color="#ef4444" label="target" />
            </>
          )}
        </div>

        {/* Progress Line */}
        {state && (
          <div className="w-full h-1 bg-bg-primary rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(state.stepNumber / state.totalSteps) * 100}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        )}

        {/* Canvas */}
        <div className="bg-bg-primary/40 border border-border/60 rounded-lg p-2 mb-3">
          <LinkedListCanvas state={state} emptyMessage={emptyMessage} />
        </div>
      </div>

      {/* Panel Bottom: Explanation and Metrics */}
      {state ? (
        <div className="space-y-3 pt-2">
          {/* Main action description */}
          <div className="flex items-start gap-2 bg-bg-elevated/40 border border-border/40 rounded-lg p-3">
            <ArrowRight
              size={15}
              className="shrink-0 mt-0.5"
              style={{ color: accentColor }}
            />
            <p className="text-xs font-medium text-text-primary leading-relaxed">
              {state.description}
            </p>
          </div>

          {/* Pedagogical detail */}
          <div className="flex items-start gap-2 bg-bg-primary/60 border border-border/40 rounded-lg px-3 py-2 text-[11px] text-text-secondary leading-relaxed">
            <Info size={13} className="text-accent shrink-0 mt-0.5" />
            <p>{state.detail}</p>
          </div>

          {/* Live Performance Stats Bar */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <MetricBadge
              icon={<Activity size={12} />}
              label="Traversal"
              value={state.stats.traversals.split(' ')[0] + ' ' + (state.stats.traversals.split(' ')[1] || '')}
              subtext={state.stats.traversals}
            />
            <MetricBadge
              icon={<Eye size={12} />}
              label="Node Visits"
              value={String(state.stats.nodeVisits)}
              subtext="memory reads"
            />
            <MetricBadge
              icon={<MoveRight size={12} />}
              label="Pointer Moves"
              value={String(state.stats.pointerMoves)}
              subtext="advancements"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-xs text-text-muted">
          Awaiting comparison run...
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 font-mono">
      <span
        className="w-2 h-2 rounded-full inline-block border"
        style={{ backgroundColor: `${color}40`, borderColor: color }}
      />
      <span className="text-text-muted">{label}</span>
    </div>
  );
}

function MetricBadge({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="bg-bg-primary/80 border border-border/50 rounded-lg p-2 text-center flex flex-col justify-between">
      <div className="flex items-center justify-center gap-1 text-[10px] text-text-muted mb-0.5">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-xs font-bold font-mono text-text-primary truncate" title={subtext}>
        {value}
      </p>
      <p className="text-[9px] text-text-muted truncate mt-0.5">{subtext}</p>
    </div>
  );
}
