// Types for the linked list algorithm visualization

export interface ListNode {
  id: number;
  value: number;
}

export type PointerName = 'slow' | 'fast' | 'dummy';

export interface AlgorithmState {
  /** All nodes including the dummy node (index 0 = dummy) */
  nodes: ListNode[];
  /** Index of slow pointer in the nodes array */
  slowIndex: number;
  /** Index of fast pointer in the nodes array */
  fastIndex: number;
  /** Index of the node being deleted, or -1 */
  targetIndex: number;
  /** Whether the target node has been removed */
  removed: boolean;
  /** Step description for the explanation panel */
  description: string;
  /** Detailed explanation for beginners */
  detail: string;
  /** Phase label */
  phase: string;
  /** Step number (1-indexed) */
  stepNumber: number;
  /** Total step count */
  totalSteps: number;
}

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export const SPEED_MS: Record<AnimationSpeed, number> = {
  slow: 1500,
  normal: 900,
  fast: 400,
};

export interface PointerBadgeInfo {
  name: string;
  color: string;
}

export interface CompareStats {
  traversals: string;
  pointerMoves: number;
  nodeVisits: number;
  currentLength?: number;
}

export interface CompareStepState {
  nodes: ListNode[];
  hasDummy: boolean;
  pointerMap: Record<number, PointerBadgeInfo[]>;
  targetIndex: number;
  removed: boolean;
  isBypass: boolean;
  bypassFromIndex?: number;
  bypassToIndex?: number;
  phase: string;
  description: string;
  detail: string;
  stepNumber: number;
  totalSteps: number;
  highlightLine: number;
  codeExplanation: string;
  stats: CompareStats;
}

