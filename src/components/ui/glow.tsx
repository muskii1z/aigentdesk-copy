
import * as React from "react"
import { cn } from "@/lib/utils"

interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "above" | "below"
}

export function Glow({
  variant = "default",
  className,
  ...props
}: GlowProps) {
  return (
    <div
      className={cn(
        "absolute inset-0",
        {
          "bottom-auto h-[300px] md:h-[400px]": variant === "above",
          "top-auto h-[300px] md:h-[400px]": variant === "below",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute w-full h-full",
          {
            "bg-gradient-to-b from-querify-blue/30 to-transparent": variant === "above",
            "bg-gradient-to-t from-querify-blue/30 to-transparent": variant === "below",
            "bg-radial-gradient from-querify-blue/30 to-transparent": variant === "default",
          }
        )}
      />
    </div>
  )
}
