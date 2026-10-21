import type { CompareStepState, ListNode, PointerBadgeInfo } from './types';

export const TWO_PASS_CPP_CODE = [
  'ListNode* removeNthFromEnd(ListNode* head, int n) {',
  '    // Pass 1: Calculate the length of the list',
  '    int length = 0;',
  '    ListNode* curr = head;',
  '    while (curr != nullptr) {',
  '        length++;',
  '        curr = curr->next;',
  '    }',
  '',
  '    // If removing the head node (length == n)',
  '    if (length == n) {',
  '        ListNode* toDelete = head;',
  '        head = head->next;',
  '        delete toDelete;',
  '        return head;',
  '    }',
  '',
  '    // Pass 2: Traverse to node before target (length - n - 1 steps)',
  '    curr = head;',
  '    for (int i = 1; i < length - n; i++) {',
  '        curr = curr->next;',
  '    }',
  '',
  '    // Bypass and delete target node',
  '    ListNode* toDelete = curr->next;',
  '    curr->next = curr->next->next;',
  '    delete toDelete;',
  '    return head;',
  '}',
];

export const ONE_PASS_CPP_CODE = [
  'ListNode* removeNthFromEnd(ListNode* head, int n) {',
  '    // Create dummy sentinel node pointing to head',
  '    ListNode* dummy = new ListNode(0);',
  '    dummy->next = head;',
  '    ListNode* slow = dummy;',
  '    ListNode* fast = dummy;',
  '',
  '    // Advance fast pointer n steps ahead',
  '    for (int i = 0; i < n; i++) {',
  '        fast = fast->next;',
  '    }',
  '',
  '    // Move both pointers until fast reaches last node',
  '    while (fast->next != nullptr) {',
  '        slow = slow->next;',
  '        fast = fast->next;',
  '    }',
  '',
  '    // Bypass and delete target node (slow->next)',
  '    ListNode* toDelete = slow->next;',
  '    slow->next = slow->next->next;',
  '    delete toDelete;',
  '',
  '    ListNode* newHead = dummy->next;',
  '    delete dummy;',
  '    return newHead;',
  '}',
];

/**
 * Generate all execution steps for Algorithm A: Two-Pass Approach.
 */
