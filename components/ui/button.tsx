import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "dark" | "outline" | "ghost";
type ButtonSize = "default" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-900/10",
  dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/20",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
  ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  default: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "default", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full font-semibold
                    transition-colors disabled:cursor-not-allowed disabled:opacity-50
                    ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
