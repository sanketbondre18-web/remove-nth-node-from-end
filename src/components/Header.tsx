import { GitBranch, Play, GitCompare } from 'lucide-react';

interface HeaderProps {
  activeTab: 'visualizer' | 'compare';
  onTabChange: (tab: 'visualizer' | 'compare') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="relative border-b border-border/50 bg-bg-secondary/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: branding */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-bright flex items-center justify-center shadow-lg shadow-accent/20">
              <GitBranch size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-text-primary leading-tight">
                Remove N<sup>th</sup> Node From End
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                Linked List Algorithm Studio · Two-Pointer vs Two-Pass
              </p>
            </div>
          </div>

          <span className="md:hidden text-xs font-semibold px-2.5 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/20">
            Medium
          </span>
        </div>

        {/* Center: Navigation Tabs */}
        <nav
          className="flex items-center gap-1 bg-bg-primary/90 p-1 rounded-xl border border-border shadow-inner w-full md:w-auto justify-center"
          aria-label="Navigation Tabs"
        >
          <button
            id="tab-visualizer"
            onClick={() => onTabChange('visualizer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'visualizer'
                ? 'bg-accent/20 text-accent border border-accent/30 shadow-sm'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/40'
            }`}
          >
            <Play size={13} />
            <span>Visualizer</span>
          </button>

          <button
            id="tab-compare"
            onClick={() => onTabChange('compare')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-gradient-to-r from-accent/25 to-pink-500/20 text-accent-bright border border-accent/30 shadow-sm'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/40'
            }`}
          >
            <GitCompare size={13} />
            <span>Compare Algorithms</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/25 text-accent-bright font-bold uppercase tracking-wider">
              NEW
            </span>
          </button>
        </nav>

        {/* Right: difficulty badge (hidden on mobile, shown in branding above) */}
        <span className="hidden md:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-warning/15 text-warning border border-warning/20">
          Medium
        </span>
      </div>
    </header>
  );
}
