import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { isValidElement } from "react";
import { cn } from "../../../../lib/utils";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonColor = "primary" | "secondary" | "tertiary";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: "gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold",
  sm: "gap-1 rounded-lg px-3 py-2 text-sm font-semibold",
  md: "gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold",
  lg: "gap-1.5 rounded-lg px-4 py-2.5 text-base font-semibold",
  xl: "gap-2 rounded-lg px-4.5 py-3 text-base font-semibold",
};

const COLOR_CLASSES: Record<ButtonColor, string> = {
  primary:
    "bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:hover:bg-[#7C3AED]",
  secondary:
    "bg-white/10 text-white hover:bg-white/15 disabled:hover:bg-white/10",
  tertiary:
    "bg-transparent text-white hover:bg-white/10 disabled:hover:bg-transparent",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  xs: "size-4",
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
  xl: "size-5",
};

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  isDisabled?: boolean;
  isLoading?: boolean;
  size?: ButtonSize;
  color?: ButtonColor;
  iconLeading?: FC<{ className?: string }> | ReactNode;
  iconTrailing?: FC<{ className?: string }> | ReactNode;
  children?: ReactNode;
}

export function Button({
  size = "sm",
  color = "primary",
  children,
  className,
  iconLeading: IconLeading,
  iconTrailing: IconTrailing,
  isDisabled,
  isLoading,
  type = "button",
  ...props
}: ButtonProps) {
  const disabled = isDisabled || isLoading;
  const iconClass = ICON_SIZE[size];

  const renderIcon = (Icon: FC<{ className?: string }> | ReactNode) => {
    if (!Icon) return null;
    if (isValidElement(Icon)) return Icon;
    if (typeof Icon === "function") {
      const Comp = Icon as FC<{ className?: string }>;
      return <Comp className={iconClass} />;
    }
    return null;
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-colors duration-200 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <svg
          fill="none"
          viewBox="0 0 20 20"
          className={cn(iconClass, "animate-spin")}
        >
          <circle
            className="stroke-current opacity-30"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
          />
          <circle
            className="origin-center stroke-current"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            strokeWidth="2"
            strokeDasharray="12.5 50"
            strokeLinecap="round"
          />
        </svg>
      )}
      {renderIcon(IconLeading)}
      {children && <span className="px-0.5">{children}</span>}
      {renderIcon(IconTrailing)}
    </button>
  );
}
