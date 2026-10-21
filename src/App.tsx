import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import Visualizer from './components/Visualizer';
import Controls from './components/Controls';
import ExplanationPanel from './components/ExplanationPanel';
import LearningSection from './components/LearningSection';
import { generateSteps } from './algorithm';
import type { AlgorithmState, AnimationSpeed } from './types';
import { SPEED_MS } from './types';

export default function App() {
  const [steps, setSteps] = useState<AlgorithmState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<AnimationSpeed>('normal');
  const [isVisualizerActive, setIsVisualizerActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentState = steps.length > 0 ? steps[currentStep] : null;

  // ── Generate steps from user input ──────────────────────
  const handleGenerate = useCallback((values: number[], n: number) => {
    const newSteps = generateSteps(values, n);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsVisualizerActive(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // ── Navigation ──────────────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setIsVisualizerActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // ── Auto-play ───────────────────────────────────────────
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          setIsPlaying(false);
        }
        return Math.min(next, steps.length - 1);
      });
    }, SPEED_MS[speed]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Input */}
        <InputPanel
          onGenerate={handleGenerate}
          disabled={isPlaying}
        />

        {/* Visualizer + controls + explanation — only shown after generation */}
        {isVisualizerActive && (
          <div className="space-y-4 animate-slide-up">
            <Visualizer state={currentState} />

            <Controls
              hasSteps={steps.length > 0}
              currentStep={currentStep}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onNext={goNext}
              onPrev={goPrev}
              onPlayPause={togglePlay}
              onReset={handleReset}
              onSpeedChange={setSpeed}
            />

            <ExplanationPanel state={currentState} />
          </div>
        )}

        {/* Learning section — always visible */}
        <div className="pt-4 border-t border-border/30">
          <LearningSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-bg-secondary/40 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            DSA Interactive Visualizer — Remove N<sup>th</sup> Node From End
          </p>
          <p className="text-xs text-text-muted">
            Two-Pointer Technique · O(n) Time · O(1) Space
          </p>
        </div>
      </footer>
    </div>
  );
}
