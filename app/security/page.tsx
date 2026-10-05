import { LegalPage } from "@/components/legal-page"
import { MarkdownLite } from "@/components/markdown-lite"

const CONTACT = "support@mainscript.gg"

const CONTENT = `
We take security reports seriously and we publish the information people need to check our claims independently.

## 1. How to report a vulnerability

Send it to **${CONTACT}** through our support channels. Include:

- what the issue is, in one paragraph
- which component it affects — the module, the desktop app, the installer, the website, or the update endpoint
- steps to reproduce, ideally minimal
- proof-of-concept code where applicable
- what you think the impact is

We aim to acknowledge reports within a few days. We won't always hit that, and if we miss it, follow up rather than assuming we've ignored you.

## 2. In scope

- our website and any API it serves
- the update and manifest chain, including whether it can be tampered with or spoofed
- the installer's download and verification flow
- the local integrity verification that runs at startup
- the native module's handling of memory and process interaction

The update chain is the part we most want to hear about. If someone can serve a modified manifest and get MainScript to install a hostile binary, that is the report we want to receive first.

## 3. Out of scope

- vulnerabilities in the Roblox client itself — report those to Roblox
- issues in third-party services we don't control, including monetized link services and hosting providers
- denial of service, flooding, or sustained scraping
- social engineering of us or anyone else
- malware analysis requests aimed at getting us to modify or weaponize something
- reports generated entirely by an automated scanner with no demonstrated impact
- findings that require an already-compromised machine to exploit

## 4. Safe harbor

If you follow these guidelines in good faith, we will not take legal action against you for your research, and we will not pursue you for anything done while following them:

- report privately to us before disclosing publicly
- give us a reasonable opportunity to fix the issue — **14 days** from acknowledgement
- don't access data belonging to other users
- don't degrade the service, degrade it for others, or use the finding against third parties
- don't publish a working exploit in the wild during the window

If you find something and we can't fix it in a reasonable time, tell us and we'll talk about it rather than leaving you stuck.

This is a good-faith reservation. It doesn't bind us to terms we haven't agreed to, and it doesn't cover anyone who skips step one and just posts.

## 5. What we publish

Transparency here is the point, because the alternative is asking people to take our word for it:

- **SHA-256 hashes for every release.** If a download's hash doesn't match the one on this site, you have a modified binary and should not run it. This is the single most useful check available to you, and it costs you one command.
- **Behavioral notes on what the module does.** See section 5 of our Terms of Use — it describes the process and memory interaction involved, in plain language, because we'd rather you read it than guess.
- **Known gaps.** Our documentation lists the checks we currently fail rather than hiding them. An executor claiming a perfect score everywhere is either lying or hasn't measured.

## 6. Coordinated disclosure

Give us the 14-day window. After that we're happy for you to publish, with credit if you want it, and we'll say plainly where we landed on the fix.

If a bug turns out to be actively exploited in the wild, tell us and we'll skip the window and ship immediately.

## 7. Bug bounty

We don't run a paid bounty program. We read every report and we fix what we can. If that changes, it will be announced here first.

## 8. Verifying a download yourself

\`\`\`
Get-FileHash .\\MainScript.exe -Algorithm SHA256
Get-FileHash .\\bin\\MainScript.dll -Algorithm SHA256
\`\`\`

Compare both against the hashes published on our site. If they differ, don't run the file — contact us.
`

export default function SecurityPage() {
  return (
    <LegalPage title="Security Policy" updated="October 4, 2026">
      <MarkdownLite content={CONTENT} />
    </LegalPage>
  )
}
