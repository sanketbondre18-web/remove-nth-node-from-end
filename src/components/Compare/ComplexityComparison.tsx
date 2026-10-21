import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';
import type { CompareStepState } from '../../types';

interface ComplexityComparisonProps {
  twoPassState: CompareStepState | null;
  onePassState: CompareStepState | null;
}

export default function ComplexityComparison({
  twoPassState,
  onePassState,
}: ComplexityComparisonProps) {
  // Compute final results and metrics if available
  const twoPassDone = twoPassState?.removed ?? false;
  const onePassDone = onePassState?.removed ?? false;

  const twoPassFinalList =
    twoPassState?.nodes.map((n) => n.value) ?? [];
  const onePassFinalList =
    onePassState?.nodes.slice(1).map((n) => n.value) ?? [];

  const outputsMatch =
    twoPassDone &&
    onePassDone &&
    JSON.stringify(twoPassFinalList) === JSON.stringify(onePassFinalList);

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 sm:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
        <Scale size={20} className="text-accent" />
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Algorithm Complexity &amp; Performance Comparison
          </h2>
          <p className="text-xs text-text-muted">
            Theoretical Big-O analysis contrasted with live empirical performance
          </p>
        </div>
      </div>

      {/* 1. Theoretical Comparison Table */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Layers size={14} className="text-accent" />
          Theoretical Complexity Analysis
        </h3>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bg-elevated/80 border-b border-border text-text-secondary font-mono">
                <th className="py-2.5 px-4 font-semibold">Metric</th>
                <th className="py-2.5 px-4 font-semibold text-cyan-400">
                  Two-Pass Approach
                </th>
                <th className="py-2.5 px-4 font-semibold text-pink-400">
                  One-Pass Approach
                </th>
                <th className="py-2.5 px-4 font-semibold">Theoretical Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-text-primary">
              <tr className="hover:bg-bg-primary/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-text-secondary">
                  Time Complexity
                </td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">O(n)</td>
                <td className="py-2.5 px-4 text-pink-300 font-bold">O(n)</td>
                <td className="py-2.5 px-4 font-sans text-text-muted text-[11px]">
                  Both are asymptotically linear. Two-pass performs L + (L - n) steps ≈ 2n operations.
                </td>
              </tr>
              <tr className="hover:bg-bg-primary/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-text-secondary">
                  Auxiliary Space
                </td>
                <td className="py-2.5 px-4 text-cyan-300 font-bold">O(1)</td>
                <td className="py-2.5 px-4 text-pink-300 font-bold">O(1)</td>
                <td className="py-2.5 px-4 font-sans text-text-muted text-[11px]">
                  Both only use a constant number of auxiliary pointer variables.
                </td>
              </tr>
              <tr className="hover:bg-bg-primary/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-text-secondary">
                  Traversals
                </td>
                <td className="py-2.5 px-4 text-text-primary">Two traversals</td>
                <td className="py-2.5 px-4 text-text-primary">One traversal</td>
                <td className="py-2.5 px-4 font-sans text-text-muted text-[11px]">
                  One-pass avoids a separate length-counting pass over the list.
                </td>
              </tr>
              <tr className="hover:bg-bg-primary/30 transition-colors">
                <td className="py-2.5 px-4 font-semibold text-text-secondary">
                  Sentinel / Dummy
                </td>
                <td className="py-2.5 px-4 text-text-muted">None (explicit branch)</td>
                <td className="py-2.5 px-4 text-text-primary">1 dummy node</td>
                <td className="py-2.5 px-4 font-sans text-text-muted text-[11px]">
                  Dummy sentinel unifies regular and head deletions under one routine.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Theoretical Insight Callout */}
        <div className="mt-3 bg-accent/8 border border-accent/20 rounded-lg p-3.5 flex items-start gap-3">
          <Zap size={16} className="text-accent shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-semibold text-text-primary">
              Asymptotic Equivalence vs Constant Factor
            </p>
            <p className="text-text-secondary leading-relaxed">
              It is a common misconception to claim that One-Pass has a "better Big-O" time complexity. Because Big-O notation ignores constant multipliers, both <span className="font-mono text-cyan-300">O(2n)</span> and <span className="font-mono text-pink-300">O(n)</span> belong to the exact same complexity class: <span className="font-mono font-bold text-accent">O(n)</span>. The practical advantage of One-Pass is a lower constant factor: it avoids traversing the list twice, which cuts memory reads in half and minimizes CPU cache misses.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Measured Execution Performance (Current Run) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          Measured Execution Metrics (Current Run)
        </h3>

        {twoPassState && onePassState ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Metric 1: Node visits */}
            <div className="bg-bg-primary/80 border border-border rounded-lg p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-text-muted font-medium">
                Total Node Memory Reads
              </span>
              <div className="flex items-baseline justify-between mt-2 font-mono">
                <div>
                  <span className="text-xs text-cyan-400">Two-Pass: </span>
                  <span className="text-base font-bold text-text-primary">
                    {twoPassState.stats.nodeVisits}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-pink-400">One-Pass: </span>
                  <span className="text-base font-bold text-text-primary">
                    {onePassState.stats.nodeVisits}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                {twoPassState.stats.nodeVisits > onePassState.stats.nodeVisits
                  ? `One-Pass saved ${twoPassState.stats.nodeVisits - onePassState.stats.nodeVisits} memory lookups on this input.`
                  : 'Pointers currently in progress.'}
              </p>
            </div>

            {/* Metric 2: Pointer moves */}
            <div className="bg-bg-primary/80 border border-border rounded-lg p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-text-muted font-medium">
                Pointer Advancement Steps
              </span>
              <div className="flex items-baseline justify-between mt-2 font-mono">
                <div>
                  <span className="text-xs text-cyan-400">Two-Pass: </span>
                  <span className="text-base font-bold text-text-primary">
                    {twoPassState.stats.pointerMoves}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-pink-400">One-Pass: </span>
                  <span className="text-base font-bold text-text-primary">
                    {onePassState.stats.pointerMoves}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                Accumulated pointer assignments across all phases.
              </p>
            </div>

            {/* Metric 3: Output verification */}
            <div className="bg-bg-primary/80 border border-border rounded-lg p-3.5 flex flex-col justify-between">
              <span className="text-[11px] text-text-muted font-medium">
                Correctness Verification
              </span>
              <div className="mt-2">
                {outputsMatch ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={16} />
                    <span>Outputs Identical ✓</span>
                  </div>
                ) : twoPassDone && onePassDone ? (
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                    <AlertTriangle size={16} />
                    <span>Output Mismatch</span>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted font-mono">
                    Executing algorithm steps...
                  </span>
                )}
              </div>
              <p className="text-[10px] text-text-muted mt-2 font-mono truncate">
                Result:{' '}
                {twoPassDone
                  ? twoPassFinalList.length > 0
                    ? twoPassFinalList.join(' → ') + ' → NULL'
                    : 'empty'
                  : 'pending'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted italic bg-bg-primary/40 border border-border/40 rounded-lg p-4">
            Run the comparison to see live measured operations and node reads.
          </p>
        )}
      </div>
    </div>
  );
}
