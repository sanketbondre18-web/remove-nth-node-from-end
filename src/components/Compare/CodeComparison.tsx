import { useState } from 'react';
import { Code2, Columns, LayoutGrid, Info } from 'lucide-react';
import type { CompareStepState } from '../../types';
import { TWO_PASS_CPP_CODE, ONE_PASS_CPP_CODE } from '../../compareAlgorithms';

interface CodeComparisonProps {
  twoPassState: CompareStepState | null;
  onePassState: CompareStepState | null;
}

export default function CodeComparison({
  twoPassState,
  onePassState,
}: CodeComparisonProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'tabbed'>(
    'side-by-side'
  );
  const [activeTab, setActiveTab] = useState<'twopass' | 'onepass'>('twopass');

  const twoPassLine = twoPassState?.highlightLine ?? -1;
  const onePassLine = onePassState?.highlightLine ?? -1;

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 sm:p-6 space-y-5 animate-fade-in">
      {/* Header & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <Code2 size={20} className="text-accent" />
          <div>
            <h2 className="text-base font-bold text-text-primary">
              C++ Source Code Comparison &amp; Live Line Tracking
            </h2>
            <p className="text-xs text-text-muted">
              Synchronized line execution with actual pointer dereferences
            </p>
          </div>
        </div>

        {/* View toggle buttons */}
        <div className="flex items-center gap-1 bg-bg-primary p-1 rounded-lg border border-border">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Columns size={13} />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>
          <button
            onClick={() => setViewMode('tabbed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'tabbed'
                ? 'bg-accent/20 text-accent border border-accent/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">Tabs</span>
          </button>
        </div>
      </div>

      {/* Tab Selector if in Tabbed mode */}
      {viewMode === 'tabbed' && (
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <button
            onClick={() => setActiveTab('twopass')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'twopass'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Two-Pass Implementation (C++)
          </button>
          <button
            onClick={() => setActiveTab('onepass')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'onepass'
                ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            One-Pass Implementation (C++)
          </button>
        </div>
      )}

      {/* Code Viewer Panels */}
      <div
        className={`grid gap-4 ${
          viewMode === 'side-by-side' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {/* Two-Pass Panel */}
        {(viewMode === 'side-by-side' || activeTab === 'twopass') && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Algorithm A: Two-Pass Approach
              </span>
              {twoPassLine > 0 && (
                <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Executing Line {twoPassLine}
                </span>
              )}
            </div>

            <CodeBlock
              lines={TWO_PASS_CPP_CODE}
              highlightedLine={twoPassLine}
              accentColor="#38bdf8"
            />

            {/* Active pointer operation explanation */}
            {twoPassState && (
              <div className="bg-bg-primary/70 border border-border/60 rounded-lg p-2.5 text-xs flex items-start gap-2">
                <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 font-sans">
                  <p className="text-[11px] font-semibold text-text-primary">
                    Current Pointer Operation:
                  </p>
                  <p className="text-[11px] text-text-secondary font-mono leading-relaxed">
                    {twoPassState.codeExplanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* One-Pass Panel */}
        {(viewMode === 'side-by-side' || activeTab === 'onepass') && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-pink-400" />
                Algorithm B: One-Pass Approach
              </span>
              {onePassLine > 0 && (
                <span className="text-[10px] font-mono text-pink-400/90 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  Executing Line {onePassLine}
                </span>
              )}
            </div>

            <CodeBlock
              lines={ONE_PASS_CPP_CODE}
              highlightedLine={onePassLine}
              accentColor="#f472b6"
            />

            {/* Active pointer operation explanation */}
            {onePassState && (
              <div className="bg-bg-primary/70 border border-border/60 rounded-lg p-2.5 text-xs flex items-start gap-2">
                <Info size={14} className="text-pink-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 font-sans">
                  <p className="text-[11px] font-semibold text-text-primary">
                    Current Pointer Operation:
                  </p>
                  <p className="text-[11px] text-text-secondary font-mono leading-relaxed">
                    {onePassState.codeExplanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({
  lines,
  highlightedLine,
  accentColor,
}: {
  lines: string[];
  highlightedLine: number;
  accentColor: string;
}) {
  return (
    <div className="bg-bg-primary border border-border rounded-lg overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto max-h-[380px] p-2">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = lineNum === highlightedLine;

              return (
                <tr
                  key={lineNum}
                  className={`transition-colors leading-relaxed ${
                    isHighlighted
                      ? 'bg-accent/15 border-l-2'
                      : 'hover:bg-bg-elevated/40'
                  }`}
                  style={{
                    borderLeftColor: isHighlighted ? accentColor : 'transparent',
                  }}
                >
                  {/* Line Number */}
                  <td className="w-10 pr-3 text-right select-none text-[11px] text-text-muted/60 align-top">
                    {isHighlighted ? (
                      <span
                        className="font-bold flex items-center justify-end gap-1"
                        style={{ color: accentColor }}
                      >
                        <span className="text-[9px]">▶</span>
                        {lineNum}
                      </span>
                    ) : (
                      lineNum
                    )}
                  </td>

                  {/* Code Line Content */}
                  <td
                    className={`pl-2 py-0.5 whitespace-pre font-mono text-[11.5px] ${
                      isHighlighted
                        ? 'text-white font-semibold'
                        : line.trim().startsWith('//')
                        ? 'text-text-muted italic'
                        : 'text-text-primary'
                    }`}
                  >
                    {syntaxHighlight(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function syntaxHighlight(code: string) {
  // If line is a comment
  if (code.trim().startsWith('//')) {
    return <span className="text-slate-500 italic">{code}</span>;
  }

  // Very simple tokenizing for C++
  const keywords = ['ListNode*', 'int', 'while', 'for', 'if', 'return', 'delete', 'new', 'nullptr'];
  const parts = code.split(/(\b(?:ListNode\*|int|while|for|if|return|delete|new|nullptr)\b)/g);

  return parts.map((part, i) => {
    if (keywords.includes(part)) {
      if (part === 'ListNode*' || part === 'int') {
        return (
          <span key={i} className="text-cyan-300 font-semibold">
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-purple-400 font-semibold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
