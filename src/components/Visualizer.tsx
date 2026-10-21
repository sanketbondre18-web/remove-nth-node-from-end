import type { AlgorithmState } from '../types';

interface VisualizerProps {
  state: AlgorithmState | null;
}

const NODE_W = 56;
const NODE_H = 56;
const GAP = 36;
const ARROW_W = GAP;
const UNIT = NODE_W + ARROW_W;
const POINTER_BADGE_H = 28;
const TOP_PAD = 44; // space for pointer badges above nodes
const BOT_PAD = 16;
const NULL_W = 48;

function getNodeColor(
  index: number,
  state: AlgorithmState
): { bg: string; border: string; text: string } {
  const isDummy = index === 0;
  const isTarget = index === state.targetIndex;
  const isSlow = index === state.slowIndex;
  const isFast = index === state.fastIndex;

  if (isTarget && !state.removed)
    return { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#fca5a5' };
  if (isDummy)
    return { bg: 'rgba(167,139,250,0.12)', border: '#8b5cf6', text: '#c4b5fd' };
  if (isSlow && isFast)
    return { bg: 'rgba(34,211,238,0.12)', border: '#22d3ee', text: '#a5f3fc' };
  if (isSlow)
    return { bg: 'rgba(34,211,238,0.12)', border: '#22d3ee', text: '#a5f3fc' };
  if (isFast)
    return { bg: 'rgba(244,114,182,0.12)', border: '#f472b6', text: '#fbcfe8' };

  return { bg: 'rgba(30,41,59,0.6)', border: '#334155', text: '#cbd5e1' };
}

export default function Visualizer({ state }: VisualizerProps) {
  if (!state) {
    return (
      <div className="bg-bg-card border border-border rounded-xl p-8 flex items-center justify-center min-h-[220px]">
        <p className="text-text-muted text-sm italic">
          Configure the list above and click "Build &amp; Visualize" to begin.
        </p>
      </div>
    );
  }

  const nodeCount = state.nodes.length;
  const totalW = nodeCount * UNIT + NULL_W + 32;
  const totalH = NODE_H + TOP_PAD + BOT_PAD + POINTER_BADGE_H;

  // Build pointer badges: figure out which pointers are on which node
  const pointerMap = new Map<number, string[]>();
  if (state.slowIndex >= 0) {
    const arr = pointerMap.get(state.slowIndex) ?? [];
    arr.push('slow');
    pointerMap.set(state.slowIndex, arr);
  }
  if (state.fastIndex >= 0) {
    const arr = pointerMap.get(state.fastIndex) ?? [];
    arr.push('fast');
    pointerMap.set(state.fastIndex, arr);
  }

  const isBypassPhase = state.phase === 'Bypass pointer';

  // Calculate coordinates for the bypass arrow if in bypass phase
  let bypassData: {
    path: string;
    destX: number;
    destY: number;
  } | null = null;

  if (isBypassPhase && state.slowIndex >= 0) {
    const slowIdx = state.slowIndex;
    const targetIdx = state.targetIndex;
    const destIdx = slowIdx + 2;
    const startX = 16 + slowIdx * UNIT + NODE_W;
    const startY = TOP_PAD + NODE_H / 2;

    const hasDestNode = destIdx < nodeCount;
    // Connect flush to the destination node's left edge (or NULL terminator)
    const destX = hasDestNode ? 16 + destIdx * UNIT : 16 + nodeCount * UNIT + 4;
    const destY = TOP_PAD + NODE_H / 2;

    const targetX = 16 + targetIdx * UNIT;
    const midX = targetX + NODE_W / 2;
    const midY = TOP_PAD - 20; // 20px headroom above top of target node

    // Two smooth cubic Bezier curves joined horizontally at the summit (midX, midY)
    const cp1x = startX + 22;
    const cp1y = startY - 14;
    const cp2x = midX - 35;
    const cp2y = midY;

    const cp3x = midX + 35;
    const cp3y = midY;
    // Approaching destX horizontally so the arrow points straight into the node
    const cp4x = destX - 25;
    const cp4y = destY;

    const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} ${midY} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${destX} ${destY}`;
    bypassData = { path, destX, destY };
  }

  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 animate-fade-in">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3 px-1">
        <LegendItem color="#8b5cf6" label="Dummy" />
        <LegendItem color="#22d3ee" label="slow" />
        <LegendItem color="#f472b6" label="fast" />
        <LegendItem color="#ef4444" label="Target" />
        <LegendItem color="#334155" label="Node" />
      </div>

      {/* SVG canvas */}
      <div className="overflow-x-auto pb-2">
        <svg
          width={totalW}
          height={totalH}
          viewBox={`0 0 ${totalW} ${totalH}`}
          className="block mx-auto"
          aria-label="Linked list visualization"
        >
          {state.nodes.map((node, idx) => {
            const x = 16 + idx * UNIT;
            const y = TOP_PAD;
            const colors = getNodeColor(idx, state);
            const isDummy = idx === 0;
            const isTarget = idx === state.targetIndex && !state.removed;
            const pointers = pointerMap.get(idx);

            return (
              <g key={`node-${node.id}-${idx}`} className="ll-node">
                {/* Pointer badges above the node */}
                {pointers?.map((ptr, pi) => {
                  const badgeColor = ptr === 'slow' ? '#22d3ee' : '#f472b6';
                  const badgeY = y - 8 - pi * 22;
                  return (
                    <g key={ptr} className="pointer-badge">
                      <rect
                        x={x + NODE_W / 2 - 20}
                        y={badgeY - 14}
                        width={40}
                        height={18}
                        rx={9}
                        fill={badgeColor}
                        fillOpacity={0.18}
                        stroke={badgeColor}
                        strokeWidth={1}
                      />
                      <text
                        x={x + NODE_W / 2}
                        y={badgeY - 3}
                        textAnchor="middle"
                        fill={badgeColor}
                        fontSize={10}
                        fontWeight={600}
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        {ptr}
                      </text>
                    </g>
                  );
                })}

                {/* Node box */}
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={isTarget ? 2 : 1.5}
                  className={isTarget ? 'animate-pulse-ring' : ''}
                />

                {/* Node value */}
                <text
                  x={x + NODE_W / 2}
                  y={y + (isDummy ? NODE_H / 2 - 4 : NODE_H / 2 + 1)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.text}
                  fontSize={isDummy ? 10 : 15}
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
                    fill="#7c3aed"
                    fontSize={8}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    (sentinel)
                  </text>
                )}

                {/* Position label underneath */}
                {!isDummy && (
                  <text
                    x={x + NODE_W / 2}
                    y={y + NODE_H + 14}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize={9}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    [{idx}]
                  </text>
                )}

                {/* Arrow to next node */}
                {idx < nodeCount - 1 && (
                  <g className="ll-arrow">
                    {isBypassPhase && idx === state.slowIndex ? (
                      /* Severed / faded link from slow to target */
                      <line
                        x1={x + NODE_W}
                        y1={y + NODE_H / 2}
                        x2={x + NODE_W + ARROW_W - 6}
                        y2={y + NODE_H / 2}
                        stroke="#334155"
                        strokeWidth={1}
                        strokeDasharray="4 3"
                        opacity={0.3}
                      />
                    ) : isBypassPhase && idx === state.targetIndex ? (
                      /* Severed / faded link from target to target.next */
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
                          stroke={
                            isTarget ? '#ef444480' : '#475569'
                          }
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

          {/* Active Bypass Arrow (rendered above nodes for perfect visibility) */}
          {bypassData && (
            <g className="bypass-group">
              <path
                d={bypassData.path}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={2}
                className="bypass-arrow"
                markerEnd="url(#arrow-cyan)"
              />
            </g>
          )}

          {/* NULL terminator */}
          <g>
            <text
              x={16 + nodeCount * UNIT + 8}
              y={TOP_PAD + NODE_H / 2 + 1}
              dominantBaseline="central"
              fill="#475569"
              fontSize={12}
              fontWeight={600}
              fontFamily="'JetBrains Mono', monospace"
            >
              NULL
            </text>
            {nodeCount > 0 && (
              isBypassPhase && state.targetIndex === nodeCount - 1 ? (
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

          {/* SVG defs for markers */}
          <defs>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX={9}
              refY={5}
              markerWidth={7}
              markerHeight={7}
              orient="auto"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#22d3ee" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-2.5 h-2.5 rounded-full inline-block border"
        style={{ backgroundColor: `${color}30`, borderColor: color }}
      />
      <span className="text-[11px] text-text-muted font-medium font-mono">{label}</span>
    </div>
  );
}
