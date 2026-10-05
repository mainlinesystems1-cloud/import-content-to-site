import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { API_CATEGORIES, API_TOTAL_FUNCTIONS } from "@/lib/api-reference"
import { getCompatibility, getKnownGaps } from "@/lib/releases"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Documentation · MainScript",
  description: "MainScript documentation: libraries, functions and compatibility.",
}

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export default async function DocsPage() {
  const [compatibility, knownGaps] = await Promise.all([getCompatibility(), getKnownGaps()])
  const categories = API_CATEGORIES.map((cat) => ({
    id: slug(cat.name),
    name: cat.name,
    functions: cat.functions.map((fn) => fn.name),
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="border-b border-border/80 bg-card/40">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-3 px-4 text-sm sm:px-6">
          <span className="font-semibold text-foreground">MainScript</span>
          <span className="h-4 w-px bg-border" aria-hidden />
          <span className="text-muted-foreground">Documentation</span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border/80 lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-8">
            <DocsSidebar categories={categories} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-10 sm:px-10">
          <article className="mx-auto max-w-3xl">
            <section id="overview" className="scroll-mt-24">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Overview</h1>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                Choose a library below to view its functions. MainScript exposes{" "}
                <span className="font-medium text-foreground">{API_TOTAL_FUNCTIONS}</span> globals across{" "}
                <span className="font-medium text-foreground">{API_CATEGORIES.length}</span> libraries.
              </p>
            </section>

            <section id="libraries" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Libraries</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-card">
                    <tr className="border-b border-border text-left">
                      <th scope="col" className="px-4 py-3 font-semibold text-foreground">Library</th>
                      <th scope="col" className="px-4 py-3 font-semibold text-foreground">Functions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="transition-colors hover:bg-card/60">
                        <td className="px-4 py-3">
                          <a href={`#${cat.id}`} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
                            {cat.name}
                          </a>
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{cat.functions.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="compatibility" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Compatibility</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {Object.entries(compatibility).map(([target, result]) => (
                  <div key={target} className="rounded-lg border border-border bg-card p-4">
                    <p className="font-mono text-xl font-semibold text-foreground">{result}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{target}</p>
                  </div>
                ))}
              </div>
              {knownGaps.length > 0 && (
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">Known gaps</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {knownGaps.map((gap) => (
                      <li key={gap.name}>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{gap.name}</code>
                        {" — "}
                        {gap.impact}
                        {gap.resolvedIn && <span className="ml-1 text-xs">(resolved in v{gap.resolvedIn})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {API_CATEGORIES.map((cat) => (
              <section key={cat.name} id={slug(cat.name)} className="mt-14 scroll-mt-24 border-t border-border pt-10">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{cat.name}</h2>
                  <span className="text-sm text-muted-foreground">
                    {cat.functions.length} {cat.functions.length === 1 ? "function" : "functions"}
                  </span>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {cat.functions.map((fn) => (
                    <li
                      key={fn.name}
                      id={`fn-${fn.name}`}
                      className="scroll-mt-24 rounded-md border border-border bg-card px-3.5 py-2.5"
                    >
                      <code className="font-mono text-sm text-foreground">{fn.name}</code>
                      {fn.alias && fn.alias.length > 0 && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          alias <span className="font-mono">{fn.alias.join(", ")}</span>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
        </main>

        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-16 px-4 py-10">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-border pl-3 text-sm">
              <li><a href="#overview" className="text-muted-foreground hover:text-foreground">Introduction</a></li>
              <li><a href="#libraries" className="text-muted-foreground hover:text-foreground">Libraries</a></li>
              <li><a href="#compatibility" className="text-muted-foreground hover:text-foreground">Compatibility</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
