// Pure algorithm logic — no UI, no React.
// Generates all steps of the two-pointer "Remove Nth From End" algorithm.

import type { AlgorithmState, ListNode } from './types';

/**
 * Build the full list of algorithm steps for visualization.
 *
 * @param values  The node values entered by the user (e.g. [1, 2, 3, 4, 5])
 * @param n       The 1-indexed position from the end to remove
 * @returns       An array of AlgorithmState snapshots, one per visual step
 */
export function generateSteps(values: number[], n: number): AlgorithmState[] {
  const steps: AlgorithmState[] = [];
  const size = values.length;

  // Build node array: index 0 is the dummy node, 1..size are the user values.
  const buildNodes = (): ListNode[] => [
    { id: -1, value: -1 }, // dummy node
    ...values.map((v, i) => ({ id: i, value: v })),
  ];

  let stepNum = 0;
  const push = (
    partial: Omit<AlgorithmState, 'stepNumber' | 'totalSteps'>
  ) => {
    stepNum++;
    steps.push({ ...partial, stepNumber: stepNum, totalSteps: 0 }); // totalSteps patched at the end
  };

  // ─── Step 1: Create dummy node ──────────────────────────────
  push({
    nodes: buildNodes(),
    slowIndex: -1,
    fastIndex: -1,
    targetIndex: -1,
    removed: false,
    phase: 'Setup',
    description: 'Create a dummy node and connect it before the head.',
    detail:
      'We create a dummy (sentinel) node whose next pointer points to the head of the list. ' +
      'This simplifies edge cases — especially when we need to delete the head itself (N = list size). ' +
      'Without the dummy, we would need special-case code for head deletion.',
  });

  // ─── Step 2: Initialize slow and fast ───────────────────────
  push({
    nodes: buildNodes(),
    slowIndex: 0,
    fastIndex: 0,
    targetIndex: -1,
    removed: false,
    phase: 'Initialize pointers',
    description: 'Place both slow and fast pointers at the dummy node.',
    detail:
      'Both pointers start at the dummy node (position 0). ' +
      'The idea: we will advance fast by N steps first, creating a gap of N nodes between slow and fast. ' +
      'Then we move both together until fast reaches the end; at that point slow.next is the target.',
  });

  // ─── Steps 3..3+n-1: Advance fast by N ─────────────────────
  let fastIdx = 0;
  for (let i = 1; i <= n; i++) {
    fastIdx = i; // move fast one step forward (in the nodes array, 0 = dummy)
    push({
      nodes: buildNodes(),
      slowIndex: 0,
      fastIndex: fastIdx,
      targetIndex: -1,
      removed: false,
      phase: `Advance fast (${i}/${n})`,
      description: `Move fast one step forward → now at node ${fastIdx === 0 ? 'dummy' : fastIdx <= size ? String(values[fastIdx - 1]) : 'NULL'} (step ${i} of ${n}).`,
      detail:
        i < n
          ? `We need to move fast ${n} steps ahead of slow so there is a gap of exactly N = ${n} nodes. ${n - i} more step${n - i === 1 ? '' : 's'} to go.`
          : `Fast is now ${n} node${n === 1 ? '' : 's'} ahead of slow. The gap is set. Next we'll move both pointers together.`,
    });
  }

  // ─── Steps: Move slow and fast together ─────────────────────
  let slowIdx = 0;
  // We move until fast is at the last real node (index = size).
  while (fastIdx < size) {
    slowIdx++;
    fastIdx++;
    push({
      nodes: buildNodes(),
      slowIndex: slowIdx,
      fastIndex: fastIdx,
      targetIndex: -1,
      removed: false,
      phase: 'Move both pointers',
      description: `Move slow → node ${slowIdx === 0 ? 'dummy' : values[slowIdx - 1]}, fast → node ${fastIdx <= size ? (fastIdx === 0 ? 'dummy' : values[fastIdx - 1]) : 'past end'}.`,
      detail:
        fastIdx < size
          ? 'fast hasn\'t reached the last node yet, so we keep moving both pointers forward one step at a time.'
          : 'fast has reached the last node. slow is now positioned just before the node we need to remove.',
    });
  }

  // ─── Step: Identify target ──────────────────────────────────
  const targetIdx = slowIdx + 1; // slow.next is the target
  push({
    nodes: buildNodes(),
    slowIndex: slowIdx,
    fastIndex: fastIdx,
    targetIndex: targetIdx,
    removed: false,
    phase: 'Identify target',
    description: `Target found: node ${values[targetIdx - 1]} (position ${size - n + 1} from start, ${n} from end).`,
    detail:
      `slow.next is node ${values[targetIdx - 1]}. This is the ${n}${ordinalSuffix(n)} node from the end. ` +
      'We will now bypass this node by pointing slow.next to slow.next.next.',
  });

  // ─── Step: Bypass the target ────────────────────────────────
  push({
    nodes: buildNodes(),
    slowIndex: slowIdx,
    fastIndex: fastIdx,
    targetIndex: targetIdx,
    removed: false,
    phase: 'Bypass pointer',
    description: `Set slow.next = slow.next.next — bypassing node ${values[targetIdx - 1]}.`,
    detail:
      'The pointer from slow now skips over the target node and points to the node after it (or NULL if the target was the last node). ' +
      'The target node is effectively unlinked from the list.',
  });

  // ─── Step: Show final list ──────────────────────────────────
  const finalNodes = buildNodes().filter((_, i) => i !== targetIdx);
  push({
    nodes: finalNodes,
    slowIndex: -1,
    fastIndex: -1,
    targetIndex: -1,
    removed: true,
    phase: 'Done',
    description: `Node ${values[targetIdx - 1]} removed. Final list: ${finalNodes.slice(1).map((nd) => nd.value).join(' → ')} → NULL`,
    detail:
      'The algorithm is complete. The dummy node is discarded and we return dummy.next as the new head. ' +
      `Time complexity: O(n) — we traverse the list at most twice. Space complexity: O(1) — only two extra pointers and one dummy node.`,
  });

  // Patch totalSteps
  const total = steps.length;
  for (const s of steps) s.totalSteps = total;

  return steps;
}

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Validate user inputs. Returns an error message or null if valid.
 */
