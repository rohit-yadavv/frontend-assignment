import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "font-bold text-3xl md:text-4xl lg:text-5xl leading-tight",
      h2: "font-semibold text-2xl md:text-3xl lg:text-4xl leading-tight",
      h3: "font-semibold text-xl md:text-2xl lg:text-3xl leading-tight",
      h4: "font-medium text-lg md:text-xl lg:text-2xl leading-snug",
      h5: "font-medium text-base md:text-lg lg:text-xl leading-snug",
      h6: "font-medium text-sm md:text-base lg:text-lg leading-snug",
      p: "text-sm md:text-base lg:text-lg leading-relaxed",
      small: "text-xs md:text-sm lg:text-base leading-snug",
      extrasmall: "text-2xs md:text-xs lg:text-sm leading-snug",
      muted:
        "text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed",
      mutedSmall: "text-xs md:text-sm lg:text-base text-muted-foreground ",
      mutedExtraSmall:
        "text-2xs md:text-xs lg:text-sm leading-snug text-muted-foreground ",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
    as?: React.ElementType;
  };

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", asChild = false, as, ...props }, ref) => {
    const Component: React.ElementType = asChild ? Slot : as ?? "p";

    return (
      <Component
        className={cn(typographyVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

export type TypographyVariant = VariantProps<
  typeof typographyVariants
>["variant"];

Typography.displayName = "Typography";

export { Typography, typographyVariants };
