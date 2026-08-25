import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";

import '@fontsource/new-amsterdam';
import '@fontsource/idiqlat';
import '@fontsource-variable/afacad-flux/wght.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import AppShell from "./app_shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  metadataBase: new URL('https://amandarobinson.xyz')
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
