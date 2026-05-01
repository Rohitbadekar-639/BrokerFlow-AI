import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        new: "bg-blue-500/20 text-blue-300",
        qualifying: "bg-yellow-500/20 text-yellow-300",
        hot: "bg-orange-500/20 text-orange-300",
        booked: "bg-green-500/20 text-green-300"
      }
    },
    defaultVariants: {
      variant: "new"
    }
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
