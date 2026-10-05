import Link from "next/link"
import { ArrowRight, Download, KeyRound, ShieldCheck, Zap } from "lucide-react"

const features = [
  { icon: KeyRound, title: "Keyless by default", text: "No link shorteners, activation gates, or hidden steps." },
  { icon: Zap, title: "Built for speed", text: "A lightweight experience that gets out of your way." },
  { icon: ShieldCheck, title: "Focused and clean", text: "A simple interface designed around reliable execution." },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card font-mono text-sm">MS</span>
          <span>MainScript</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <Link href="#features" className="transition-colors hover:text-foreground">Features</Link>
          <Link href="#about" className="transition-colors hover:text-foreground">About</Link>
          <Link href="/docs" className="transition-colors hover:text-foreground">Docs</Link>
        </nav>
        <Link href="/download" className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">Download</Link>
      </header>

      <section className="relative overflow-hidden border-y border-border">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <p className="mb-7 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">MAIN SCRIPT / WINDOWS</p>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Script execution, refined.</h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-muted-foreground">A free and keyless Roblox executor for Windows. Fast, focused, and ready when you are.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/download" className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-85"><Download className="h-4 w-4" aria-hidden />Download MainScript</Link>
            <Link href="/docs" className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent">Read the docs <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-6xl gap-px px-6 py-20 sm:grid-cols-3 lg:px-8">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="border border-border bg-card p-7 first:rounded-t-lg last:rounded-b-lg sm:first:rounded-l-lg sm:first:rounded-r-none sm:last:rounded-r-lg sm:last:rounded-l-none">
            <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
            <h2 className="mt-6 font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>

      <section id="about" className="mx-auto max-w-6xl border-t border-border px-6 py-20 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Compatibility</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Made to stay out of your way.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">MainScript keeps the essentials close and the friction low, with updates that follow Roblox releases.</p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">MainScript · Free and keyless for Windows</footer>
    </main>
  )
}
