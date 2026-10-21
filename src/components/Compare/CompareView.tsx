import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ListOrdered,
  Hash,
  Crosshair,
  AlertCircle,
  Sparkles,
  GitCompare,
} from 'lucide-react';
import type { AnimationSpeed, CompareStepState } from '../../types';
import { SPEED_MS } from '../../types';
import { validateInputs } from '../../algorithm';
import {
  generateTwoPassSteps,
  generateOnePassSteps,
} from '../../compareAlgorithms';
import CompareControls from './CompareControls';
import CompareVisualizerPanel from './CompareVisualizerPanel';
import ComplexityComparison from './ComplexityComparison';
import CodeComparison from './CodeComparison';

interface PresetCase {
  label: string;
  count: string;
  values: string;
  n: string;
  tag: string;
}

const PRESET_CASES: PresetCase[] = [
  {
    label: 'Standard Example',
    count: '5',
    values: '1 2 3 4 5',
    n: '2',
    tag: 'n = 2',
  },
  {
    label: 'Remove Tail',
    count: '5',
    values: '1 2 3 4 5',
    n: '1',
    tag: 'n = 1 (tail)',
  },
  {
    label: 'Remove Head',
    count: '5',
    values: '1 2 3 4 5',
    n: '5',
    tag: 'n = len (head)',
  },
  {
    label: 'Single Node',
    count: '1',
    values: '7',
    n: '1',
    tag: '[7], n = 1',
  },
  {
    label: 'Two Nodes (Tail)',
    count: '2',
    values: '1 2',
    n: '1',
    tag: '[1,2], n = 1',
  },
  {
    label: 'Two Nodes (Head)',
    count: '2',
    values: '1 2',
    n: '2',
    tag: '[1,2], n = 2',
  },
  {
    label: 'Duplicate Values',
    count: '4',
    values: '1 2 2 1',
    n: '2',
    tag: 'duplicates',
  },
];

