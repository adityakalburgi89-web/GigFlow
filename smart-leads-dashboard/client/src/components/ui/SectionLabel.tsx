import * as React from "react"
import { cn } from "../../utils/helpers"

export function SectionLabel({ className, children, pulsing = false }: { className?: string, children: React.ReactNode, pulsing?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2", className)}>
      <span className="relative flex h-2 w-2">
        {pulsing && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
        {children}
      </span>
    </div>
  )
}
