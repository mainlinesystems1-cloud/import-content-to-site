import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BookOpen, Download, ExternalLink } from "lucide-react"

function Header() {
  return (
    <header className="border-b border-white/[0.07]">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <Image src="/mainscript-logo.png" alt="MainScript logo" width={28} height={28} className="object-contain" priority />
          MainScript
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#8d8d94] md:flex">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/download" className="hover:text-white">Download</Link>
          <Link href="/docs" className="text-white">Docs</Link>
          <Link href="/legal" className="hover:text-white">Legal</Link>
        </nav>
        <Link href="/download" className="rounded-lg bg-[#f1f1f3] px-4 py-2 text-[13px] font-semibold text-[#111216] hover:bg-white">Get MainScript</Link>
      </div>
    </header>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#090a0b] text-[#f1f1f3]">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#8e98a7] hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden />Back home</Link>
        <div className="flex items-center gap-3 text-sm font-medium text-[#9ab9e8]"><BookOpen className="h-4 w-4" aria-hidden />DOCUMENTATION</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">MainScript docs</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#9da6b4]">Everything you need to download, install, and get started with MainScript.</p>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-white/[0.11] bg-white/[0.025] p-6"><h2 className="text-xl font-semibold">Getting started</h2><p className="mt-3 leading-relaxed text-[#9da6b4]">Download the latest Windows build, launch MainScript, and use the editor to prepare your script.</p><Link href="/download" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c5d9f7] hover:text-white"><Download className="h-4 w-4" aria-hidden />Download MainScript</Link></article>
          <article className="rounded-xl border border-white/[0.11] bg-white/[0.025] p-6"><h2 className="text-xl font-semibold">Compatibility</h2><p className="mt-3 leading-relaxed text-[#9da6b4]">MainScript is built for Windows and stays current with Roblox updates.</p><Link href="/#compatibility" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c5d9f7] hover:text-white">View compatibility <ExternalLink className="h-4 w-4" aria-hidden /></Link></article>
        </div>
        <section className="mt-14 border-t border-white/[0.08] pt-10"><h2 className="text-2xl font-semibold">Support</h2><p className="mt-3 max-w-2xl leading-relaxed text-[#9da6b4]">For announcements and community help, join the MainScript Discord from the homepage.</p></section>
      </main>
    </div>
  )
}
