import Link from "next/link"
import Image from "next/image"
import { DiscordIcon, YouTubeIcon } from "@/components/icons"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Image src="/mainscript-logo.png" alt="MainScript" width={24} height={24} className="h-6 w-6" />
              <span className="text-sm font-semibold text-foreground">MainScript</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A free and keyless Roblox executor for Windows. Not affiliated with Roblox Corporation.
            </p>
            <div className="mt-4 flex items-center gap-4">
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/download" className="text-foreground/80 hover:text-foreground">
                    Download
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-foreground/80 hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Legal</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-foreground/80 hover:text-foreground">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-foreground/80 hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-foreground/80 hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="/dmca" className="text-foreground/80 hover:text-foreground">
                    DMCA
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Community</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/htv6hZAUTe"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-foreground/80 hover:text-foreground"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/@MAINLINEExploits"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-foreground/80 hover:text-foreground"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MainLine Management. Not affiliated with Roblox Corporation.</p>
          <Link href="/admin/login" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
