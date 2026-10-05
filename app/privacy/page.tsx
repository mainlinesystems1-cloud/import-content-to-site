import { LegalPage } from "@/components/legal-page"
import { MarkdownLite } from "@/components/markdown-lite"

const CONTACT = "support@mainscript.gg"

const CONTENT = `
MainScript has no accounts, no license keys, and no analytics. It does not
transmit anything about your machine to us.

It does read and, when you enable machine-identity spoofing, temporarily alter
local hardware identifiers. That is covered in section 3, and it is the only
part of this document worth reading closely.

## 1. What we do not collect

- No account, login, or user name
- No license key, serial, or activation
- No analytics, telemetry, or usage statistics
- No crash reports uploaded automatically
- No advertising or cross-site identifiers
- No copy of your files, browser data, or documents

There is no server that receives this information, because there is no server
that would have any use for it.

## 2. The integrity check is local

On startup, MainScript computes SHA-256 hashes of \`MainScript.exe\` and
\`bin\\MainScript.dll\` and compares them against values bundled in the
application. The comparison happens on your machine. Nothing is uploaded, and
we are not told the result.

## 3. Machine identifiers

This is the part worth understanding.

MainScript reads a set of hardware identifiers from the Windows registry so it
can tell multiple Roblox instances apart on the same machine. The values come
from:

\`\`\`
HKLM\\HARDWARE\\DESCRIPTION\\System\\BIOS
    BIOSVendor, BIOSVersion, SystemManufacturer, SystemProductName,
    BaseBoardManufacturer, BaseBoardProduct, SystemSerialNumber
HKLM\\HARDWARE\\DESCRIPTION\\System\\CentralProcessor
\`\`\`

Those values are hashed to produce a machine profile used to distinguish
attached clients.

### When spoofing is enabled

If you turn on machine-identity spoofing, MainScript writes randomized values
back to those same registry keys, using a fixed list of plausible vendor,
version, and product strings. Original values are written to a backup file
before the first change, and restoring puts them back.

Three things about this scope:

- The UI process is launched with \`requireAdministrator\`, because writing to
  \`HKLM\` requires elevation.
- Windows can regenerate some \`HARDWARE\\DESCRIPTION\` values from firmware, so
  this is treated as session-scoped rather than permanent.
- Originals are restored when you ask, or when the application exits
  normally.

### What it deliberately does not touch

MainScript does **not** rewrite SMBIOS or DMI tables, does **not** touch disk
serials or install network filter drivers, and does **not** modify your MAC
address. All three require kernel-mode code, and all three are the kind of
thing that destabilises a machine. The implementation stays in the registry
and Win32 volume APIs by design.

### It is never transmitted

The machine profile stays local. It is used inside the application to
distinguish clients. It is not sent to us, not written to any external
service, and not included in any request.

## 4. Requests the application makes

MainScript contacts a small number of external services, all of them for
features you can see:

- \`users.roblox.com\` — resolve a Roblox username to a user ID
- \`thumbnails.roblox.com\` — load the avatar shown next to an attached client
- \`scriptblox.com\` — Script Hub search
- \`api.github.com\` — check published releases for launcher and Roblox builds
- your site's \`manifest.json\` — check whether a MainScript update exists

Each of these requests necessarily reveals your IP address to the operator of
that service, which is ordinary web server behaviour rather than tracking.
None of them carry a machine identifier.

The update check is currently disabled and does nothing until
\`manifest.json\` is configured.

Requests made by your own scripts through the exposed HTTP functions are yours
and go wherever you point them. We see nothing.

## 5. Data stored on your machine

- Settings: theme, background, toggles
- A flag recording that you have seen the first-run tutorial
- Verification and repair logs
- The backup of original registry values described in section 3
- The WebView2 browser profile (\`wv2\\EBWebView\`), a standard Chromium artifact

All of it is removed by deleting the application folder and
\`%LOCALAPPDATA%\\MainScript\`.

## 6. The website

This site is hosted on Vercel, which processes standard server logs — IP
address, user agent, timestamp, requested path — under its own privacy policy.
We run no analytics scripts and set no cookies of our own.

If you reach a download through a link-shortening or monetised link service,
that service handles your request under its own policy.

## 7. Roblox

MainScript is a separate application with no integration with Roblox's data
practices. When you use the Roblox client, Roblox collects what Roblox collects.

## 8. Children

MainScript is a developer tool and is not directed at children. If a minor has
used it, contact us.

## 9. Changes

Material changes will be announced on our Discord or site rather than made
silently. The date at the top reflects the current version.

## 10. Contact

Privacy questions go to **${CONTACT}**.

---

**Summary:** nothing is collected and nothing about your machine reaches us.
Section 3 describes local registry changes you can reverse, and section 4 lists
every external service the application talks to.
`

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 4, 2026">
      <MarkdownLite content={CONTENT} />
    </LegalPage>
  )
}
