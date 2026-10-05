import type { ReactNode } from "react"

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-${i++}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      )
    } else {
      nodes.push(
        <code key={`${keyPrefix}-${i++}`} className="mono-num rounded bg-muted px-1.5 py-0.5 text-foreground">
          {token.slice(1, -1)}
        </code>,
      )
    }
    lastIndex = match.index + token.length
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n")
  const blocks: ReactNode[] = []
  let listBuffer: string[] = []
  let codeBuffer: string[] | null = null
  let key = 0

  const flushList = () => {
    if (listBuffer.length === 0) return
    blocks.push(
      <ul key={`ul-${key++}`} className="list-disc space-y-1.5 pl-5">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>
        ))}
      </ul>,
    )
    listBuffer = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (line.trim() === "```") {
      if (codeBuffer === null) {
        codeBuffer = []
      } else {
        flushList()
        blocks.push(
          <pre key={`pre-${key++}`} className="mono-num overflow-x-auto rounded-md bg-muted p-4 text-xs text-foreground">
            {codeBuffer.join("\n")}
          </pre>,
        )
        codeBuffer = null
      }
      continue
    }
    if (codeBuffer !== null) {
      codeBuffer.push(rawLine)
      continue
    }

    if (line.trim() === "" || line.trim() === "---") {
      flushList()
      continue
    }
    if (line.startsWith("## ")) {
      flushList()
      blocks.push(
        <h2 key={`h2-${key++}`} className="mt-10 text-xl font-semibold text-foreground">
          {line.slice(3)}
        </h2>,
      )
      continue
    }
    if (line.startsWith("### ")) {
      flushList()
      blocks.push(
        <h3 key={`h3-${key++}`} className="mt-6 text-base font-semibold text-foreground">
          {line.slice(4)}
        </h3>,
      )
      continue
    }
    if (line.startsWith("# ")) {
      flushList()
      continue
    }
    if (/^\d+\.\s/.test(line.trim()) || line.trim().startsWith("- ")) {
      listBuffer.push(line.trim().replace(/^(\d+\.|-)\s/, ""))
      continue
    }
    flushList()
    blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>)
  }
  flushList()

  return <>{blocks}</>
}
