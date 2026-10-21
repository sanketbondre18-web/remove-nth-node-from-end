import type { CompareStepState, PointerBadgeInfo } from '../../types';

interface LinkedListCanvasProps {
  state: CompareStepState | null;
  emptyMessage?: string;
}

const NODE_W = 54;
const NODE_H = 54;
const GAP = 34;
const ARROW_W = GAP;
const UNIT = NODE_W + ARROW_W;
const POINTER_BADGE_H = 22;
const TOP_PAD = 48; // room for stacked pointer badges
const BOT_PAD = 20;
const NULL_W = 46;

export default function LinkedListCanvas({
  state,
  emptyMessage = 'Enter list parameters above and click "Compare" to start.',
}: LinkedListCanvasProps) {
  if (!state) {
    return (
      <div className="bg-bg-primary/50 border border-border/60 rounded-xl p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-text-muted text-xs italic">{emptyMessage}</p>
      </div>
    );
  }

  const nodes = state.nodes;
  const nodeCount = nodes.length;
  const totalW = Math.max(nodeCount * UNIT + NULL_W + 36, 320);
  const totalH = NODE_H + TOP_PAD + BOT_PAD + POINTER_BADGE_H;

  const isBypass = state.isBypass;
  const fromIdx = state.bypassFromIndex ?? -1;
  const toIdx = state.bypassToIndex ?? -1;
  const targetIdx = state.targetIndex;

  // Calculate coordinates for bypass curve if active
  let bypassData: { path: string; destX: number; destY: number } | null = null;
  if (isBypass && fromIdx >= 0) {
    const startX = 16 + fromIdx * UNIT + NODE_W;
    const startY = TOP_PAD + NODE_H / 2;

    const hasDest = toIdx >= 0 && toIdx < nodeCount;
    const destX = hasDest ? 16 + toIdx * UNIT : 16 + nodeCount * UNIT + 4;
    const destY = TOP_PAD + NODE_H / 2;

    const targetX = 16 + targetIdx * UNIT;
    const midX = targetX + NODE_W / 2;
    const midY = TOP_PAD - 20;

    const cp1x = startX + 20;
    const cp1y = startY - 14;
    const cp2x = midX - 30;
    const cp2y = midY;

    const cp3x = midX + 30;
    const cp3y = midY;
    const cp4x = destX - 22;
    const cp4y = destY;

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${destX} ${destY}`;
    bypassData = { path, destX, destY };
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <svg
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="block mx-auto min-w-full"
        aria-label="Linked list comparison canvas"
      >
        <defs>
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#475569" />
          </marker>
          <marker
            id="arrow-cyan-bypass"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* Render nodes and links */}
        {nodes.map((node, idx) => {
          const x = 16 + idx * UNIT;
          const y = TOP_PAD;
          const isDummy = state.hasDummy && idx === 0;
          const isTarget = idx === targetIdx && !state.removed;
          const pointers: PointerBadgeInfo[] = state.pointerMap[idx] || [];

          // Colors
          let bgColor = 'rgba(30, 41, 59, 0.6)';
          let borderColor = '#334155';
          let textColor = '#cbd5e1';

          if (isTarget) {
            bgColor = 'rgba(239, 68, 68, 0.16)';
            borderColor = '#ef4444';
            textColor = '#fca5a5';
          } else if (isDummy) {
            bgColor = 'rgba(139, 92, 246, 0.14)';
            borderColor = '#8b5cf6';
            textColor = '#c4b5fd';
          } else if (pointers.some((p) => p.name === 'slow' || p.name === 'curr')) {
            bgColor = 'rgba(56, 189, 248, 0.14)';
            borderColor = '#38bdf8';
            textColor = '#bae6fd';
          } else if (pointers.some((p) => p.name === 'fast')) {
            bgColor = 'rgba(244, 114, 182, 0.14)';
            borderColor = '#f472b6';
            textColor = '#fbcfe8';
          }

          return (
            <g key={`cmp-node-${node.id}-${idx}`} className="ll-node">
              {/* Stacked pointer badges (never overlap) */}
              {pointers.map((ptr, pi) => {
                const badgeY = y - 8 - pi * 22;
                return (
                  <g key={`${ptr.name}-${pi}`} className="pointer-badge">
                    <rect
                      x={x + NODE_W / 2 - 24}
                      y={badgeY - 14}
                      width={48}
                      height={18}
                      rx={9}
                      fill={ptr.color}
                      fillOpacity={0.2}
                      stroke={ptr.color}
                      strokeWidth={1.2}
                    />
                    <text
                      x={x + NODE_W / 2}
                      y={badgeY - 2}
                      textAnchor="middle"
                      fill={ptr.color}
                      fontSize={9.5}
                      fontWeight={700}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {ptr.name}
                    </text>
                  </g>
                );
              })}

              {/* Node rectangle */}
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={12}
                fill={bgColor}
                stroke={borderColor}
                strokeWidth={isTarget ? 2 : 1.5}
                className={isTarget ? 'animate-pulse-ring' : ''}
              />

              {/* Node value */}
              <text
                x={x + NODE_W / 2}
                y={y + (isDummy ? NODE_H / 2 - 4 : NODE_H / 2 + 1)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={isDummy ? 10.5 : 15}
                fontWeight={600}
                fontFamily={isDummy ? "'JetBrains Mono', monospace" : "'Inter', sans-serif"}
              >
                {isDummy ? 'dummy' : node.value}
              </text>
              {isDummy && (
                <text
                  x={x + NODE_W / 2}
                  y={y + NODE_H / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#a78bfa"
                  fontSize={8}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  sentinel
                </text>
              )}

              {/* Index label underneath */}
              <text
                x={x + NODE_W / 2}
                y={y + NODE_H + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
              >
                {isDummy ? '[dummy]' : `[${state.hasDummy ? idx - 1 : idx}]`}
              </text>

              {/* Arrow to next node */}
              {idx < nodeCount - 1 && (
                <g className="ll-arrow">
                  {isBypass && idx === fromIdx ? (
                    // Severed link from predecessor
                    <line
                      x1={x + NODE_W}
                      y1={y + NODE_H / 2}
                      x2={x + NODE_W + ARROW_W - 6}
                      y2={y + NODE_H / 2}
                      stroke="#475569"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.3}
                    />
                  ) : isBypass && idx === targetIdx ? (
                    // Severed link from target
                    <line
                      x1={x + NODE_W}
                      y1={y + NODE_H / 2}
                      x2={x + NODE_W + ARROW_W - 6}
                      y2={y + NODE_H / 2}
                      stroke="#ef4444"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.25}
                    />
                  ) : (
                    <>
                      <line
                        x1={x + NODE_W}
                        y1={y + NODE_H / 2}
                        x2={x + NODE_W + ARROW_W - 6}
                        y2={y + NODE_H / 2}
                        stroke={isTarget ? '#ef444480' : '#475569'}
                        strokeWidth={1.5}
                      />
                      <polygon
                        points={`${x + NODE_W + ARROW_W - 6},${y + NODE_H / 2 - 4} ${x + NODE_W + ARROW_W},${y + NODE_H / 2} ${x + NODE_W + ARROW_W - 6},${y + NODE_H / 2 + 4}`}
                        fill={isTarget ? '#ef444480' : '#475569'}
                      />
                    </>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Active Bypass Arrow */}
        {bypassData && (
          <g className="bypass-group">
            <path
              d={bypassData.path}
              fill="none"
              stroke="#38bdf8"
              strokeWidth={2}
              className="bypass-arrow"
              markerEnd="url(#arrow-cyan-bypass)"
            />
          </g>
        )}

        {/* NULL terminator */}
        <g>
          <text
            x={16 + nodeCount * UNIT + 8}
            y={TOP_PAD + NODE_H / 2 + 1}
            dominantBaseline="central"
            fill="#64748b"
            fontSize={12}
            fontWeight={700}
            fontFamily="'JetBrains Mono', monospace"
          >
            NULL
          </text>
          {nodeCount > 0 && (
            isBypass && targetIdx === nodeCount - 1 ? (
              <line
                x1={16 + (nodeCount - 1) * UNIT + NODE_W}
                y1={TOP_PAD + NODE_H / 2}
                x2={16 + nodeCount * UNIT - 6}
                y2={TOP_PAD + NODE_H / 2}
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="4 3"
                opacity={0.25}
              />
            ) : (
              <>
                <line
                  x1={16 + (nodeCount - 1) * UNIT + NODE_W}
                  y1={TOP_PAD + NODE_H / 2}
                  x2={16 + nodeCount * UNIT - 6}
                  y2={TOP_PAD + NODE_H / 2}
                  stroke="#475569"
                  strokeWidth={1.5}
                />
                <polygon
                  points={`${16 + nodeCount * UNIT - 6},${TOP_PAD + NODE_H / 2 - 4} ${16 + nodeCount * UNIT},${TOP_PAD + NODE_H / 2} ${16 + nodeCount * UNIT - 6},${TOP_PAD + NODE_H / 2 + 4}`}
                  fill="#475569"
                />
              </>
            )
          )}
        </g>
      </svg>
    </div>
  );
}
