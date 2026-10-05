import Link from "next/link"
import Image from "next/image"
import { DiscordIcon, YouTubeIcon } from "@/components/icons"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/download", label: "Download" },
  { href: "/docs", label: "Docs" },
  { href: "/legal", label: "Legal" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/mainscript-logo.png" alt="MainScript" width={28} height={28} className="h-7 w-7" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">MainScript</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://discord.gg/htv6hZAUTe"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Join the MainScript Discord"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <DiscordIcon className="h-5 w-5" />
          </a>
          <a
            href="https://youtube.com/@MAINLINEExploits"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="MainScript on YouTube"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <YouTubeIcon className="h-5 w-5" />
          </a>
          <Link
            href="/download"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Get MainScript
          </Link>
        </div>
      </div>
    </header>
  )
}
