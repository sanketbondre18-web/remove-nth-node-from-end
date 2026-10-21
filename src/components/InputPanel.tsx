import { AlertCircle, ListOrdered, Hash, Crosshair } from 'lucide-react';
import { useState, useCallback } from 'react';
import { validateInputs } from '../algorithm';

interface InputPanelProps {
  onGenerate: (values: number[], n: number) => void;
  disabled: boolean;
}

export default function InputPanel({ onGenerate, disabled }: InputPanelProps) {
  const [nodeCount, setNodeCount] = useState('5');
  const [values, setValues] = useState('1 2 3 4 5');
  const [nValue, setNValue] = useState('2');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(() => {
    const result = validateInputs(nodeCount, values, nValue);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onGenerate(result.values!, result.n!);
  }, [nodeCount, values, nValue, onGenerate]);

  const handleNodeCountChange = (val: string) => {
    setNodeCount(val);
    setError(null);
  };

  const handleValuesChange = (val: string) => {
    setValues(val);
    setError(null);
  };

  const handleNChange = (val: string) => {
    setNValue(val);
    setError(null);
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 animate-fade-in">
      <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
        <ListOrdered size={16} className="text-accent" />
        Configure Linked List
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Node count */}
        <div>
          <label
            htmlFor="input-node-count"
            className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
          >
            <Hash size={12} />
            Number of Nodes
          </label>
          <input
            id="input-node-count"
            type="text"
            inputMode="numeric"
            value={nodeCount}
            onChange={(e) => handleNodeCountChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. 5"
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
          />
        </div>

        {/* Values */}
        <div>
          <label
            htmlFor="input-values"
            className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
          >
            <ListOrdered size={12} />
            Node Values
          </label>
          <input
            id="input-values"
            type="text"
            value={values}
            onChange={(e) => handleValuesChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. 1 2 3 4 5"
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
          />
          <p className="text-[10px] text-text-muted mt-1">Space or comma separated</p>
        </div>

        {/* N */}
        <div>
          <label
            htmlFor="input-n"
            className="text-xs font-medium text-text-secondary mb-1.5 flex items-center gap-1.5"
          >
            <Crosshair size={12} />
            N (from end)
          </label>
          <input
            id="input-n"
            type="text"
            inputMode="numeric"
            value={nValue}
            onChange={(e) => handleNChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. 2"
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/30 transition-colors disabled:opacity-40"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-error/10 border border-error/20 rounded-lg px-3 py-2.5 mb-4 animate-fade-in">
          <AlertCircle size={15} className="text-error shrink-0 mt-0.5" />
          <p className="text-xs text-error leading-relaxed">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        id="btn-generate"
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-accent to-accent-bright text-white text-sm font-semibold rounded-lg shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
      >
        Build & Visualize
      </button>
    </div>
  );
}