export function generateTwoPassSteps(values: number[], n: number): CompareStepState[] {
  const steps: CompareStepState[] = [];
  const size = values.length;

  const buildNodes = (): ListNode[] =>
    values.map((v, i) => ({ id: i, value: v }));

  let stepNum = 0;
  const push = (partial: Omit<CompareStepState, 'stepNumber' | 'totalSteps'>) => {
    stepNum++;
    steps.push({ ...partial, stepNumber: stepNum, totalSteps: 0 });
  };

  // Step 1: Initialize Pass 1
  push({
    nodes: buildNodes(),
    hasDummy: false,
    pointerMap: {
      0: [
        { name: 'head', color: '#a78bfa' },
        { name: 'curr', color: '#38bdf8' },
      ],
    },
    targetIndex: -1,
    removed: false,
    isBypass: false,
    phase: 'Pass 1: Start',
    description: `Start Pass 1: Place curr at head (node ${values[0]}) and initialize length = 0.`,
    detail:
      'The two-pass algorithm first determines the total length of the list. We start a pointer `curr` at the head node and will increment a length counter at each step.',
    highlightLine: 3,
    codeExplanation: 'int length = 0; ListNode* curr = head; — Initialize length counter and place curr pointer at head.',
    stats: {
      traversals: 'Pass 1 of 2 (Counting)',
      pointerMoves: 0,
      nodeVisits: 1,
      currentLength: 0,
    },
  });

  // Steps for Pass 1 traversal
  for (let i = 0; i < size; i++) {
    const pMap: Record<number, PointerBadgeInfo[]> = {
      0: [{ name: 'head', color: '#a78bfa' }],
    };
    if (i === 0) {
      pMap[0].push({ name: 'curr', color: '#38bdf8' });
    } else {
      pMap[i] = [{ name: 'curr', color: '#38bdf8' }];
    }

    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: pMap,
      targetIndex: -1,
      removed: false,
      isBypass: false,
      phase: `Pass 1: Count (${i + 1}/${size})`,
      description: `Traversing node ${values[i]}: length incremented to ${i + 1}.`,
      detail: `curr is at node ${values[i]} (index ${i}). Increment length counter to ${i + 1} and move curr forward via curr = curr->next.`,
      highlightLine: 6,
      codeExplanation: `length++; curr = curr->next; — Increment length (${i + 1}) and advance curr pointer.`,
      stats: {
        traversals: 'Pass 1 of 2 (Counting)',
        pointerMoves: i,
        nodeVisits: i + 1,
        currentLength: i + 1,
      },
    });
  }

  // Pass 1 End: curr reached NULL
  push({
    nodes: buildNodes(),
    hasDummy: false,
    pointerMap: {
      0: [{ name: 'head', color: '#a78bfa' }],
    },
    targetIndex: -1,
    removed: false,
    isBypass: false,
    phase: 'Pass 1: Complete',
    description: `curr reached NULL. Total list length calculated as ${size}.`,
    detail: `Pass 1 has finished counting all nodes. We now know total length = ${size}. Next we compute the target position: (length - n) = ${size} - ${n} = ${size - n}.`,
    highlightLine: 5,
    codeExplanation: 'while (curr != nullptr) — Loop terminates as curr reaches NULL. Length is now known.',
    stats: {
      traversals: 'Pass 1 Complete',
      pointerMoves: size,
      nodeVisits: size,
      currentLength: size,
    },
  });

  // Target calculation & deletion
  if (size === n) {
    // Edge case: Remove head node
    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: {
        0: [
          { name: 'head', color: '#a78bfa' },
          { name: 'target', color: '#ef4444' },
        ],
      },
      targetIndex: 0,
      removed: false,
      isBypass: false,
      phase: 'Head Deletion Check',
      description: `Since length (${size}) == n (${n}), the target node to delete is the head!`,
      detail:
        'When removing the Nth node from the end and N equals the total length, the target is the first node (head). In the two-pass approach without a dummy node, this requires an explicit branch.',
      highlightLine: 11,
      codeExplanation: `if (length == n) — Special case triggered: removing the head node (index 0, value ${values[0]}).`,
      stats: {
        traversals: 'Pass 2: Head deletion branch',
        pointerMoves: size,
        nodeVisits: size,
        currentLength: size,
      },
    });

    // Update head pointer
    const headNextMap: Record<number, PointerBadgeInfo[]> = {
      0: [{ name: 'target', color: '#ef4444' }],
    };
    if (size > 1) {
      headNextMap[1] = [{ name: 'head', color: '#a78bfa' }];
    }

    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: headNextMap,
      targetIndex: 0,
      removed: false,
      isBypass: false,
      phase: 'Update Head Pointer',
      description: `Set head = head->next (pointing to ${size > 1 ? `node ${values[1]}` : 'NULL'}).`,
      detail: `The head pointer is updated to bypass the original head. The old head node (${values[0]}) is now unlinked and safe to delete.`,
      highlightLine: 13,
      codeExplanation: 'head = head->next; — Advance head pointer to the second node (or nullptr if list had 1 node).',
      stats: {
        traversals: 'Pass 2 Complete',
        pointerMoves: size + 1,
        nodeVisits: size,
        currentLength: size,
      },
    });

    // Delete old head node
    const finalNodes = buildNodes().slice(1);
    const finalMap: Record<number, PointerBadgeInfo[]> = {};
    if (finalNodes.length > 0) {
      finalMap[0] = [{ name: 'head', color: '#a78bfa' }];
    }

    push({
      nodes: finalNodes,
      hasDummy: false,
      pointerMap: finalMap,
      targetIndex: -1,
      removed: true,
      isBypass: false,
      phase: 'Completed',
      description: `Old head (${values[0]}) deleted. Final list: ${finalNodes.length > 0 ? finalNodes.map((nd) => nd.value).join(' → ') : 'empty'} → NULL`,
      detail:
        'Memory for the removed head node is deallocated with `delete toDelete;`. The updated head pointer is returned.',
      highlightLine: 14,
      codeExplanation: 'delete toDelete; return head; — Deallocate old head node and return new head.',
      stats: {
        traversals: 'Completed (2 Passes)',
        pointerMoves: size + 1,
        nodeVisits: size,
        currentLength: size,
      },
    });
  } else {
    // Non-head deletion: target is at index size - n
    const targetIdx = size - n;
    const predIdx = targetIdx - 1;

    // Step: Calculate target index
    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: {
        0: [{ name: 'head', color: '#a78bfa' }],
        [targetIdx]: [{ name: 'target', color: '#ef4444' }],
      },
      targetIndex: targetIdx,
      removed: false,
      isBypass: false,
      phase: 'Calculate Target',
      description: `Target is at position (length - n) = ${size} - ${n} = index ${targetIdx} (node ${values[targetIdx]}).`,
      detail: `To delete node ${values[targetIdx]}, we must stop at its predecessor node ${values[predIdx]} (index ${predIdx}) and update its next pointer.`,
      highlightLine: 18,
      codeExplanation: `Target index: length - n = ${targetIdx}. Predecessor is at index ${predIdx}.`,
      stats: {
        traversals: 'Pass 2: Setup',
        pointerMoves: size,
        nodeVisits: size,
        currentLength: size,
      },
    });

    // Step: Pass 2 Reset curr to head
    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: {
        0: [
          { name: 'head', color: '#a78bfa' },
          { name: 'curr', color: '#38bdf8' },
        ],
        [targetIdx]: [{ name: 'target', color: '#ef4444' }],
      },
      targetIndex: targetIdx,
      removed: false,
      isBypass: false,
      phase: 'Pass 2: Reset curr',
      description: `Start Pass 2: Reset curr to head (node ${values[0]}). Advance ${predIdx} step${predIdx === 1 ? '' : 's'} to predecessor.`,
      detail:
        'Pass 2 traverses from head up to the node immediately before the target, so we can rewire pointers.',
      highlightLine: 19,
      codeExplanation: 'curr = head; — Reset curr pointer to head node to begin Pass 2.',
      stats: {
        traversals: 'Pass 2 of 2 (Finding Predecessor)',
        pointerMoves: size + 1,
        nodeVisits: size + 1,
        currentLength: size,
      },
    });

    // Advance curr in Pass 2
    let pass2Moves = 0;
    for (let step = 1; step <= predIdx; step++) {
      pass2Moves++;
      const pMap: Record<number, PointerBadgeInfo[]> = {
        0: [{ name: 'head', color: '#a78bfa' }],
        [step]: [{ name: 'curr', color: '#38bdf8' }],
        [targetIdx]: [{ name: 'target', color: '#ef4444' }],
      };

      push({
        nodes: buildNodes(),
        hasDummy: false,
        pointerMap: pMap,
        targetIndex: targetIdx,
        removed: false,
        isBypass: false,
        phase: `Pass 2: Advance curr (${step}/${predIdx})`,
        description: `Move curr → node ${values[step]} (step ${step} of ${predIdx}).`,
        detail: `Advancing curr pointer to reach predecessor node at index ${predIdx}.`,
        highlightLine: 21,
        codeExplanation: `curr = curr->next; — Move curr one step forward towards predecessor node (step ${step} of ${predIdx}).`,
        stats: {
          traversals: 'Pass 2 of 2 (Finding Predecessor)',
          pointerMoves: size + 1 + pass2Moves,
          nodeVisits: size + 1 + pass2Moves,
          currentLength: size,
        },
      });
    }

    // Identify target from curr
    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: {
        0: [{ name: 'head', color: '#a78bfa' }],
        [predIdx]: [{ name: 'curr', color: '#38bdf8' }],
        [targetIdx]: [{ name: 'target', color: '#ef4444' }],
      },
      targetIndex: targetIdx,
      removed: false,
      isBypass: false,
      phase: 'Target Confirmed',
      description: `curr is at node ${values[predIdx]}. Target node to remove is curr->next (node ${values[targetIdx]}).`,
      detail:
        'curr has reached the predecessor node. We store `toDelete = curr->next` and prepare to unlink it.',
      highlightLine: 25,
      codeExplanation: `ListNode* toDelete = curr->next; — Identify target node ${values[targetIdx]} to be deleted.`,
      stats: {
        traversals: 'Pass 2 of 2',
        pointerMoves: size + 1 + pass2Moves,
        nodeVisits: size + 1 + pass2Moves,
        currentLength: size,
      },
    });

    // Bypass pointer
    push({
      nodes: buildNodes(),
      hasDummy: false,
      pointerMap: {
        0: [{ name: 'head', color: '#a78bfa' }],
        [predIdx]: [{ name: 'curr', color: '#38bdf8' }],
        [targetIdx]: [{ name: 'target', color: '#ef4444' }],
      },
      targetIndex: targetIdx,
      removed: false,
      isBypass: true,
      bypassFromIndex: predIdx,
      bypassToIndex: targetIdx + 1,
      phase: 'Bypass pointer',
      description: `Set curr->next = curr->next->next — bypassing target node ${values[targetIdx]}.`,
      detail: `The next pointer of node ${values[predIdx]} is redirected to skip node ${values[targetIdx]} and point directly to ${targetIdx + 1 < size ? `node ${values[targetIdx + 1]}` : 'NULL'}.`,
      highlightLine: 26,
      codeExplanation: 'curr->next = curr->next->next; — Rewire predecessor next pointer to skip the target node.',
      stats: {
        traversals: 'Pass 2 of 2',
        pointerMoves: size + 1 + pass2Moves,
        nodeVisits: size + 1 + pass2Moves,
        currentLength: size,
      },
    });

    // Final list
    const finalNodes = buildNodes().filter((_, i) => i !== targetIdx);
    push({
      nodes: finalNodes,
      hasDummy: false,
      pointerMap: {
        0: [{ name: 'head', color: '#a78bfa' }],
      },
      targetIndex: -1,
      removed: true,
      isBypass: false,
      phase: 'Completed',
      description: `Node ${values[targetIdx]} deleted. Final list: ${finalNodes.map((nd) => nd.value).join(' → ')} → NULL`,
      detail: `Deallocate memory with \`delete toDelete;\`. The original head is returned. Total traversals: 2 passes.`,
      highlightLine: 27,
      codeExplanation: 'delete toDelete; return head; — Free memory of target node and return list head.',
      stats: {
        traversals: 'Completed (2 Passes)',
        pointerMoves: size + 1 + pass2Moves,
        nodeVisits: size + 1 + pass2Moves,
        currentLength: size,
      },
    });
  }

  // Patch totalSteps
  const total = steps.length;
  for (const s of steps) s.totalSteps = total;

  return steps;
}

