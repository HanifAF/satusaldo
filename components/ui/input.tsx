import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, prefix, ...props }, ref) => {
    return (
      <div>
        <div className="relative">
          {prefix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-900
                        placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none
                        focus:ring-2 focus:ring-emerald-500/30
                        ${prefix ? "pl-10" : ""}
                        ${error ? "border-red-300" : "border-transparent focus:border-emerald-400"}
                        ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
