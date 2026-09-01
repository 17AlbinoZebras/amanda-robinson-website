import type { Metadata } from "next";
import Projects from "../projects";
import { openGraphDefaults } from "../site_metadata";

export const metadata: Metadata = {
    title: "Projects",
    description: "A selection of Amanda N. Robinson's software projects, including Intervle, ShopComp, and a hospital outreach heatmap.",
    // Own openGraph (not inherited from the root layout's) — Next.js
    // replaces a parent's openGraph object wholesale rather than merging it
    // with a child's, so this needs openGraphDefaults spread back in
    // alongside this page's own url — see site_metadata.ts.
    openGraph: {
        ...openGraphDefaults,
        url: '/projects',
    },
};

export default function ProjectsPage() {
    return <Projects/>;
}