/**
 * Generate all execution steps for Algorithm B: One-Pass Approach.
 */
export function generateOnePassSteps(values: number[], n: number): CompareStepState[] {
  const steps: CompareStepState[] = [];
  const size = values.length;

  const buildNodes = (): ListNode[] => [
    { id: -1, value: -1 }, // dummy sentinel node
    ...values.map((v, i) => ({ id: i, value: v })),
  ];

  let stepNum = 0;
  const push = (partial: Omit<CompareStepState, 'stepNumber' | 'totalSteps'>) => {
    stepNum++;
    steps.push({ ...partial, stepNumber: stepNum, totalSteps: 0 });
  };

  // Step 1: Create dummy node
  push({
    nodes: buildNodes(),
    hasDummy: true,
    pointerMap: {
      0: [{ name: 'dummy', color: '#8b5cf6' }],
    },
    targetIndex: -1,
    removed: false,
    isBypass: false,
    phase: 'Setup Sentinel Node',
    description: 'Create dummy node (value 0) and link its next pointer to head.',
    detail:
      'A dummy sentinel node eliminates special-case branching when removing the head node. Both regular and head deletions use the exact same pointer bypass logic.',
    highlightLine: 3,
    codeExplanation: 'ListNode* dummy = new ListNode(0); dummy->next = head; — Allocate sentinel node and link to head.',
    stats: {
      traversals: 'Single Pass (Setup)',
      pointerMoves: 0,
      nodeVisits: 1,
    },
  });

  // Step 2: Initialize slow and fast
  push({
    nodes: buildNodes(),
    hasDummy: true,
    pointerMap: {
      0: [
        { name: 'dummy', color: '#8b5cf6' },
        { name: 'slow', color: '#22d3ee' },
        { name: 'fast', color: '#f472b6' },
      ],
    },
    targetIndex: -1,
    removed: false,
    isBypass: false,
    phase: 'Initialize Pointers',
    description: 'Place both slow and fast pointers at the dummy node.',
    detail:
      'Both pointers begin at the dummy node. We will advance fast by N steps first, establishing a fixed gap of N nodes between slow and fast.',
    highlightLine: 5,
    codeExplanation: 'ListNode* slow = dummy; ListNode* fast = dummy; — Place slow and fast pointers at dummy.',
    stats: {
      traversals: 'Single Pass (Pointers Initialized)',
      pointerMoves: 0,
      nodeVisits: 1,
    },
  });

  // Steps 3..3+n-1: Advance fast by N
  let fastIdx = 0;
  let pointerMoves = 0;
  for (let i = 1; i <= n; i++) {
    fastIdx = i;
    pointerMoves++;
    push({
      nodes: buildNodes(),
      hasDummy: true,
      pointerMap: {
        0: [
          { name: 'dummy', color: '#8b5cf6' },
          { name: 'slow', color: '#22d3ee' },
        ],
        [fastIdx]: [{ name: 'fast', color: '#f472b6' }],
      },
      targetIndex: -1,
      removed: false,
      isBypass: false,
      phase: `Advance fast (${i}/${n})`,
      description: `Move fast ${i} step${i > 1 ? 's' : ''} forward → node ${values[fastIdx - 1]}.`,
      detail:
        i < n
          ? `Advancing fast pointer to create the N=${n} node gap. ${n - i} more step${n - i === 1 ? '' : 's'} to go.`
          : `Fast is now ${n} node${n === 1 ? '' : 's'} ahead of slow. The fixed gap is established. Next, move both pointers together.`,
      highlightLine: 10,
      codeExplanation: `fast = fast->next; — Advance fast pointer one step forward (step ${i} of ${n}).`,
      stats: {
        traversals: 'Single Pass (Fast Leading)',
        pointerMoves,
        nodeVisits: fastIdx + 1,
      },
    });
  }

  // Move slow and fast together
  let slowIdx = 0;
  while (fastIdx < size) {
    slowIdx++;
    fastIdx++;
    pointerMoves += 2;

    const pMap: Record<number, PointerBadgeInfo[]> = {
      0: [{ name: 'dummy', color: '#8b5cf6' }],
      [slowIdx]: [{ name: 'slow', color: '#22d3ee' }],
      [fastIdx]: [{ name: 'fast', color: '#f472b6' }],
    };

    push({
      nodes: buildNodes(),
      hasDummy: true,
      pointerMap: pMap,
      targetIndex: -1,
      removed: false,
      isBypass: false,
      phase: 'Move Both Pointers',
      description: `Move slow → node ${slowIdx === 0 ? 'dummy' : values[slowIdx - 1]}, fast → node ${values[fastIdx - 1]}.`,
      detail:
        fastIdx < size
          ? "fast has not reached the final node yet. Maintaining the N-node gap, both pointers step forward."
          : 'fast has reached the last node of the list! slow is now positioned at the predecessor of the target node.',
      highlightLine: 15,
      codeExplanation: 'slow = slow->next; fast = fast->next; — Maintain the N-gap while advancing both towards the end.',
      stats: {
        traversals: 'Single Pass (Dual Traversal)',
        pointerMoves,
        nodeVisits: fastIdx + 1,
      },
    });
  }

  // Target identification
  const targetIdx = slowIdx + 1;
  const pMapTarget: Record<number, PointerBadgeInfo[]> = {
    0: [{ name: 'dummy', color: '#8b5cf6' }],
    [slowIdx]: [{ name: 'slow', color: '#22d3ee' }],
    [fastIdx]: [{ name: 'fast', color: '#f472b6' }],
    [targetIdx]: [{ name: 'target', color: '#ef4444' }],
  };

  push({
    nodes: buildNodes(),
    hasDummy: true,
    pointerMap: pMapTarget,
    targetIndex: targetIdx,
    removed: false,
    isBypass: false,
    phase: 'Identify Target',
    description: `Target located: slow->next is node ${values[targetIdx - 1]} (${n}${ordinalSuffix(n)} node from end).`,
    detail:
      'Because fast is at the final node and slow is N steps behind, slow->next is guaranteed to be the Nth node from the end.',
    highlightLine: 20,
    codeExplanation: `ListNode* toDelete = slow->next; — Identify target node ${values[targetIdx - 1]} for deletion.`,
    stats: {
      traversals: 'Single Pass',
      pointerMoves,
      nodeVisits: fastIdx + 1,
    },
  });

  // Bypass pointer
  push({
    nodes: buildNodes(),
    hasDummy: true,
    pointerMap: pMapTarget,
    targetIndex: targetIdx,
    removed: false,
    isBypass: true,
    bypassFromIndex: slowIdx,
    bypassToIndex: targetIdx + 1,
    phase: 'Bypass pointer',
    description: `Set slow->next = slow->next->next — bypassing node ${values[targetIdx - 1]}.`,
    detail:
      'The slow node points directly to slow->next->next, cutting the target node out of the chain cleanly.',
    highlightLine: 21,
    codeExplanation: 'slow->next = slow->next->next; — Unlink target node by rewiring slow pointer.',
    stats: {
      traversals: 'Single Pass',
      pointerMoves,
      nodeVisits: fastIdx + 1,
    },
  });

  // Final list
  const finalNodes = buildNodes().filter((_, i) => i !== targetIdx);
  push({
    nodes: finalNodes,
    hasDummy: true,
    pointerMap: {
      0: [{ name: 'dummy', color: '#8b5cf6' }],
    },
    targetIndex: -1,
    removed: true,
    isBypass: false,
    phase: 'Completed',
    description: `Node ${values[targetIdx - 1]} deleted. Final list: ${finalNodes.slice(1).map((nd) => nd.value).join(' → ')} → NULL`,
    detail:
      'The dummy node is discarded and dummy->next is returned as the new head. Deletion complete in a single pass!',
    highlightLine: 24,
    codeExplanation: 'ListNode* newHead = dummy->next; delete dummy; return newHead; — Extract new head and free dummy node.',
    stats: {
      traversals: 'Completed (1 Pass)',
      pointerMoves,
      nodeVisits: fastIdx + 1,
    },
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
