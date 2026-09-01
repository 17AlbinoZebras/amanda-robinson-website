import type { Metadata } from "next";
import Education from "../education";
import { openGraphDefaults } from "../site_metadata";

export const metadata: Metadata = {
    title: "Education",
    description: "Amanda N. Robinson's education at Worcester Polytechnic Institute, pursuing a B.S. in Computer Science with a minor in Economics.",
    // Own openGraph (not inherited from the root layout's) — Next.js
    // replaces a parent's openGraph object wholesale rather than merging it
    // with a child's, so this needs openGraphDefaults spread back in
    // alongside this page's own url — see site_metadata.ts.
    openGraph: {
        ...openGraphDefaults,
        url: '/education',
    },
};

export default function EducationPage() {
    return <Education/>;
}
