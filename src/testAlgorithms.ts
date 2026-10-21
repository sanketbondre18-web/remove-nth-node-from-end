import { validateInputs } from './algorithm';
import { generateTwoPassSteps, generateOnePassSteps } from './compareAlgorithms';

interface TestCase {
  name: string;
  values: number[];
  n: number;
  expectedOutput: number[];
}

const validCases: TestCase[] = [
  {
    name: '1. Standard case: [1, 2, 3, 4, 5], n = 2',
    values: [1, 2, 3, 4, 5],
    n: 2,
    expectedOutput: [1, 2, 3, 5],
  },
  {
    name: '2. Tail removal: [1, 2, 3, 4, 5], n = 1',
    values: [1, 2, 3, 4, 5],
    n: 1,
    expectedOutput: [1, 2, 3, 4],
  },
  {
    name: '3. Head removal: [1, 2, 3, 4, 5], n = 5',
    values: [1, 2, 3, 4, 5],
    n: 5,
    expectedOutput: [2, 3, 4, 5],
  },
  {
    name: '4. Single node: [7], n = 1',
    values: [7],
    n: 1,
    expectedOutput: [],
  },
  {
    name: '5. Two nodes, remove tail: [1, 2], n = 1',
    values: [1, 2],
    n: 1,
    expectedOutput: [1],
  },
  {
    name: '6. Two nodes, remove head: [1, 2], n = 2',
    values: [1, 2],
    n: 2,
    expectedOutput: [2],
  },
  {
    name: '7. Duplicate values: [1, 2, 2, 1], n = 2',
    values: [1, 2, 2, 1],
    n: 2,
    expectedOutput: [1, 2, 1],
  },
];

console.log('=== RUNNING TESTS ON COMPARE ALGORITHMS ===\n');

let allPassed = true;

for (const tc of validCases) {
  const tpSteps = generateTwoPassSteps(tc.values, tc.n);
  const opSteps = generateOnePassSteps(tc.values, tc.n);

  const tpFinal = tpSteps[tpSteps.length - 1];
  const opFinal = opSteps[opSteps.length - 1];

  const tpResult = tpFinal.nodes.map((nd) => nd.value);
  // opFinal has dummy node at index 0
  const opResult = opFinal.nodes.slice(1).map((nd) => nd.value);

  const tpMatch = JSON.stringify(tpResult) === JSON.stringify(tc.expectedOutput);
  const opMatch = JSON.stringify(opResult) === JSON.stringify(tc.expectedOutput);
  const algorithmsAgree = JSON.stringify(tpResult) === JSON.stringify(opResult);

  if (tpMatch && opMatch && algorithmsAgree) {
    console.log(`✓ PASS: ${tc.name}`);
    console.log(`  Two-Pass steps: ${tpSteps.length}, One-Pass steps: ${opSteps.length}`);
    console.log(`  Output: [${tpResult.join(', ')}]`);
  } else {
    allPassed = false;
    console.error(`✗ FAIL: ${tc.name}`);
    console.error(`  Expected: [${tc.expectedOutput.join(', ')}]`);
    console.error(`  Two-Pass: [${tpResult.join(', ')}] (match: ${tpMatch})`);
    console.error(`  One-Pass: [${opResult.join(', ')}] (match: ${opMatch})`);
  }
}

console.log('\n=== TESTING INVALID INPUTS ===\n');

const invalidCases = [
  { count: '5', vals: '1 2 3 4 5', n: '0', expectedErrMsg: 'N must be ≥ 1' },
  { count: '5', vals: '1 2 3 4 5', n: '6', expectedErrMsg: 'larger than the list size' },
  { count: '0', vals: '', n: '1', expectedErrMsg: 'positive integer' },
  { count: '3', vals: '1 2', n: '1', expectedErrMsg: 'Expected 3 values' },
];

for (const inv of invalidCases) {
  const res = validateInputs(inv.count, inv.vals, inv.n);
  if (res.error && res.error.includes(inv.expectedErrMsg)) {
    console.log(`✓ PASS: Invalid input caught: count=${inv.count}, n=${inv.n} -> "${res.error}"`);
  } else {
    allPassed = false;
    console.error(`✗ FAIL: Invalid input not caught properly for count=${inv.count}, n=${inv.n}`);
  }
}

if (allPassed) {
  console.log('\n🎉 ALL 11 TEST CASES PASSED SUCCESSFULLY!');
} else {
  console.error('\n❌ SOME TEST CASES FAILED');
  throw new Error('Test suite failed');
}
