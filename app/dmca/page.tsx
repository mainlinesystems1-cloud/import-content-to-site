import { LegalPage } from "@/components/legal-page"
import { MarkdownLite } from "@/components/markdown-lite"

const CONTACT = "support@mainscript.gg"

const CONTENT = `
This explains what we own, how to report someone using it without permission, and what happens next.

## 1. What we own

MainScript Management holds the rights to:

- the native module and all compiled binaries
- the desktop application and installer
- the user interface, its source, and its visual design
- this website, its source, and its documentation
- the MainScript name, logo, and branding

We also hold the rights to the Roblox offset data and internal API mappings the module depends on, insofar as those are ours to hold. Roblox itself and any Roblox trademarks belong to Roblox Corporation — we're not claiming those, and we're not authorized to.

## 2. Permission we have not granted

To be direct, because this comes up constantly: **you have no permission to re-upload MainScript.**

Not to file hosts. Not to mirrors. Not to "public" or "free" distribution. Not alongside a "mod" that changes nothing meaningful. Not to a Discord CDN, a paste site, or your own site with a link that redirects to ours.

If you want to share MainScript with someone, send them our download link. If you want to redistribute it, ask us first and get it in writing.

Re-uploading is treated as copyright infringement under 17 U.S.C. § 106, and it is the specific behavior that most reliably ends up in front of a lawyer.

## 3. Reporting infringement

If you believe MainScript, this site, or one of our community spaces is reproducing material you own, send a written notice to **${CONTACT}** with the following. This mirrors 17 U.S.C. § 512(c)(3):

1. Identify the copyrighted work you claim has been infringed. A description is fine if a title isn't sufficient.
2. Identify the infringing material and where it is. A URL is best — a Discord message link or channel reference works too. Be specific enough that we can find it without guessing.
3. Give us contact information — email address, and anything else you'd like us to use to reach you.
4. State that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law.
5. State that the information in your notice is accurate, and — under penalty of perjury — that you are the owner or authorized to act on the owner's behalf.
6. Sign it. An electronic signature is acceptable.

Incomplete notices are the most common reason a takedown stalls. If yours is missing any of the six elements, we may have to write back and wait, which helps nobody.

## 4. What we do when we receive a notice

- We review it. If it's valid and complete, we remove or disable the material and tell you we did.
- Where the material sits on a third-party host, we forward the notice to that host and cooperate with their process.
- We keep a record of substantiated notices.

## 5. Counter-notices

If your material was removed and you believe that was a mistake or a misidentification, you may submit a counter-notice to **${CONTACT}**. Include:

1. your physical or electronic signature
2. identification of the material removed and where it appeared
3. a statement under penalty of perjury that you have a good-faith belief the material was removed as a result of mistake or misidentification
4. your name, address, and telephone number
5. a statement consenting to the jurisdiction of the federal district court for the judicial district in which you reside (or, if you're outside the United States, any judicial district in which we may be found), and that you will accept service of process from the party who filed the original notice

If we receive a valid counter-notice we will forward it to the original complainant. If they notify us that they filed a court action seeking to restrain the activity, we may restore the material while that proceeds.

This exists because removal decisions are fallible, and you'd have the same right we would.

## 6. Research and interoperability

Studying MainScript, analyzing its behavior, measuring its performance, and writing about it are not infringement. Publishing its source, binaries, or a modified build is a different question and needs our permission.

There's a genuine tension here and we're not pretending otherwise. If your research depends on redistributing the binary, contact us before you publish and we'll probably say yes.

## 7. Repeat infringers

In the ordinary case this policy doesn't need a "repeat infringers" section, because we control the only distribution channel. The realistic infringement pattern for MainScript is one person re-uploading, not a community of infringers.

That said: the same notice-handling obligations apply to everyone, and we don't trade a takedown for a favour.
`

export default function DmcaPage() {
  return (
    <LegalPage title="Intellectual Property & DMCA Policy" updated="October 4, 2026">
      <MarkdownLite content={CONTENT} />
    </LegalPage>
  )
}
