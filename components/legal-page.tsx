import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {updated && <p className="mt-2 text-xs text-muted-foreground">Last updated {updated}</p>}
          <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">{children}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
