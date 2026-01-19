import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium transition-all",
  {
    variants: {
      variant: {
        default:
          "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20",
        secondary:
          "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
        outline: "border-white/10 text-gray-400 hover:bg-white/5",
        amber:
          "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
