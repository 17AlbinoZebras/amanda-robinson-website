import type { Metadata } from "next";
import Resume from "../resume";
import { openGraphDefaults } from "../site_metadata";

export const metadata: Metadata = {
    title: "Resume",
    description: "View or download Amanda N. Robinson's resume.",
    // Own openGraph (not inherited from the root layout's) — Next.js
    // replaces a parent's openGraph object wholesale rather than merging it
    // with a child's, so this needs openGraphDefaults spread back in
    // alongside this page's own url — see site_metadata.ts.
    openGraph: {
        ...openGraphDefaults,
        url: '/resume',
    },
};

export default function ResumePage() {
    return <Resume/>;
}
