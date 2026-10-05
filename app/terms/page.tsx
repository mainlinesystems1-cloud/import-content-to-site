import { LegalPage } from "@/components/legal-page"
import { MarkdownLite } from "@/components/markdown-lite"

const CONTACT = "support@mainscript.gg"

const CONTENT = `
## 1. What MainScript is

MainScript is a Windows application that loads a native module into the Roblox
desktop client and exposes a Luau API to it. It provides a script editor, a
console, a script browser, and roughly 157 native functions covering
reflection, signals, input, filesystem access, drawing, and packet inspection.

It is a developer and research tool.

MainScript is not affiliated with, endorsed by, or connected to Roblox
Corporation.

## 2. Free distribution — no licence, no keys, no sale

MainScript is provided at no cost. To state this plainly, because the wording
matters:

- **No licence is sold.** There is no licence fee, no licence key, no
  activation, and no subscription.
- **No licence key exists.** Any site offering to sell you a "MainScript key"
  is selling something that does not exist.
- **No account system exists.** Nothing to register for, nothing to sign in to.
- **No hardware binding exists.** We cannot tie a copy to a device, and we do
  not attempt to.
- **No payment is collected.** There is no paid tier, no premium edition, and
  no reselling arrangement.

Nothing in these terms grants you a right to redistribute, sublicense, or sell
the software. Section 4 covers what you may and may not do with it.

We may withdraw the software, the website, or the download at any time.

## 3. Using an executor violates Roblox's Terms of Use

We would rather say this directly than bury it.

Roblox prohibits the use of third-party software to alter or automate the
client. Running MainScript is a violation of Roblox's Terms of Use. Roblox can
ban accounts, and bans are rarely reversible.

You accept that on your own. We cannot appeal a ban on your behalf and cannot
prevent one.

Practically, that means:

- Use it on your own place, your own private servers, or where you have
  explicit permission.
- Do not use it on someone else's server or project.
- Do not use it to grief, cheat in public matches, or gain an advantage over
  other players.

## 4. Ownership and permitted use

MainScript is owned by MainScript Management. This covers the native module,
the application, the user interface, the installer, this website, the
documentation, and the name.

You may run it on a machine you own or control, study it for your own
understanding, and publish scripts and tutorials built with it.

You may not:

- decompile, disassemble, or reverse engineer the binaries or native module
- modify, adapt, patch, or repackage the software
- redistribute, mirror, or re-upload it, including modified builds
- sell, rent, lease, or sublicense it
- remove proprietary notices
- present it as your own work

Sharing a download link with someone is fine. Handing them your copy is not.
That is the entire distinction.

## 5. What the software does to your system

Software that injects code into another process and edits registry keys should
say so plainly. Here is what MainScript does.

### It runs elevated

\`MainScript.exe\` requests administrator rights through its application
manifest. This is required for the registry work in section 5.2 and for
injecting into the Roblox client.

### It injects into the Roblox client

To load the native module, the application:

- enumerates running processes to find Roblox client instances
- calls \`OpenProcess\` on the target
- calls \`VirtualAllocEx\` and \`WriteProcessMemory\` to place the module
- resumes a remote thread to load it

This targets Roblox client processes. It does not hook, scan, or modify
unrelated processes, security software, system binaries, or browser data.

### It edits machine identifiers

When machine-identity spoofing is enabled, it writes randomized values to
\`HKLM\\HARDWARE\\DESCRIPTION\\System\\BIOS\` and \`...\\CentralProcessor\`, after
backing up the originals. It does not rewrite SMBIOS or DMI tables, does not
touch disk serials or network filter drivers, and does not modify your MAC
address. Originals can be restored at any time. The Privacy Policy covers this
in full.

### What it does not do

MainScript contains no debugger detection, no virtual machine detection, and
no integrity beacon. It does not report your usage to us. It does not modify
non-target processes.

## 6. Acceptable use

Do not use MainScript, or our site, to:

- grief, harass, or disrupt other people's games or servers
- run malicious code — stealers, credential grabbers, miners, ransomware, or
  persistent backdoors
- distribute malware through our download links or through scripts built with
  the tool
- attack our website, hosting, or update endpoints, including denial of
  service, flooding, or scraping at a rate that degrades service
- misrepresent the software to others

## 7. Enforcement

Because there are no accounts, no keys, and no licensing infrastructure, we
cannot suspend you from anything. Enforcement runs through distribution:

- We can remove the download.
- We can report re-uploads to whoever hosts them.
- We can pursue legal remedies where a legal remedy exists.

That is the full extent of our reach, stated plainly so you understand it
before deciding whether it is worth testing.

## 8. Availability

MainScript is provided as-is and as-available, with no uptime guarantee for the
website, the download host, or the update endpoint.

We may change or withdraw any part of it at any time without notice. We may
also ship changes that break existing scripts, because the module targets
Roblox internals that change without notice.

## 9. Third-party claims

We publish SHA-256 hashes for every release and notes describing what the
software does, so claims about MainScript can be checked instead of guessed.

We cannot prevent anyone from saying anything about us. Where claims are
false, the routes available are takedown requests, cease-and-desist letters,
and defamation or commercial disparagement claims where the facts support
them. Those remedies are real but not automatic, and no terms page can stop
someone from posting.

If you believe we have done something wrong, contact us before publishing.

## 10. Third-party components

MainScript incorporates open-source components, including Luau, libcurl, cpr,
mbedTLS, and zstd. They remain under their own licences.

## 11. Disclaimer and liability

MainScript is provided "as is" and "as available", without warranty of any
kind, express or implied, including fitness for a particular purpose,
merchantability, and non-infringement. Some jurisdictions do not permit
certain exclusions; where they do not, those exclusions do not apply to you.

To the fullest extent permitted by law, MainScript Management and its
contributors are not liable for account bans, data loss, lost profits, service
interruption, or any damage arising from your use of the software or your
violation of a third party's terms.

You are solely responsible for how you use this tool.

## 12. Changes to these terms

We may revise these terms. The date at the top reflects the current version.
Continued use after a change means you accept it.

## 13. Acceptance

Downloading, installing, or using MainScript means you accept these terms. If
you do not, delete it and stop using it.

Contact: **${CONTACT}**
`

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 4, 2026">
      <MarkdownLite content={CONTENT} />
    </LegalPage>
  )
}
