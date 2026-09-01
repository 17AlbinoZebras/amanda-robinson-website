// Shared metadata every route builds its own page.tsx `openGraph` export
// from — centralized here rather than repeated per page, since Next.js does
// NOT deep-merge a page's own `openGraph` object with its parent layout's:
// a page that sets `openGraph: { url: '/about' }` alone would silently lose
// the root layout's `type`/`siteName` rather than add to them, since the
// whole `openGraph` object is replaced wholesale at whichever level defines
// it. Each page.tsx instead spreads `openGraphDefaults` in and adds just its
// own `url`.
export const SITE_URL = 'https://www.amandarobinson.dev'

export const openGraphDefaults = {
    type: 'website' as const,
    siteName: 'Amanda N. Robinson',
}

// og:logo isn't part of the actual OpenGraph protocol (ogp.me doesn't list
// it) and Next.js's typed Metadata.openGraph object has no field for it —
// rendered as a literal <meta> tag from layout.tsx instead of through the
// Metadata API, which is also why this is a full absolute URL rather than a
// path: metadataBase's automatic relative-URL resolution only applies to
// typed metadata fields, not custom/literal tags.
export const ogLogoUrl = `${SITE_URL}/icon.png`
