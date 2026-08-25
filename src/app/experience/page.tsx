import type { Metadata } from "next";
import Experience from "../experience";

export const metadata: Metadata = {
    title: "Experience",
    description: "Amanda N. Robinson's work experience at the South Florida Proton Therapy Institute, including imaging download automation and a hospital outreach heatmap."
};

export default function ExperiencePage() {
    return <Experience/>;
}
