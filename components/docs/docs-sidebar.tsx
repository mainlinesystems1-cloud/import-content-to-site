"use client"

import { useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DocsNavCategory {
  id: string
  name: string
  functions: string[]
}

export function DocsSidebar({ categories }: { categories: DocsNavCategory[] }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<string | null>(null)
  const q = query.trim().toLowerCase()

  const filtered = categories
    .map((cat) => ({
      ...cat,
      matches: q ? cat.functions.filter((fn) => fn.toLowerCase().includes(q)) : cat.functions,
      nameMatch: q ? cat.name.toLowerCase().includes(q) : true,
    }))
    .filter((cat) => cat.nameMatch || cat.matches.length > 0)

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-5">
      <div>
        <label htmlFor="docs-search" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Search docs
        </label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="docs-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find anything..."
            className="h-9 w-full rounded-md border border-border bg-card pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <ul className="flex flex-col gap-0.5 text-sm">
        {!q && (
          <li>
            <a href="#overview" className="block rounded-md px-2.5 py-1.5 font-medium text-foreground hover:bg-accent">
              Overview
            </a>
          </li>
        )}
        {filtered.map((cat) => {
          const expanded = q ? true : open === cat.id
          return (
            <li key={cat.id}>
              <div className="flex items-center">
                <a
                  href={`#${cat.id}`}
                  className="flex-1 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {cat.name}
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : cat.id)}
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${cat.name}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <ChevronRight className={cn("h-4 w-4 transition-transform", expanded && "rotate-90")} />
                </button>
              </div>
              {expanded && (
                <ul className="mb-1 ml-3 border-l border-border pl-2">
                  {cat.matches.map((fn) => (
                    <li key={fn}>
                      <a
                        href={`#fn-${fn}`}
                        className="block truncate rounded px-2 py-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                      >
                        {fn}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
        {filtered.length === 0 && <li className="px-2.5 py-1.5 text-muted-foreground">No results.</li>}
      </ul>
    </nav>
  )
}