export default function CompareView() {
  const [nodeCount, setNodeCount] = useState('5');
  const [values, setValues] = useState('1 2 3 4 5');
  const [nValue, setNValue] = useState('2');
  const [error, setError] = useState<string | null>(null);

  const [twoPassSteps, setTwoPassSteps] = useState<CompareStepState[]>(() =>
    generateTwoPassSteps([1, 2, 3, 4, 5], 2)
  );
  const [onePassSteps, setOnePassSteps] = useState<CompareStepState[]>(() =>
    generateOnePassSteps([1, 2, 3, 4, 5], 2)
  );
  const [twoPassStep, setTwoPassStep] = useState(0);
  const [onePassStep, setOnePassStep] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>('normal');

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Generate comparison steps for both algorithms
  const handleBuild = useCallback(() => {
    const res = validateInputs(nodeCount, values, nValue);
    if (res.error) {
      setError(res.error);
      return;
    }
    setError(null);

    const twoPass = generateTwoPassSteps(res.values!, res.n!);
    const onePass = generateOnePassSteps(res.values!, res.n!);

    setTwoPassSteps(twoPass);
    setOnePassSteps(onePass);
    setTwoPassStep(0);
    setOnePassStep(0);
    setIsPlaying(false);

    if (timerRef.current) clearTimeout(timerRef.current);
  }, [nodeCount, values, nValue]);

  // Apply a preset
  const applyPreset = (preset: PresetCase) => {
    if (isPlaying) return;
    setNodeCount(preset.count);
    setValues(preset.values);
    setNValue(preset.n);
    setError(null);

    const valArr = preset.values.split(/\s+/).map(Number);
    const n = Number(preset.n);
    const twoPass = generateTwoPassSteps(valArr, n);
    const onePass = generateOnePassSteps(valArr, n);

    setTwoPassSteps(twoPass);
    setOnePassSteps(onePass);
    setTwoPassStep(0);
    setOnePassStep(0);
    setIsPlaying(false);

    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Step navigation
  const goNext = useCallback(() => {
    setTwoPassStep((prev) => Math.min(prev + 1, twoPassSteps.length - 1));
    setOnePassStep((prev) => Math.min(prev + 1, onePassSteps.length - 1));
  }, [twoPassSteps.length, onePassSteps.length]);

  const goPrev = useCallback(() => {
    setTwoPassStep((prev) => Math.max(prev - 1, 0));
    setOnePassStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setTwoPassStep(0);
    setOnePassStep(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    const atEnd =
      twoPassStep >= twoPassSteps.length - 1 &&
      onePassStep >= onePassSteps.length - 1;
    if (atEnd) {
      setTwoPassStep(0);
      setOnePassStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [twoPassStep, twoPassSteps.length, onePassStep, onePassSteps.length]);

  // Synchronized continuous playback effect
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (
      twoPassStep >= twoPassSteps.length - 1 &&
      onePassStep >= onePassSteps.length - 1
    ) {
      const id = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(id);
    }

    timerRef.current = setTimeout(() => {
      const nextTwo = Math.min(twoPassStep + 1, twoPassSteps.length - 1);
      const nextOne = Math.min(onePassStep + 1, onePassSteps.length - 1);

      setTwoPassStep(nextTwo);
      setOnePassStep(nextOne);

      if (
        nextTwo >= twoPassSteps.length - 1 &&
        nextOne >= onePassSteps.length - 1
      ) {
        setIsPlaying(false);
      }
    }, SPEED_MS[speed]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isPlaying,
    twoPassStep,
    onePassStep,
    twoPassSteps.length,
    onePassSteps.length,
    speed,
  ]);


  const currentTwoPassState =
    twoPassSteps.length > 0 ? twoPassSteps[twoPassStep] : null;
  const currentOnePassState =
    onePassSteps.length > 0 ? onePassSteps[onePassStep] : null;

  return (
    <div className="space-y-6">
      {/* Configuration & Input Panel */}
      <div className="bg-bg-card border border-border rounded-xl p-5 shadow-lg animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <GitCompare size={18} className="text-accent" />
            <h2 className="text-sm font-bold text-text-primary">
              Compare Algorithms Configuration
            </h2>
          </div>
          <span className="text-[11px] text-text-muted bg-bg-primary px-2.5 py-1 rounded-full border border-border">
            Shared List &amp; Target N
          </span>
        </div>

        {/* Input Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Node Count */}
          <div>
            <label
              htmlFor="cmp-node-count"
              className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
            >
              <Hash size={12} />
              Number of Nodes
            </label>
            <input
              id="cmp-node-count"
              type="text"
              inputMode="numeric"
              value={nodeCount}
              onChange={(e) => {
                setNodeCount(e.target.value);
                setError(null);
              }}
              disabled={isPlaying}
              placeholder="e.g. 5"
              className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
            />
          </div>

          {/* Node Values */}
          <div>
            <label
              htmlFor="cmp-values"
              className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
            >
              <ListOrdered size={12} />
              Node Values
            </label>
            <input
              id="cmp-values"
              type="text"
              value={values}
              onChange={(e) => {
                setValues(e.target.value);
                setError(null);
              }}
              disabled={isPlaying}
              placeholder="e.g. 1 2 3 4 5"
              className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
            />
            <p className="text-[10px] text-text-muted mt-1">Space or comma separated</p>
          </div>

          {/* N */}
          <div>
            <label
              htmlFor="cmp-n"
              className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
            >
              <Crosshair size={12} />
              N (from end)
            </label>
            <input
              id="cmp-n"
              type="text"
              inputMode="numeric"
              value={nValue}
              onChange={(e) => {
                setNValue(e.target.value);
                setError(null);
              }}
              disabled={isPlaying}
              placeholder="e.g. 2"
              className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
            />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-lg px-3 py-2.5 mb-4 animate-fade-in">
            <AlertCircle size={15} className="text-error shrink-0 mt-0.5" />
            <p className="text-xs text-error leading-relaxed">{error}</p>
          </div>
        )}

        {/* Action Button & Test Case Quick Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/40">
          <button
            id="btn-cmp-generate"
            onClick={handleBuild}
            disabled={isPlaying}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-accent to-accent-bright text-white text-sm font-semibold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
          >
            Start Comparison
          </button>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-text-muted flex items-center gap-1 mr-1">
              <Sparkles size={11} className="text-accent" />
              Test Presets:
            </span>
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset)}
                disabled={isPlaying}
                title={`${preset.label} (${preset.values}, n=${preset.n})`}
                className="text-[10.5px] px-2 py-1 rounded bg-bg-primary border border-border/70 hover:border-accent/40 hover:text-accent text-text-secondary transition-colors cursor-pointer font-mono disabled:opacity-40"
              >
                {preset.tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shared Synchronized Controls */}
      <CompareControls
        hasSteps={twoPassSteps.length > 0 && onePassSteps.length > 0}
        isPlaying={isPlaying}
        speed={speed}
        twoPassStep={twoPassStep}
        twoPassTotal={twoPassSteps.length}
        onePassStep={onePassStep}
        onePassTotal={onePassSteps.length}
        onPlayPause={togglePlay}
        onNext={goNext}
        onPrev={goPrev}
        onReset={handleReset}
        onSpeedChange={setSpeed}
      />

      {/* Side-by-Side Synchronized Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Panel: Two-Pass Approach */}
        <CompareVisualizerPanel
          title="Algorithm A: Two-Pass Approach"
          subtitle="Length-Counting Traversal + Predecessor Traversal"
          badgeLabel="Two-Pass"
          badgeColorClass="bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
          state={currentTwoPassState}
          accentColor="#38bdf8"
          emptyMessage="Click 'Start Comparison' above to begin Two-Pass simulation."
        />

        {/* Right Panel: One-Pass Approach */}
        <CompareVisualizerPanel
          title="Algorithm B: One-Pass Approach"
          subtitle="Dummy Sentinel Node + Fixed-Gap Two Pointers"
          badgeLabel="One-Pass"
          badgeColorClass="bg-pink-500/15 text-pink-400 border-pink-500/30"
          state={currentOnePassState}
          accentColor="#f472b6"
          emptyMessage="Click 'Start Comparison' above to begin One-Pass simulation."
        />
      </div>

      {/* Complexity Comparison Table & Metrics */}
      <ComplexityComparison
        twoPassState={currentTwoPassState}
        onePassState={currentOnePassState}
      />

      {/* C++ Code Comparison & Line Highlighting */}
      <CodeComparison
        twoPassState={currentTwoPassState}
        onePassState={currentOnePassState}
      />
    </div>
  );
}
