import type { Metadata } from "next";
import Experience from "../experience";
import { openGraphDefaults } from "../site_metadata";

export const metadata: Metadata = {
    title: "Experience",
    description: "Amanda N. Robinson's work experience at the South Florida Proton Therapy Institute, including imaging download automation and a hospital outreach heatmap.",
    // Own openGraph (not inherited from the root layout's) — Next.js
    // replaces a parent's openGraph object wholesale rather than merging it
    // with a child's, so this needs openGraphDefaults spread back in
    // alongside this page's own url — see site_metadata.ts.
    openGraph: {
        ...openGraphDefaults,
        url: '/experience',
    },
};

export default function ExperiencePage() {
    return <Experience/>;
}
