import type { Metadata } from "next";
import "./styles/globals.css";

import '@fontsource/new-amsterdam';
import '@fontsource/idiqlat';
import '@fontsource-variable/afacad-flux/wght.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AppShell from "./app_shell";
import { SITE_URL, openGraphDefaults, ogLogoUrl } from "./site_metadata";

export const metadata: Metadata = {
  // "default" is what the home page renders (unset there, so it inherits
  // this as-is); every other page sets its own plain title and gets it
  // slotted into "template" instead — e.g. "About" becomes "About | Amanda
  // N. Robinson" — rather than every page.tsx repeating the full string.
  title: {
    default: "Amanda N. Robinson | Software Developer",
    template: "%s | Amanda N. Robinson"
  },
  description: "Portfolio of Amanda N. Robinson, a software developer who builds thoughtful, creative products for real-world problems.",
  authors: {name: 'Amanda N. Robinson'},
  // The site's real custom domain — was still the old default vercel.app
  // deployment URL, which meant og:image and every other metadataBase-
  // relative URL were resolving to the wrong domain regardless of what
  // openGraph fields were otherwise set.
  metadataBase: new URL(SITE_URL),
  // og:type + og:url for the home page specifically (siteName/type here
  // become every other page's OWN openGraph defaults too, via
  // site_metadata.ts's openGraphDefaults — see that file's comment on why
  // this can't just be inherited automatically). Every other route's own
  // page.tsx sets its own `openGraph.url`; this one doesn't need a
  // corresponding page.tsx entry since Home's page.tsx has no openGraph of
  // its own to replace this with, so it inherits unchanged.
  openGraph: {
    ...openGraphDefaults,
    url: '/',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        {/* og:logo isn't part of the actual OpenGraph protocol and has no
            field on Next.js's typed Metadata.openGraph object — see
            site_metadata.ts's own comment — so it's rendered directly as a
            literal tag instead of through the metadata export. React 19
            hoists title/meta/link elements into <head> regardless of where
            in the tree they're rendered; this explicit <head> is just for
            clarity, not a functional requirement. */}
        <meta property="og:logo" content={ogLogoUrl} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
