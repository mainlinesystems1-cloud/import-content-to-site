"use client"

import { Download } from "lucide-react"

export function DownloadButton({ blobUrl, fileName }: { blobUrl: string; fileName: string }) {
  return (
    <a
      href={blobUrl}
      download={fileName}
      className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
    >
      <Download className="h-4 w-4" />
      Download
    </a>
  )
}
