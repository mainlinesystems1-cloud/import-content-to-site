import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react"

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
          <Link href="/docs" className="hover:text-white">Docs</Link>
          <Link href="/legal" className="text-white">Legal</Link>
        </nav>
        <Link href="/download" className="rounded-lg bg-[#f1f1f3] px-4 py-2 text-[13px] font-semibold text-[#111216] hover:bg-white">Get MainScript</Link>
      </div>
    </header>
  )
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#090a0b] text-[#f1f1f3]">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#8e98a7] hover:text-white"><ArrowLeft className="h-4 w-4" aria-hidden />Back home</Link>
        <div className="flex items-center gap-3 text-sm font-medium text-[#9ab9e8]"><FileText className="h-4 w-4" aria-hidden />LEGAL</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Legal & safety</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#9da6b4]">Please review these terms before using MainScript.</p>
        <div className="mt-14 space-y-5">
          <article className="rounded-xl border border-white/[0.11] bg-white/[0.025] p-6 sm:p-8"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-[#9ab9e8]" aria-hidden /><h2 className="text-xl font-semibold">Use responsibly</h2></div><p className="mt-4 leading-relaxed text-[#9da6b4]">MainScript is provided for educational and authorized testing purposes. Only use it with software, accounts, and experiences you own or have explicit permission to test.</p></article>
          <article className="rounded-xl border border-white/[0.11] bg-white/[0.025] p-6 sm:p-8"><h2 className="text-xl font-semibold">No warranty</h2><p className="mt-4 leading-relaxed text-[#9da6b4]">MainScript is provided as-is, without guarantees of availability, compatibility, or fitness for a particular purpose. You are responsible for how you use the software and for following applicable rules and laws.</p></article>
          <article className="rounded-xl border border-white/[0.11] bg-white/[0.025] p-6 sm:p-8"><h2 className="text-xl font-semibold">Updates</h2><p className="mt-4 leading-relaxed text-[#9da6b4]">These terms may change as MainScript evolves. Continued use of the site or software after an update means you accept the revised information.</p></article>
        </div>
      </main>
    </div>
  )
}
