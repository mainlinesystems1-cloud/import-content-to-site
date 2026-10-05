import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Legal · MainScript",
  description: "Terms of Use, Privacy Policy, Security and DMCA for MainScript.",
}

const DOCS = [
  { href: "/terms", title: "Terms of Use", body: "The rules that apply when you download and use MainScript." },
  { href: "/privacy", title: "Privacy Policy", body: "What data we collect, why, and how it is handled." },
  { href: "/security", title: "Security", body: "How to report vulnerabilities and how we respond." },
  { href: "/dmca", title: "DMCA", body: "How to submit copyright notices and counter-notices." },
]

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">Policies & notices</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            MainScript is a free, keyless Roblox executor operated by MainLine Management. It is not affiliated with,
            endorsed by, or sponsored by Roblox Corporation.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {DOCS.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-ring hover:bg-accent"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">{doc.title}</h2>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{doc.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
