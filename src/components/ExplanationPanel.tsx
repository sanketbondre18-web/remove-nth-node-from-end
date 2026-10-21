import { Info, ArrowRight } from 'lucide-react';
import type { AlgorithmState } from '../types';

interface ExplanationPanelProps {
  state: AlgorithmState | null;
}

export default function ExplanationPanel({ state }: ExplanationPanelProps) {
  if (!state) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-5 min-h-[120px] flex items-center justify-center">
        <p className="text-text-muted text-sm italic">
          Step-by-step explanations will appear here during the animation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 animate-fade-in">
      {/* Phase + step badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-accent/12 text-accent border border-accent/20 font-mono">
          {state.phase}
        </span>
        <span className="text-[11px] text-text-muted font-mono">
          Step {state.stepNumber}/{state.totalSteps}
        </span>
      </div>

      {/* Main description */}
      <div className="flex items-start gap-2 mb-3">
        <ArrowRight size={14} className="text-accent shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-text-primary leading-relaxed">
          {state.description}
        </p>
      </div>

      {/* Detail explanation */}
      <div className="flex items-start gap-2 bg-bg-elevated/60 border border-border/50 rounded-lg px-3 py-2.5">
        <Info size={13} className="text-accent-bright shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary leading-relaxed">
          {state.detail}
        </p>
      </div>

      {/* Pointer state */}
      {(state.slowIndex >= 0 || state.fastIndex >= 0) && (
        <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border/40">
          {state.slowIndex >= 0 && (
            <PointerInfo
              name="slow"
              color="#22d3ee"
              index={state.slowIndex}
              value={
                state.slowIndex === 0
                  ? 'dummy'
                  : String(state.nodes[state.slowIndex]?.value ?? '—')
              }
            />
          )}
          {state.fastIndex >= 0 && (
            <PointerInfo
              name="fast"
              color="#f472b6"
              index={state.fastIndex}
              value={
                state.fastIndex === 0
                  ? 'dummy'
                  : String(state.nodes[state.fastIndex]?.value ?? '—')
              }
            />
          )}
          {state.targetIndex >= 0 && !state.removed && (
            <PointerInfo
              name="target"
              color="#ef4444"
              index={state.targetIndex}
              value={String(state.nodes[state.targetIndex]?.value ?? '—')}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PointerInfo({
  name,
  color,
  index,
  value,
}: {
  name: string;
  color: string;
  index: number;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-mono">
      <span
        className="w-2 h-2 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
      <span style={{ color }} className="font-semibold">
        {name}
      </span>
      <span className="text-text-muted">→</span>
      <span className="text-text-secondary">
        [{index}] {value}
      </span>
    </div>
  );
}
