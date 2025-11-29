import { Check, Loader2 } from 'lucide-react';

interface Step {
  label: string;
  status: 'pending' | 'processing' | 'complete';
}

interface ProgressIndicatorProps {
  steps: Step[];
}

export default function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              step.status === 'complete'
                ? 'bg-[var(--color-success)] text-white'
                : step.status === 'processing'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]'
            }`}
          >
            {step.status === 'complete' ? (
              <Check className="w-5 h-5" />
            ) : step.status === 'processing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <div className="flex-1">
            <p
              className={`transition-colors duration-300 ${
                step.status === 'pending'
                  ? 'text-[var(--color-neutral-500)]'
                  : 'text-[var(--color-neutral-800)]'
              }`}
            >
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
