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
import type { AnimationSpeed } from '../../types';

interface CompareControlsProps {
  hasSteps: boolean;
  isPlaying: boolean;
  speed: AnimationSpeed;
  twoPassStep: number;
  twoPassTotal: number;
  onePassStep: number;
  onePassTotal: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (s: AnimationSpeed) => void;
}

const speedConfig: { key: AnimationSpeed; label: string; Icon: typeof Snail }[] = [
  { key: 'slow', label: '0.5×', Icon: Snail },
  { key: 'normal', label: '1×', Icon: Zap },
  { key: 'fast', label: '2×', Icon: Rocket },
];

export default function CompareControls({
  hasSteps,
  isPlaying,
  speed,
  twoPassStep,
  twoPassTotal,
  onePassStep,
  onePassTotal,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
}: CompareControlsProps) {
  const atStart = twoPassStep <= 0 && onePassStep <= 0;
  const atEnd =
    twoPassStep >= twoPassTotal - 1 && onePassStep >= onePassTotal - 1;

  return (
    <div className="bg-bg-card border border-border rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fade-in">
      {/* Playback action buttons */}
      <div className="flex items-center gap-1.5">
        <ControlBtn
          id="btn-cmp-prev"
          onClick={onPrev}
          disabled={!hasSteps || atStart || isPlaying}
          title="Previous Step"
        >
          <SkipBack size={15} />
        </ControlBtn>

        <ControlBtn
          id="btn-cmp-play-pause"
          onClick={onPlayPause}
          disabled={!hasSteps || atEnd}
          title={isPlaying ? 'Pause' : 'Play Comparison'}
          accent={isPlaying}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
        </ControlBtn>

        <ControlBtn
          id="btn-cmp-next"
          onClick={onNext}
          disabled={!hasSteps || atEnd || isPlaying}
          title="Next Step"
        >
          <SkipForward size={15} />
        </ControlBtn>

        <ControlBtn
          id="btn-cmp-reset"
          onClick={onReset}
          disabled={!hasSteps}
          title="Restart Comparison"
        >
          <RotateCcw size={15} />
        </ControlBtn>
      </div>

      {/* Synchronized Step Counters */}
      {hasSteps && (
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-bg-primary/80 border border-border px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span className="text-text-muted">Two-Pass:</span>
            <span className="text-text-primary font-bold">
              {twoPassStep + 1}/{twoPassTotal}
            </span>
            {twoPassStep >= twoPassTotal - 1 && (
              <span className="text-emerald-400 text-[10px]">✓</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-bg-primary/80 border border-border px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
            <span className="text-text-muted">One-Pass:</span>
            <span className="text-text-primary font-bold">
              {onePassStep + 1}/{onePassTotal}
            </span>
            {onePassStep >= onePassTotal - 1 && (
              <span className="text-emerald-400 text-[10px]">✓</span>
            )}
          </div>
        </div>
      )}

      {/* Speed Selector */}
      <div className="flex items-center gap-1">
        {speedConfig.map(({ key, label, Icon }) => (
          <button
            key={key}
            id={`btn-cmp-speed-${key}`}
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
