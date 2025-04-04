
import * as React from "react"
import { cn } from "@/lib/utils"

interface MockupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Mockup({ className, ...props }: MockupProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-background",
        className
      )}
      {...props}
    />
  )
}
