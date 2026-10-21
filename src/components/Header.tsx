import { GitBranch } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative border-b border-border/50 bg-bg-secondary/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left: branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-bright flex items-center justify-center shadow-lg shadow-accent/20">
            <GitBranch size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-text-primary leading-tight">
              Remove N<sup>th</sup> Node From End
            </h1>
            <p className="text-xs text-text-muted hidden sm:block">
              Linked List · Two-Pointer Technique
            </p>
          </div>
        </div>

        {/* Right: difficulty badge */}
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-warning/15 text-warning border border-warning/20">
          Medium
        </span>
      </div>
    </header>
  );
}
