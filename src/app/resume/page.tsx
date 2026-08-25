import type { Metadata } from "next";
import Resume from "../resume";

export const metadata: Metadata = {
    title: "Resume",
    description: "View or download Amanda N. Robinson's resume."
};

export default function ResumePage() {
    return <Resume/>;
}