export function validateInputs(
  nodeCountStr: string,
  valuesStr: string,
  nStr: string
): { error: string | null; count?: number; values?: number[]; n?: number } {
  // Node count
  const countRaw = nodeCountStr.trim();
  if (countRaw === '') return { error: 'Please enter the number of nodes.' };
  const count = Number(countRaw);
  if (!Number.isInteger(count) || count < 1)
    return { error: 'Number of nodes must be a positive integer (≥ 1).' };
  if (count > 20)
    return { error: 'Please use 20 or fewer nodes for visualization clarity.' };

  // Values
  const valTrimmed = valuesStr.trim();
  if (valTrimmed === '') return { error: 'Please enter the node values.' };
  const parts = valTrimmed.split(/[\s,]+/).filter(Boolean);
  if (parts.length !== count)
    return {
      error: `Expected ${count} value${count === 1 ? '' : 's'}, but got ${parts.length}.`,
    };
  const values: number[] = [];
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isFinite(v))
      return { error: `"${p}" is not a valid number.` };
    values.push(v);
  }

  // N
  const nRaw = nStr.trim();
  if (nRaw === '') return { error: 'Please enter N (position from end to remove).' };
  const n = Number(nRaw);
  if (!Number.isInteger(n))
    return { error: 'N must be an integer.' };

  // N range — return error but keep count & values so we don't reset them
  if (n < 1)
    return { error: `N must be ≥ 1. You entered ${n}.`, count, values };
  if (n > count)
    return {
      error: `N = ${n} is larger than the list size (${count}). Please enter a value between 1 and ${count}.`,
      count,
      values,
    };

  return { error: null, count, values, n };
}
