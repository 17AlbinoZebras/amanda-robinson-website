import type { Metadata } from "next";
import About from "../about";
import { openGraphDefaults } from "../site_metadata";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Amanda N. Robinson — her background, activities, leadership, and hobbies outside of software.",
    // Own openGraph (not inherited from the root layout's) — Next.js
    // replaces a parent's openGraph object wholesale rather than merging it
    // with a child's, so this needs openGraphDefaults spread back in
    // alongside this page's own url — see site_metadata.ts.
    openGraph: {
        ...openGraphDefaults,
        url: '/about',
    },
};

export default function AboutPage() {
    return <About/>;
}
