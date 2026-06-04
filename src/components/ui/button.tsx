import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground rounded-full hover:bg-foreground/90 hover:-translate-y-px",
        outline:
          "border border-foreground/20 bg-transparent text-foreground rounded-full hover:bg-foreground hover:text-background hover:border-foreground",
        ghost: "text-foreground rounded-full hover:bg-foreground/5",
        link: "text-foreground underline-offset-[6px] hover:underline decoration-foreground/30 hover:decoration-foreground rounded-none px-0",
        secondary:
          "bg-secondary text-foreground rounded-full hover:bg-warm-gray border border-hairline",
        destructive: "bg-destructive text-destructive-foreground rounded-full hover:opacity-90",
      },
      size: {
        default: "h-11 px-6 text-sm tracking-tight",
        sm: "h-9 px-4 text-xs tracking-wide",
        lg: "h-14 px-8 text-[15px] tracking-tight",
        xl: "h-16 px-10 text-base tracking-tight",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
