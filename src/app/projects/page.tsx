import type { Metadata } from "next";
import Projects from "../projects";

export const metadata: Metadata = {
    title: "Projects",
    description: "A selection of Amanda N. Robinson's software projects, including Intervle, ShopComp, and a hospital outreach heatmap."
};

export default function ProjectsPage() {
    return <Projects/>;
}
