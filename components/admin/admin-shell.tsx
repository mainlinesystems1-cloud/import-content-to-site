"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/installer", label: "Installer" },
  { href: "/admin/updates", label: "Updates" },
  { href: "/admin/changelog", label: "Changelog" },
  { href: "/admin/releases", label: "Release history" },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-border/80 bg-card/40 px-4 py-6 md:flex">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <Image src="/mainscript-logo.png" alt="MainScript" width={24} height={24} className="h-6 w-6" />
          <span className="text-sm font-semibold text-foreground">Admin</span>
        </Link>
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex flex-col gap-2 border-t border-border/80 pt-4">
          <Link href="/" className="px-3 text-xs text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b border-border/80 px-4 md:hidden">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/mainscript-logo.png" alt="MainScript" width={22} height={22} className="h-5.5 w-5.5" />
            <span className="text-sm font-semibold text-foreground">Admin</span>
          </Link>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border/80 px-4 py-2 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs",
                pathname === item.href
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
