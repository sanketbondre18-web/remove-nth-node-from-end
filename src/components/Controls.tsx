import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Rocket,
  Snail,
} from 'lucide-react';
import type { AnimationSpeed } from '../types';

interface ControlsProps {
  /** Whether steps have been generated */
  hasSteps: boolean;
  /** Current step index (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Whether auto-play is active */
  isPlaying: boolean;
  /** Current speed */
  speed: AnimationSpeed;
  onNext: () => void;
  onPrev: () => void;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (s: AnimationSpeed) => void;
}

const speedConfig: { key: AnimationSpeed; label: string; Icon: typeof Snail }[] = [
  { key: 'slow', label: '0.5×', Icon: Snail },
  { key: 'normal', label: '1×', Icon: Zap },
  { key: 'fast', label: '2×', Icon: Rocket },
];

export default function Controls({
  hasSteps,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onNext,
  onPrev,
  onPlayPause,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  const atStart = currentStep <= 0;
  const atEnd = currentStep >= totalSteps - 1;

  return (
    <div className="bg-bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 animate-fade-in">
      {/* Step buttons */}
      <div className="flex items-center gap-1.5">
        <ControlBtn
          id="btn-prev"
          onClick={onPrev}
          disabled={!hasSteps || atStart || isPlaying}
          title="Previous step"
        >
          <SkipBack size={15} />
        </ControlBtn>

        <ControlBtn
          id="btn-play-pause"
          onClick={onPlayPause}
          disabled={!hasSteps || atEnd}
          title={isPlaying ? 'Pause' : 'Play'}
          accent={isPlaying}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </ControlBtn>

        <ControlBtn
          id="btn-next"
          onClick={onNext}
          disabled={!hasSteps || atEnd || isPlaying}
          title="Next step"
        >
          <SkipForward size={15} />
        </ControlBtn>

        <ControlBtn
          id="btn-reset"
          onClick={onReset}
          disabled={!hasSteps}
          title="Reset"
        >
          <RotateCcw size={15} />
        </ControlBtn>
      </div>

      {/* Step indicator */}
      {hasSteps && (
        <div className="text-xs text-text-secondary font-mono tabular-nums mx-2">
          Step {currentStep + 1}/{totalSteps}
        </div>
      )}

      {/* Progress bar */}
      {hasSteps && (
        <div className="flex-1 min-w-[80px] max-w-[200px] h-1.5 bg-bg-primary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      )}

      {/* Speed selector */}
      <div className="flex items-center gap-1 ml-auto">
        {speedConfig.map(({ key, label, Icon }) => (
          <button
            key={key}
            id={`btn-speed-${key}`}
            onClick={() => onSpeedChange(key)}
            disabled={!hasSteps}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer
              ${
                speed === key
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated border border-transparent'
              }
              disabled:opacity-30 disabled:pointer-events-none
            `}
            title={`Speed: ${label}`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ControlBtn({
  id,
  children,
  onClick,
  disabled,
  title,
  accent,
}: {
  id: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  title: string;
  accent?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer
        ${
          accent
            ? 'bg-accent/15 border-accent/30 text-accent hover:bg-accent/25'
            : 'bg-bg-elevated border-border text-text-secondary hover:text-text-primary hover:border-text-muted'
        }
        disabled:opacity-30 disabled:pointer-events-none
        active:scale-95
      `}
    >
      {children}
    </button>
  );
}
