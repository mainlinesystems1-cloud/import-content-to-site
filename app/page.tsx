import Image from "next/image"
import Link from "next/link"
import { Download, MessageCircle, Video } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-screen bg-[#090a0b] text-[#f1f1f3]">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <Image src="/mainscript-logo.png" alt="MainScript logo" width={28} height={28} className="object-contain" priority />
            <span>MainScript</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-[#8d8d94] md:flex">
            <Link href="#home" className="transition-colors hover:text-white">Home</Link>
            <Link href="/download" className="transition-colors hover:text-white">Download</Link>
            <Link href="/docs" className="transition-colors hover:text-white">Docs</Link>
            <Link href="/legal" className="transition-colors hover:text-white">Legal</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="https://discord.com" aria-label="Join the Discord" className="text-[#96969d] transition-colors hover:text-white"><MessageCircle className="h-[18px] w-[18px]" aria-hidden /></Link>
            <Link href="https://youtube.com" aria-label="MainScript on YouTube" className="text-[#96969d] transition-colors hover:text-white"><Video className="h-[19px] w-[19px]" aria-hidden /></Link>
            <Link href="/download" className="rounded-lg bg-[#f1f1f3] px-4 py-2 text-[13px] font-semibold text-[#111216] transition-colors hover:bg-white">Get MainScript</Link>
          </div>
        </div>
      </header>

      <section id="home" className="relative flex min-h-[610px] items-center justify-center overflow-hidden border-b border-white/[0.07] px-6 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0.8px,transparent_0.9px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_12%,transparent_72%)]" />
        <div className="relative flex -translate-y-2 flex-col items-center">
          <Image src="/mainscript-logo.png" alt="" width={78} height={78} className="mb-8 object-contain" priority />
          <h1 className="text-6xl font-bold tracking-[-0.055em] sm:text-[68px]">MainScript</h1>
          <p className="mt-3 text-[24px] font-medium tracking-[-0.025em] text-[#c9d0d9]">Script execution, refined.</p>
          <p className="mt-4 text-[15px] text-[#8e98a7]">A free and keyless Roblox executor for Windows.</p>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <Link href="/download" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f1f1f3] px-6 text-sm font-semibold text-[#111216] transition-colors hover:bg-white"><Download className="h-4 w-4" aria-hidden />Download MainScript</Link>
            <Link href="https://discord.com" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/[0.12] px-6 text-sm font-semibold transition-colors hover:bg-white/[0.06]"><MessageCircle className="h-4 w-4" aria-hidden />Join the Discord</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
