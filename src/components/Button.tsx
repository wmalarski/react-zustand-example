import type { VariantProps } from "class-variance-authority";
import { twCva } from "./utils/twCva";
import { ComponentProps, forwardRef } from "react";

export const buttonClass = twCva("btn no-animation flex items-center gap-1", {
  defaultVariants: {
    color: null,
    isLoading: false,
    shape: null,
    size: "md",
    variant: null,
  },
  variants: {
    color: {
      accent: "btn-accent",
      error: "btn-error",
      info: "btn-info",
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      warning: "btn-warning",
    },
    isLoading: {
      false: "",
      true: "loading",
    },
    shape: {
      block: "btn-block",
      circle: "btn-circle",
      square: "btn-square",
      wide: "btn-wide",
    },
    size: {
      lg: "btn-lg",
      md: "btn-md",
      sm: "btn-sm",
      xs: "btn-xs",
    },
    variant: {
      active: "btn-active",
      disabled: "btn-disabled",
      ghost: "btn-ghost",
      glass: "glass",
      link: "btn-link",
      outline: "btn-outline",
    },
  },
});

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonClass>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, variant, isLoading, size, shape, className, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={buttonClass({
          className,
          color,
          variant,
          isLoading,
          size,
          shape,
        })}
      />
    );
  }
);

Button.displayName = "Button";
