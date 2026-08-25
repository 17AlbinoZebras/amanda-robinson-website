import type { Metadata } from "next";
import About from "../about";

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about Amanda N. Robinson — her background, activities, leadership, and hobbies outside of software."
};

export default function AboutPage() {
    return <About/>;
}
